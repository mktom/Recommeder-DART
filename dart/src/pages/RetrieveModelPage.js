import React from 'react'
import RetrieveModelForm from '../components/RetrieveModelForm'
const RetrieveModelPage = () => (
<>
        <h1 className='h1 display-4 text-primary'>Retrieve Model</h1>
        <p className='text-muted small'>
          Download trained model. The model can then be used for prediction and recommendations.
        </p>
        <br/><br/>
        <RetrieveModelForm />
    </>
)

export default RetrieveModelPage