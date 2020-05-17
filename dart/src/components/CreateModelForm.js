import React, { useState, useEffect, useRef } from 'react'
import { useInput } from '../hooks/InputHook'
import bsCustomFileInput from 'bs-custom-file-input'
import axios from 'axios'

const useForceUpdate = () => useState()[1]

const CreateModelForm = ({ setOverlay, setOverlayMsg }) => {
  const { value:valueContentType, bind:bindContentType, reset:resetContentType } = useInput('')
  const { value:valueModelName, bind:bindModelName, reset:resetModelName } = useInput('')
  const { value:valueModelDescription, bind:bindModelDescription, reset:resetModelDescription } = useInput('')
  
  const trainingFiles = useRef(null)
  const tagFiles =useRef(null)
  const forceUpdate = useForceUpdate()
  
  useEffect(() => {
    // following hook is required to fix the   
    // BS file input not showing the selected file
    // its using bs-custom-file-input
    // https://stackblitz.com/edit/bs-custom-file-input-react
    // https://stackoverflow.com/questions/53945763/componentdidmount-equivalent-on-a-react-function-hooks-component
    bsCustomFileInput.init();
    // setTimeout(() => setShowDialog(true), 2000);
  }, []); // called whenever the component is loaded

  /*** Validations ***/
  const validateForm = () => {
    if(valueContentType === "") {
      alert("Select Content Type")
      return false
    }
    
    if(trainingFiles.current.files.length === 0) {
      alert("Training files are required.")
      return false;
    }

    if(valueContentType ==='image' && trainingFiles.current.files.length < 20 ){
      alert("Number of training files should be atleast 20")
      return false;
    }

    if(valueModelName === "") {
      alert("Model Name is required")
      return false
    }
    return true;
  }


  /*** Form Actions ***/
  const handleSubmit = (evt) => {
    evt.preventDefault();

    // Check for validation
    if(!validateForm()) return;

    let formData = new FormData()

    const tFiles = trainingFiles.current.files
    const tgFiles = tagFiles.current.files

    for (let file of tFiles) {
      formData.append("trainFiles", file)
    }

    for (let file of tgFiles) {
      formData.append("tagFiles", file)
    }
    formData.set("contentType", valueContentType)
    formData.set("modelName", valueModelName)
    formData.set("modelDescription", valueModelDescription)

    // api call
    axios.post("http://localhost:5000/create-form", formData, {})
      .then(
        response => {
          const status = response.data.status

          if(status === 'success') {
            const mName = response.data.model_details.model_name
            setOverlay(false)
            alert('Model \'' + mName + '\' trained/loaded successfully. \n\nModel is ready to be downloaded or exported.')
          }
        }

    ).catch(err => {
      console.log(err)
    });

    setOverlayMsg('Creating / Training Model ...')
    setOverlay(true);
  }

  // Resets the form
  const handleFormReset = (evt) => {
    evt.target.reset()
    resetFormState()
  }

  // Resets the state information
  const resetFormState = () => {
    resetContentType();
    resetModelName();
  }

  return (
    <>
    <form className="form-group" method="post" encType="multipart/form-data" onSubmit={ handleSubmit } onReset={ handleFormReset }>
      <div className="input-group mb-3">
        <div className="input-group-prepend">
          <label className="input-group-text" htmlFor="inputContentType">Content Type&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</label>
        </div>
        <select className="custom-select" id="inputContentType" {...bindContentType}>
          <option value="---">Select Content Type</option>
          <option value="text">Text</option>
          <option value="image">Image</option>
          <option value="sound">Sound</option>   
        </select>
      </div>

      <div className="input-group mb-3">
        <div className="input-group-prepend">
          <span className="input-group-text" id="fl">File Location&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
        </div>
        <div className="custom-file">
            <input type="file" className="custom-file-input" multiple /*directory="" webkitdirectory=""*/ id="inputFileTraining" 
              ref={trainingFiles} onChange={forceUpdate} name="inputFileTraining" aria-describedby="fl" /*{...bindTrainingLoc}*/ 
              accept=".jpg,.jpeg,.png,.txt,.csv"/>
            <label className="custom-file-label text-truncate" htmlFor="inputFileTraining">Choose file</label>
        </div>
      </div>
      
      <div className="input-group mb-3">
        <div className="input-group-prepend">
          <span className="input-group-text">Tag Location&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
        </div>
        <div className="custom-file">
            <input type="file" className="custom-file-input" multiple id="inputFileTags" 
              ref={tagFiles} onChange={forceUpdate} name="inputFileTags" 
              accept=".json"/>
            <label className="custom-file-label text-truncate" htmlFor="inputFileTags">Choose file</label>
        </div>
      </div>

      <br/>

      <div className="input-group mb-3">
        <div className="input-group-prepend">
          <span className="input-group-text">Model Name&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
        </div>
            <input type="text" className="form-control" id="inputModelName" placeholder="my_model" {...bindModelName} />
      </div>
      
      <div className="input-group mb-3">
        <div className="input-group-prepend">
          <span className="input-group-text">Model Description</span>
        </div>
            <input type="text" className="form-control" id="inputModelDescription" placeholder="My model" {...bindModelDescription} />
      </div>

      <br/><br/>
      
      <button type="submit" className="btn btn-primary">Create Model</button>{ ' '}
      <button type="reset" className="btn btn-secondary">Reset</button>
    </form>
    </>
  );
}

export default CreateModelForm