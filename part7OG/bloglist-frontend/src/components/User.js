import React from 'react'
import { Link } from 'react-router-dom'

const User = ({ username, amount, id }) => {
  const userStyle = {
    paddingTop: 2,
    paddingLeft: 2,
    marginBottom: 5,
  }

  //Personally did not have a problem with the user being
  // not being defined

  return (
    <div style={userStyle}>
      <Link to={`/users/${id}`}>{username}</Link> {amount}
    </div>
  )
}

export default User