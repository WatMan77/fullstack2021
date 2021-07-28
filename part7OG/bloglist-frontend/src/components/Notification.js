import React from 'react'
import { Alert } from 'react-bootstrap'

const Notification = ({ message }) => {
  if(message === null){
    return null
  }

  return (
    <div>
      {(message &&
        <Alert variant="success">
          {message}
        </Alert>)}
    </div>
  )
}

export default Notification