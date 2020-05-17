import React, { useState, useEffect, useRef } from 'react'
import bsCustomFileInput from 'bs-custom-file-input' 
import axios from 'axios'
import ShowImagesComponent from './ShowImagesComponent'

const useForceUpdate = () => useState()[1]

const RecommendationForm = () => {
  const [modelLinks, setModelLinks] = useState([])
  const [modelLink, setModelLink] = useState()

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

    updateModelLinks()

  }, []); // called whenever the component is loaded

// Asynchronously fetches data from Flask server for a specified endpoint
const fetchData = async (ax_meth, ax_url, ax_data, depend) => {
  return await ax_meth(ax_url, ax_data, depend)
    .then(response => {
      console.log('Body: ' + response.data);
      return response;
    });
}

// Retrieves all the custom URL endpoints in the database
const updateModelLinks = () => {
  if(modelLinks === '' || modelLinks === '---') return; 

  let formData = new FormData();
  fetchData(axios.get, `http://localhost:5000/exported-models`, formData, {})
    .then(result => {
      if(result.data.models.length > 0) {
        setModelLinks(result.data.models)
      } else{
        alert(`No models found.`);
      }
    }).catch(err => {
      console.log(err)
    });
}


/*** Validations ***/
const validateForm = (evt) => {
  if(modelLinks === '---' || modelLinks ===''){
    alert("Select Model Link ")
    return false;
  }


  if(testFile.current.files.length === 0) {
    alert("Sample file is required.")
    return false;
  }

  let upfile = testFile.current.files[0]
  
  return true;
}


  /*** Form Actions ***/
  const handleSubmit = (evt) => {
    evt.preventDefault();
    if(!validateForm()) return;

    let formData = new FormData()

    const tFile = testFile.current.files[0]
    formData.set("modelLink", modelLink)
    formData.set("fileName", tFile.name);
    formData.set("testFiles", tFile);

    axios.post("http://localhost:5000/findFromLink", formData, {})
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
          <label className="input-group-text" htmlFor="inputModels">Select Model Link</label>
        </div>
        <select className="custom-select" id="inputModelName" onChange={e => setModelLink(e.target.value)}>
        <option value="---">Select Model Link</option>
          { modelLinks.map((modelLink) => 
              (<option value={modelLink['model_link']} key={modelLink['model_link'] + "1"}>{modelLink['model_link']}</option>)
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

export default RecommendationForm