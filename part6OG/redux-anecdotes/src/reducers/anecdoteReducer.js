import anecdoteService from '../services/anecdotes'
import { setNotification, removeNotification } from '../reducers/notificationReducer'

const anecdotesAtStart = [
  'If it hurts, do it more often',
  'Adding manpower to a late software project makes it later!',
  'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
  'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
  'Premature optimization is the root of all evil.',
  'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
]

// const getId = () => (100000 * Math.random()).toFixed(0)

const asObject = (anecdote) => {
  return {
    content: anecdote,
    votes: 0
  }
}

// const initialState = anecdotesAtStart.map(asObject)

export const voteAnecdote = (anecdote) => {
  return async dispatch => {
    // Save vote to backend
    await anecdoteService.saveVote(anecdote)
    // Use dispatch to update the front-end page
    dispatch({
      type: 'VOTE',
      data: { id: anecdote.id }
    })
    dispatch(setNotification(`You voted: '${anecdote.content}'`, 5))
  }
}

export const createAnecdote = (content) => {
  return async dispatch => {
    const newNote = await anecdoteService.createNew(content)
    dispatch({
      type: 'NEW_ANECDOTE',
      data: newNote
    })
    dispatch(setNotification(`Anecdote created: ${newNote.content}`, 5))
  }
}

export const initializeAnecs = () => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll()
    dispatch({
      type: 'INIT_ANECS',
      data: anecdotes
    })
  }
}

const reducer = (state = [], action) => {
  console.log('state now: ', state)
  console.log('action', action)
  switch(action.type) {
    case 'VOTE':
      const id = action.data.id
      const anecToVote = state.find(n => n.id === id)
      const changedAnec = {
        ...anecToVote,
        votes: anecToVote.votes + 1
      }
      // This returns the whole state, but if the correct anecdote is found
      // put changedAnec instead
      return state.map(anec => anec.id === id ? changedAnec : anec)
    
    case 'NEW_ANECDOTE':
      return [...state, action.data]

    case 'INIT_ANECS':
      return action.data

    default:
      return state
  }
}

export default reducer