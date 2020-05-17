import React from 'react'
import RecommendationForm from '../components/RecommendationForm'

const RecommendationPage = ({ setOverlay, setOverlayMsg }) => (
    <>
        <h1 className='h1 display-4 text-primary'>Recommendation</h1>
        <p className='text-muted'>Use this form for recommendation</p>
        <br/><br/>
        <RecommendationForm />
    </>
)

export default RecommendationPage