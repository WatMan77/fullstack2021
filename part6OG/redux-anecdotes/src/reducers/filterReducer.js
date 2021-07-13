const initialState = ''
// WORK IN PROGRESS!
export const anecdoteFilter = (filtering) => {
  return {
    type: 'FILTER',
    data: filtering
  }
}

const filterReducer = (state=initialState, action) => {
  switch(action.style) {
    case 'FILTER':
      return state.filter(x => x.includes(action.data))
    default:
      return state
  } 
}

export default filterReducer