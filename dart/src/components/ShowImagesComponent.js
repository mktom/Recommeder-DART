import React from 'react'

// Componenet to return the recommended Image files for a queried file
const ShowImagesComponent = ({ imgs, mName, mType }) => {

  return (
    <>
    <div className="container">
    <div className="row imagetiles">
      {imgs.map((img, idx) => {
        return(         
        <div key={'key' + idx} className="col-lg-3 col-md-3 col-sm-3 col-xs-6">
            <img key={'key' + idx} src={img} alt={'key' + idx} className="img-responsive" width="160"/>
        </div>
      )})
      } 
    </div>
</div>
</>
  );
}

export default ShowImagesComponent