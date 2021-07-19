const initialState = {
  message: '',
  timer: undefined
}

export const setNotification = (message, time) => {
  return async dispatch => {
    let timer = setTimeout(() => {
      dispatch({
        type: 'EMPTY',
      })
    }, time * 1000)

    dispatch({
      type: 'MESSAGE',
      data: {
        message,
        timer: timer
      }
    })
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
      if(state.timer){
        clearTimeout(state.timer)
      }
      return { timer: action.data.timer, message: action.data.message}
      // return action.data.message

    default:
      return state
  }
}

export default notificationReducer