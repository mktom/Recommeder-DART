import React from 'react'

const HomePage = () => (
    <>
        <h3 className='display-4 text-primary'>Welcome to D A R T</h3>
        <h1 className='h1 display-4 text-secondary'>Data Analysis and Recommendation Tool</h1>
<br/>
        <p className='text-muted small'>
        Our Data Analysis & Recommendation Tool (DART) is a framework that leverages local compute resources and emerging web technologies to create, train and allow the simple exportation of recommendation machine learning models. You can provide both the data you wish to train on (image or text) and any associated tags for your dataset. DART would then generate a functional model, which in turn will serve data with the desired set of provided tags. If a set of tags are not provided, the functionality is extended to generate a set of appropriate tags that will provide similar results to a tagged datasets. Once the model is generated, it can be retrieved and exported for use in your own framework with your own customers.</p>

    </>
);

export default HomePage;
