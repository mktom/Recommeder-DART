import React from 'react'
import { Alert, Button } from 'react-bootstrap'


// A custom Alert Component to serve in the browser
const AlertComponent = ({show, setShow, alertContent}) => {
  return (
    <>
      <Alert show={show} variant="success">
        <Alert.Heading>How's it going?!</Alert.Heading>
        <p>
          {alertContent}
        </p>
        <hr />
        <div className="d-flex justify-content-end">
          <Button onClick={() => setShow(false)} variant="outline-success">
            C
          </Button>
        </div>
      </Alert>
    </>
  );
}

export default AlertComponent;
