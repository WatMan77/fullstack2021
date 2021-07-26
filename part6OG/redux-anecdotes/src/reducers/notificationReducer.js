const initialState = ''

export const setNotification = (message, time) => {
  return async dispatch => {
    dispatch({
      type: 'MESSAGE',
      data: message
    })
    console.log('Going empty in 5 seconds')
    setTimeout(() => {
      dispatch({
        type: 'EMPTY',
        data: 'MESSAGE'
      })
    }, time * 1000)
  }
}

export const removeNotification = () => {
  return {
    type: 'EMPTY',
    data: ''
  }
}

const notificationReducer = (state = initialState, action) => {
  switch(action.type) {
    case 'EMPTY':
      return initialState

    case 'MESSAGE':
      return action.data

    default:
      return state
  }
}

export default notificationReducer