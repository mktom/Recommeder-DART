import React, { useState } from 'react'
import { Modal, Button } from 'react-bootstrap'

//Creates a Dialog box to serve upon page load
const ModalDialog = ({ sd }) => {
  alert("INSIDE" + sd.flag)
  const [showDialog, setShowDialog] = useState (true)
  

 const handleClose = (ss) => {
   setShowDialog(false)
}
  return (
    <Modal show={ showDialog } onHide={handleClose}>
        <Modal.Header closeButton>
  <Modal.Title>{sd.header}</Modal.Title>
        </Modal.Header>
  <Modal.Body>{sd.content}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
  )
}

export default ModalDialog