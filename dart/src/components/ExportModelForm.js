import React, { useState } from 'react'
import axios from 'axios'

const ExportModelForm = () => {
  const [contentType, setContentType] = useState('')
  const [modelName, setModelName] = useState('')
  const [exportLoc, setExportLoc] = useState('')

  const [models, setModels] = useState([])

  // Asynchronously fetches data from Flask server for a specified endpoint
  const fetchData = async (ax_meth, ax_url, ax_data, depend) => {
    return await ax_meth(ax_url, ax_data, depend)
      .then(response => {
        console.log('Body: ' + response.data);
        return response;
      });
  }

  // Retrieves all the models for a specified content type to dynamically populate the dropdown
  const updateModels = (contentType) => {
    //Checks if the page has been loaded with an empty dropdown
    if(contentType === '' || contentType === '---') return; 

    let formData = new FormData();
    fetchData(axios.get, `http://localhost:5000/get-models/${contentType}`, formData, {})
      .then(result => {
        if(result.data.models.length > 0) {
          setModels(result.data.models)
        } else{
          alert(`No models of type '${contentType}' are stored. Please create new model of the type.`);
        }
      }).catch(err => {
        console.log(err)
      });
  }


  /*** Validations ***/
  const validateForm = (evt) => {
    if(contentType == '---' || contentType ==''){
      alert("Select Content Type")
      return false;
    }
    
    if(modelName === '---' || modelName === '')  {
      alert("Model Name is required")
      return false
    }

    if(exportLoc === '') {
      alert("Export Location is required")
      return false
    }

    if(!exportLoc.match(/^[a-zA-Z0-9_]+$/)) { // matches characterclass class
      alert("Export Location is invalid. \nExport Location can only contain alphanumeric characters and underscore")
    }

    return true;
  }

  // Form submit
  const handleSubmit = (evt) => {
    evt.preventDefault();

    if(!validateForm()) return;

    let formData = new FormData();
    formData.set('modelName', modelName)
    formData.set('contentType', contentType)
    formData.set('exportLocation', exportLoc)

    // api call
    axios.post("http://localhost:5000/export-model", formData, {})
      .then(
        response => {
          const status = response.data.status
          const mName = response.data.model_name
          const mLink = response.data.model_link
          
          if(status === 'success') {
            alert('Model \'' + mName + '\' exported successfully. \n\nModel can be accessed through \'http://localhost:5000/find/' + mLink)
          }
        }
    ).catch(err => {
      console.log(err)
    });
  }
  
  // Updates the value for 
  const handleContentTypeChange = (evt) => {
    let cType = evt.target.value
    setContentType(cType)
    updateModels(cType)
  }

  // Resets the form
  const handleFormReset = (evt) => {
    evt.target.reset()
    resetFormState()
  }

  // Resets the state information
  const resetFormState = () => {
    setContentType('');
    setModelName('');
    setExportLoc('');
  }

  return (
    <form className="form-group" onSubmit={ handleSubmit } onReset={ handleFormReset }>

      <div className="input-group mb-3">
        <div className="input-group-prepend">
          <label className="input-group-text" htmlFor="inputContentType">Content Type&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</label>
        </div>
        <select className="custom-select" id="inputContentType" onChange={ handleContentTypeChange } >
          <option defaultValue value="---">Select Content Type</option>
          <option value="text">Text</option>
          <option value="image">Image</option>
          <option value="sound">Sound</option>   
        </select>
      </div>
      
      <div className="input-group mb-3">
        <div className="input-group-prepend">
          <label className="input-group-text" htmlFor="inputModelName">Available Models</label>
        </div>
        <select className="custom-select" id="inputModelName" onChange={e => setModelName(e.target.value)}>
          <option value="---">Select Model</option>
          { models.map((model) => 
              (<option value={model} key={model + "1"}>{model}</option>)
            )}         
        </select>
      </div>

      <br/>

      <div className="input-group mb-3">
        <div className="input-group-prepend">
          <span className="input-group-text">Export Location&nbsp;&nbsp;</span>
        </div>
        <div className="custom-file">
            <input type="text" className="form-control" id="inputExportLoc" placeholder="mymodel" onChange={e => setExportLoc(e.target.value)}/>
        </div>
      </div>

      <br/>
      <br/>
      <button type="submit" className="btn btn-primary">Export</button>{ ' '}
      <button type="reset" className="btn btn-secondary">Reset</button>
    </form>
  );
}

export default ExportModelForm