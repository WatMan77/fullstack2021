import reducer from './reducers/anecdoteReducer'
import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
import notificationReducer from './reducers/notificationReducer'

const finalReducer = combineReducers({
  anecdotes: reducer,
  notification: notificationReducer
})

const store = createStore(
  finalReducer,
  composeWithDevTools(
    applyMiddleware(thunk)
    )
  )

export default store
