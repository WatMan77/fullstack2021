import React from 'react'
import { Link } from 'react-router-dom'

const User = ({ username, amount, id }) => {
  const userStyle = {
    paddingTop: 2,
    paddingLeft: 2,
    marginBottom: 5,
  }

  //Personally did not have a problem with the user
  // not being defined

  return (
    <div style={userStyle}>
      <tbody>
        <tr>
          <td>
            <Link to={`/users/${id}`}>{username}</Link>
          </td>
          <td>
            {amount}
          </td>
        </tr>
      </tbody>
    </div>
  )
}

export default User