import React, { useState, useEffect, useRef } from 'react'
import bsCustomFileInput from 'bs-custom-file-input' 
import axios from 'axios'
import ShowImagesComponent from './ShowImagesComponent'

const useForceUpdate = () => useState()[1]

const FindForm = ({ setOverlay, setOverlayMsg }) => {
  const [contentType, setContentType] = useState('')
  const [modelName, setModelName] = useState('')

  const [models, setModels] = useState([])
  const [images, setImages] = useState([])

  const testFile = useRef(null)
  const forceUpdate = useForceUpdate()
  
  useEffect(() => {
    // following hook is required to fix the   
    // BS file input not showing the selected file
    // its using bs-custom-file-input
    // https://stackblitz.com/edit/bs-custom-file-input-react
    // https://stackoverflow.com/questions/53945763/componentdidmount-equivalent-on-a-react-function-hooks-component
    bsCustomFileInput.init();
  }, []); // called whenever the component is loaded

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
  if(contentType === '---' || contentType ===''){
    alert("Select Content Type")
    return false;
  }
  
  if(modelName === '---' || modelName === '')  {
    alert("Model Name is required")
    return false
  }

  if(testFile.current.files.length === 0) {
    alert("Sample file is required.")
    return false;
  }

  let upfile = testFile.current.files[0]
  if(contentType === "text" & !(/\.txt$/gi.test(upfile.name))){
    alert("Please supply valid text file");
    return false;
  }
  if(contentType === "image" & !(/\.jpe?g|png|tiff|gif/gi.test(upfile.name))){
    alert("Please supply valid image file");
    return false;
  }
  
  return true;
}


  /*** Form Actions ***/
  const handleContentTypeChange = (evt) => {
    let cType = evt.target.value
    setContentType(cType)
    updateModels(cType)
  }

  // form submit handler
  const handleSubmit = (evt) => {
    evt.preventDefault();
    if(!validateForm()) return;

    let formData = new FormData()

    const tFile = testFile.current.files[0]
    formData.set("contentType", contentType)
    formData.set("modelName", modelName)
    formData.set("fileName", tFile.name);
    formData.set("testFiles", tFile);

    axios.post("http://localhost:5000/find", formData, {})
      .then(
        response => {
          console.log(response.data.status)
          const results = response.data.results
          setImages(results)
        }

    ).catch(err => {
      console.log(err)
    });
  }

  // Resets the form
  const handleFormReset = (evt) => {
    evt.target.reset()
  }

  return (
    <>
    <form className="form-group" method="post" encType="multipart/form-data" onSubmit={ handleSubmit } onReset={ handleFormReset }>
    <div className="input-group mb-3">
        <div className="input-group-prepend">
          <label className="input-group-text" htmlFor="inputContentType">Content Type&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</label>
        </div>
        <select className="custom-select" id="inputContentType" onChange={ handleContentTypeChange }>
          <option defaultValue value="---">Select Content Type</option>
          <option value="text">Text</option>
          <option value="image">Image</option>
          <option value="sound">Sound</option>   
        </select>
      </div>

      <div className="input-group mb-3">
        <div className="input-group-prepend">
          <label className="input-group-text" htmlFor="inputModels">Available Models</label>
        </div>
        <select className="custom-select" id="inputModelName" onChange={e => setModelName(e.target.value)}>
        <option value="---">Select Model</option>
          { models.map((model) => 
              (<option value={model} key={model + "1"}>{model}</option>)
            )}         
        </select>
      </div>

      <div className="input-group mb-3">
        <div className="input-group-prepend">
          <span className="input-group-text">Sample&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
        </div>
        <div className="custom-file">
            <input type="file" className="custom-file-input" id="inputSample" ref={testFile} onChange={forceUpdate} name="inputSample" />
            <label className="custom-file-label" htmlFor="inputSample">text, image, sound</label>
        </div>
      </div>

      <br/><br/>

      <button type="submit" className="btn btn-primary">Find</button>{ ' ' }
      <button type="reset" className="btn btn-secondary">Reset</button>
    </form>
    <br/>
    
    <ShowImagesComponent mName="m" mType="mt" imgs = {images} />
    </>
  );
}

export default FindForm