from flask import Flask, render_template, request, jsonify, abort, send_file, Response, send_file, redirect
from flask_cors import CORS
import logging, os, sys, shutil, atexit, json, base64, pickle, pymongo, traceback
from pymongo import MongoClient
from pathlib import Path
from mydb import *
from model.tagged_model import TaggedModel
from dart import *

app = Flask(__name__, static_folder="../dist", template_folder="../")

CORS(app)

directory_path = os.path.normpath(os.getcwd() + os.sep + os.pardir)
print("Directory Path : ", directory_path)

# Generates a local uploads folder in the current working directory with sub-directories for text, sound and images
[(Path(os.path.dirname(os.path.abspath(__file__)) + f"/uploads/{f_type}/files").mkdir(parents=True, exist_ok=True), 
            Path(os.path.dirname(os.path.abspath(__file__)) + f"/uploads/{f_type}/tags").mkdir(parents=True, exist_ok=True))
                for f_type in ["image", "text", "sound"]]

#Creates a universal endpoint to serve a static index.html file which allows React to, on the front-end, route to the appropriate URL accordingly
@app.route("/", defaults={'path': ''})
@app.route('/<path:path>')
def index(path):
  return render_template("index.html", last_updated=str(os.path.getmtime(os.sep.join([directory_path, "dart", "index.html"]))))

# Create Model API
# Creates a new entry to insert the MongoDB Database to store all the pertinent files and descriptors
# Obtains the values as JSON Data with the File Objects being interpreted as Werkzeug FileStorage Objects
@app.route("/create-form", methods=["POST"])
def create_form():
  resp = None
  try:
    if request.method == 'POST':
      # Abstracts the string values from the JSON Data
      c_type = request.form.get('contentType')
      m_name = request.form.get('modelName')
      mDesc = request.form.get('modelDescription')

      # Determines the path of the files and tags to save to the uploads folder
      tr_f_path = os.path.join(Path(__file__).parent.absolute(), "uploads", c_type, "files", m_name)
      tg_f_path = os.path.join(Path(__file__).parent.absolute(), "uploads", c_type, "tags", m_name)
      
      Path(tr_f_path).mkdir(parents=True, exist_ok=True)
      Path(tg_f_path).mkdir(parents=True, exist_ok=True)

      tr_files = []
      tg_files = []

      #Saves the training files to the appropriate uploads folder
      if 'trainFiles' in request.files:
        for tfile in request.files.getlist('trainFiles'):
          tr_files.append(tfile.filename)
          tfile.save(os.path.join(tr_f_path, tfile.filename))
      print("Training Files Uploaded...")
        
      # Saves the tagging files to the appropriate uploads folder
      if 'tagFiles' in request.files:
        for tgfile in request.files.getlist('tagFiles'):
          tg_files.append(tgfile.filename)
          tgfile.save(os.path.join(tg_f_path, tgfile.filename))  

      print("Tag Files uploaded...")

      # Trains the model and caches it for improved performance during testing in the Find Form or in the Recommendations Form
      # We can't pass the file and tag names as a list as they are not hashable, instead, we are passing them as tuples
      # https://www.geeksforgeeks.org/python-convert-a-list-into-a-tuple/
      # https://stackoverflow.com/questions/49210801/python3-pass-lists-to-function-with-functools-lru-cache
      model = load_model(m_name, (*tr_files, ), (*tg_files, ), c_type) 
      
      # Pickles and saves the trained model for future retrival to download or to export 
      save_model = True
      model_saved_path = ''
      if save_model:
        stored_model_dir = os.path.join(Path(__file__).parent.absolute(), "saved_models", c_type)
        Path(stored_model_dir).mkdir(parents=True, exist_ok=True)

        model_saved_path = os.path.join(stored_model_dir, f'{m_name}.pkl')
        # serialise and store the model
        pickle.dump(model, open(model_saved_path, 'wb'))
        print(f'Model saved. Path {model_saved_path}')

      # Creats a new view to insert data into MongoDB database
      _m_info = {
        'model_name' : m_name,
        'model_desc' : mDesc,
        'model_type' : c_type,
        'model_training_files' : tr_files,
        'model_tag_files' : tg_files,
        'model_path' : model_saved_path,
        'model_details': {
          'accuracy' : 85
        }
      }

      # Inserts the view into the collection "model_infos" in the MongoDB database
      store_model_info(_m_info)
      print("Stored Model Informations ...")

      # Returns the success parameters of the trained Model
      resp_data = json.dumps({
        'status' : 'success',
        'model_details' : {
          'model_name':m_name,
          'accuracy':85
        }
      })
      resp = Response(resp_data, status=200)
  except Exception as error:
    print('Error has occurred!')
    resp_data = json.dumps({
      'status' : 'failure',
      'msg' : '502 Error has occurred'
    })
    resp = Response(resp_data, status=500)

  return resp



