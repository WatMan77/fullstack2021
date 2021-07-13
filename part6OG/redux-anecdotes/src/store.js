import reducer from './reducers/anecdoteReducer'
import { createStore, combineReducers } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import notificationReducer from './reducers/notificationReducer'

const finalReducer = combineReducers({
  anecdotes: reducer,
  notification: notificationReducer
})

const store = createStore(
  finalReducer,
  composeWithDevTools()
  )

export default store
