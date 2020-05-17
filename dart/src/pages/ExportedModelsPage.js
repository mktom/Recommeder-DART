import React, {useEffect, useState} from 'react'
import ExportedModelsComponent from '../components/ExportedModelsComponent'

// Renders the Exported Models Component
const ExportedModelsPage = () => (
    <>
        <h1 className='h1 display-4 text-primary'>Exported Models</h1>
        <p className='text-muted'>
          List of exported Models 
        </p>
        <p><b>NOTE: The links shown are for demonstartion purposes. Please, use the Recommendations Page to use your exported model.</b></p>
        <br/><br/>
        <ExportedModelsComponent />
    </>
);

export default ExportedModelsPage;