# Find API
# Returns the recommended items for a specified trained model, content-type and testing file provided
# Obtains the values as JSON Data with the File Objects being interpreted as Werkzeug FileStorage Objects
@app.route("/find", methods=["POST"])
def find():
  try:
    #Abstracts the string values from the JSON Data
    c_type = request.form.get('contentType')
    m_name = request.form.get('modelName')
    f_name = request.form.get('fileName')

    # Determines the path of the training files and tags in the uploads folder
    train_files_path = os.path.join(Path(__file__).parent.absolute(), "uploads", c_type, "files", m_name)

    # Creates a new folder to save the test files depending on the content-type 
    test_files_path = os.path.join(Path(__file__).parent.absolute(), "uploads", c_type, "test", m_name)
    Path(test_files_path).mkdir(parents=True, exist_ok=True)

    # Saves the testing files to the appropriate sub-directory in the uploads folder
    if 'testFiles' in request.files:
        for tfile in request.files.getlist('testFiles'):
          tfile.save(os.path.join(test_files_path, tfile.filename))
          f_name = tfile.filename
    print("Test Files Uploaded...")

    # Retrieves the view stored for the collection "model_infos" in the MongoDB databasefor the specified model name
    _model_data = get_model_info(m_name)

    # Gets the filenames and tagnames for the specified model
    tr_files = _model_data['model_training_files']
    tg_files = _model_data['model_tag_files']

    # Trains the model with the retrieved training files and tags
    results = get_result_from_model(m_name, f_name, (*tr_files, ), (*tg_files, ), c_type)

    # Determines what must be sent depending on the content type specified
    res_data = []
    for file in results:
      if c_type == "text":
        read_text = open(os.path.join(train_files_path, file), "r")
        res_data.append(read_text.read())
      
      elif c_type == 'image':
        read_image = open(os.path.join(train_files_path, file), "rb")

        b64_img = base64.b64encode(read_image.read())
        b64_str = b64_img.decode('utf-8')
        
        f_type = file.split(".")[-1] 
        img_type = f_type if f_type != "jpg" else "jpeg"
        
        img_data = f"data:image/{img_type};base64,{b64_str}"
        res_data.append(img_data)

    # Returns the success parameters of the queried test file 
    resp_data = json.dumps({
      'status' : 'success',
      'results' : res_data
    })

    resp = Response(resp_data, status=200)

  except Exception as error:
    print('Error Occurred')
    print(traceback.format_exc())
    resp_data = {
      'status' : 'failure'
    }
    resp = Response(resp_data, status=500)
  return resp


# Find Export Link API
# Retrieves the custom URL endpoint stored in the MongoDB database for a specified model name 
# Returns the recommended items for a specified trained model, content-type and testing file provided
# Obtains the values as JSON Data with the File Objects being interpreted as Werkzeug FileStorage Objects
@app.route("/findFromLink", methods=["POST"])
def findFromLink():
  try:
    # Abstracts the modelLink obtainde from the POST request
    mLink = request.form.get('modelLink')

    # Checks to see if the custom URL has been stored in the MongoDB database
    res = get_exports(mLink)

    # Abstracts the string values from the JSON Data
    c_type = res['model_type']
    m_name = res['model_name']
    f_name = request.form.get('fileName')

    # Determines the path of the training files and tags in the uploads folder
    train_files_path = os.path.join(Path(__file__).parent.absolute(), "uploads", c_type, "files", m_name)
    
    # Creates a new folder to save the test files depending on the content-type 
    test_files_path = os.path.join(Path(__file__).parent.absolute(), "uploads", c_type, "test", m_name)
    Path(test_files_path).mkdir(parents=True, exist_ok=True)

    # Saves the testing files to the appropriate sub-directory in the uploads folder  
    if 'testFiles' in request.files:
        for tfile in request.files.getlist('testFiles'):
          tfile.save(os.path.join(test_files_path, tfile.filename))
          f_name = tfile.filename
    print("Test Files Uploaded...")


    # Retrieves the view stored for the collection "model_infos" in the MongoDB databasefor the specified model name
    _model_data = get_model_info(m_name)

    # Gets the filenames and tagnames for the specified model
    tr_files = _model_data['model_training_files']
    tg_files = _model_data['model_tag_files']

    # Trains the model with the retrieved training files and tags
    results = get_result_from_model(m_name, f_name, (*tr_files, ), (*tg_files, ), c_type)

    # Determines what must be sent depending on the content type specified
    res_data = []
    for file in results:
      if c_type == "text":
        read_text = open(os.path.join(train_files_path, file), "r")
        res_data.append(read_text.read())
      
      elif c_type == 'image':
        read_image = open(os.path.join(train_files_path, file), "rb")

        b64_img = base64.b64encode(read_image.read())
        b64_str = b64_img.decode('utf-8')
        
        f_type = file.split(".")[-1] 
        img_type = f_type if f_type != "jpg" else "jpeg"
        
        img_data = f"data:image/{img_type};base64,{b64_str}"
        res_data.append(img_data)

    # Returns the success parameters of the queried test file
    resp_data = json.dumps({
      'status' : 'success',
      'results' : res_data
    })

    resp = Response(resp_data, status=200)

  except Exception as error:
    print('Error Occurred')
    print(traceback.format_exc())
    resp_data = {
      'status' : 'failure'
    }
    resp = Response(resp_data, status=500)
  return resp


