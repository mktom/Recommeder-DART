from pymongo import MongoClient

PROJECT_DB = 'final-proj'

# Connects to the final-proj database in the MongoDB server
def get_db():
  client = MongoClient()
  db = client['final-proj-db']  # final project db

  return db

# Retrieves the current status of the MongoDB database
def get_db_status():
  db = get_db()
  print(db.command("serverStatus"))

# Stores a new view in the model_infos collection
def store_model_info(model_info):
   #Selects the model_infos collection to store the model training and tag files
  db = get_db()
  c_model_infos = db.model_infos

  # Creates a new view to insert into the database
  _model_info = {
    "model_name": model_info.get('model_name'),
    "model_type": model_info.get('model_type'),
    "model_desc": model_info.get('model_desc'),
    "model_path": model_info.get('model_path'),
    "model_details": model_info.get('model_details'),
    "model_training_files": model_info.get('model_training_files'),
    "model_tag_files": model_info.get('model_tag_files')
  }

  r_id = c_model_infos.insert_one(_model_info)
  print(r_id)

# Stores a custom URL endpoint in the model_exports collection
def store_export_info(model_export_info):
  
  #Selects the model_exports collection to store the endpoint
  db = get_db()
  c_model_exports = db.model_exports

  _model_export = {
    "model_name": model_export_info.get('model_name'),
    "model_type": model_export_info.get('model_type'),
    "model_link": model_export_info.get('model_link'),
  }

  r_id = c_model_exports.insert_one(_model_export)
  print(r_id)

# Retreives all the model names for a specified data type 
def get_all_models_of_type(type):
  db = get_db()
  cursor = db.model_infos.find({'model_type': type}, {
                               'model_name': 1, '_id': 0})

  models = [doc['model_name'] for doc in list(cursor)]
  print(models)

  return sorted(list(set(models)))

# Retreives all the views associated with a specified model name
def get_model_info(name):
  db = get_db()
  r_model = db.model_infos.find_one({'model_name': name})
  return r_model

# Retrieves all the views associated with a custom URL endpoint 
def get_exports(export_loc):
  db = get_db()
  r_export = db.model_exports.find_one({'model_link': export_loc})
  return r_export

# Retreieves all the views in the model_exports collection
def get_all_exports():
  db = get_db()
  cursor_res = db.model_exports.find({})
  
  results = []
  for item in list(cursor_res):
    print(item)
    results.append({'model_type':item['model_type'], 'model_name':item['model_name'], 'model_link':item['model_link']})

  return results
