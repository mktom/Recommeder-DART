import React from 'react'
import CreateModelForm from '../components/CreateModelForm'

// Renders the Create Model Component
const isActive = true
const CreateModelPage = ({ setOverlay, setOverlayMsg }) => (
    <>
        <h1 className='h1 display-4 text-primary'>Create Model</h1>
        <p className='text-muted'>
          This form allows to create a model. 
        </p>
        <br/><br/>
        <CreateModelForm setOverlay = { setOverlay } setOverlayMsg = { setOverlayMsg } />
    </>
);

export default CreateModelPage;