# Retrieve API
# Returns a the Pickle file for a specified model and content type
@app.route("/retrieve-model/<c_type>/<m_name>", methods=["GET"])
def retrieve(c_type=None, m_name=None):
  try:
    # Returns the pickle as a File Object back to the React App
    m_path = os.path.join(Path(__file__).parent.absolute(), "saved_models", c_type, f'{m_name}.pkl')
    return send_file(m_path, mimetype='application/octet-stream', attachment_filename=f'{m_name}.pkl', as_attachment=True)
  except Exception as error:
    print('Error Occurred: ')
    abort(404)

# Retrieve Model Name API
# Returns all available models for the specified content type
@app.route("/retrieve-model", methods=["POST"])
def retrieve2():
  try:
    # Abstracts all string values from the form Data
    c_type = request.form.get('contentType')
    m_name = request.form.get('modelName')
    
    # Checks for all the pickled models stored for a specified model and content-type
    m_path = os.path.join(Path(__file__).parent.absolute(), "saved_models", c_type, f'{m_name}.pkl')
    data = open(m_path).read()
    return data
  except Exception as error:
    print('Error Occurred: ')
    return "failure"

# Get Stored Models API
# Returns all the model Names stored for a specfic content type
@app.route("/get-models/<contentType>", methods=["GET", "POST"])
def get_modes_of_type(contentType):
  models = get_all_models_of_type(contentType)
  resp_data = json.dumps({
    'models':models
  })

  resp = Response(resp_data, status=200)
  return resp


# Get Stored Models API
# Obtains the custom URL endpoint name to serve to store in the MongoDB database
@app.route("/export-model", methods=["POST"])
def export_model():
  resp = None
  try:
    # Abstracts all the string values from form Data
    cType = request.form.get('contentType')
    mName = request.form.get('modelName')
    exLoc = request.form.get('exportLocation')
    
    print(cType, mName, exLoc)

    _m_export_info = {
        'model_name' : mName,
        'model_type' : cType,
        'model_link' : exLoc,      
      }

    # Save the custom URL endpoint in the database
    store_export_info(_m_export_info)

    resp_data = json.dumps({
      'model_link':exLoc,
      'model_name': mName,
      'status':'success'
    })
    
    resp = Response(resp_data, status=200)
  
  except Exception as error:
    print('Error has occurred!')
    resp_data = json.dumps({
      'status' : 'failure',
      'msg' : '502 Error has occurred'
    })
    resp = Response(resp_data, status=500)
    
  return resp


# Get Exported Models
# Returns all the custom URL endpoints stored in the MongoDB database 
@app.route("/exported-models", methods=["GET", "POST"])
def get_expored_models():
  results = get_all_exports()
  resp_data = json.dumps({
    'models':results
  })

  resp = Response(resp_data, status=200)
  return resp

# Resource Not found Error Endpoint  
@app.errorhandler(404)
def page_not_found(error):
   return render_template('404.html', title = '404'), 404

if __name__ == "__main__":
    app.run(debug=True) 