import React, { useEffect, useState } from 'react'
import axios from 'axios'


const ExportedModelsComponent = () => {
  const [exportedModels, setExportedModels] = useState([])

// Asynchronously fetches data from Flask server for a specified endpoint
const fetchData = async (ax_meth, ax_url, ax_data, depend) => {
  return await ax_meth(ax_url, ax_data, depend)
    .then(response => {
      console.log('Body: ' + response.data);
      return response;
    });
}

// Returns all the custom URL endpoints stored in the MongoDB database
const update = () => {
  let formData = new FormData();
  fetchData(axios.get, `http://localhost:5000/exported-models`, formData, {})
    .then(result => {

      if(result.data.models.length > 0) {
        result.data.models.map( (r) => console.log(r) )
        setExportedModels(result.data.models)
      } else{
        alert(`No models of type '${contentType}' are stored. Please create new model of the type.`);
      }
    }).catch(err => {
      console.log(err)
    });
}

  useEffect( () => {
    update()
}, []) // called whenever the component is loaded


  return (
    <>
      {exportedModels.map((model, idx) => {
        return(   
          <>
          <a key={'key' + idx} onClick={() => alert('hi')}  href={`/find/${model['model_link']}`}>{model['model_name']}</a><br/>
          </>
      )})
      } 

    </>
  );
}

export default ExportedModelsComponent;
