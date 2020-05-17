import React from 'react'
import ExportModelForm from '../components/ExportModelForm'

// Renders the Export Model Component
const ExportModelPage = () => (
<>
        <h1 className='h1 display-4 text-primary'>Export Model</h1>
        <p className='text-muted'>
          Use this form to export model.
        </p>
        <br/><br/>
        <ExportModelForm />
    </>
)

export default ExportModelPage