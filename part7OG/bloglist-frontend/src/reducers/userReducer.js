
export const setUser = (user) => {
  return dispatch => {
    dispatch({
      type: 'SET',
      data: user
    })
  }
}

const userReducer = (state = null, action) => {
  switch(action.type) {
  case 'SET':
    return action.data

  case 'EMTPY':
    return null

  default:
    return state
  }
}

export default userReducer