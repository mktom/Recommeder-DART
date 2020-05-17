import React from 'react'
import FindForm from '../components/FindForm'
const FindPage = ({ setOverlay, setOverlayMsg }) => (
    <>
        <h1 className='h1 display-4 text-primary'>Find Similar Items</h1>
        <p className='text-muted'>Use this form for recommendation</p>
        <br/><br/>
        <FindForm setOverlay = { setOverlay } setOverlayMsg = { setOverlayMsg }/>
    </>
)

export default FindPage