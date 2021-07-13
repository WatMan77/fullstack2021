const initialState = 'initial Message'

const notificationReducer = (state = initialState, action) => {
  switch(action.type) {
    case 'EMPTY':
      return initialState

    default:
      return state
  }
}

export default notificationReducer