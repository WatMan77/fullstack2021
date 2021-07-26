const initialState = { notification: null, error: null }

export const setNotification = (message, time) => {
  return dispatch => {
    dispatch({
      type: 'MESSAGE',
      data: message
    })
    setTimeout(() => {
      dispatch({
        type: 'EMPTY'
      })
    }, time * 1000)
  }
}

export const setErrorMessage = (error, time) => {
  return dispatch => {
    dispatch({
      type: 'ERROR',
      data: error
    })
    setTimeout(() => {
      dispatch(({
        type: 'EMPTY'
      }))
    }, time * 1000)
  }
}

const notificationReducer = (state = initialState, action) => {
  switch(action.type) {
  case 'EMPTY':
    console.log('Emptying notification')
    return initialState

  case 'MESSAGE':
    return { ...state, notification: action.data }

  case 'ERROR':
    return { ...state, error: action.data }

  default:
    return state
  }
}

export default notificationReducer