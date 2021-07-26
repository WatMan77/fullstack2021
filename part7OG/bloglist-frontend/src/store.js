import notificationReducer from './reducers/notificationReducer'
import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
import blogReducer from './reducers/blogReducer'
import userReducer from './reducers/userReducer'

const finalReducer = combineReducers({
  notification: notificationReducer,
  blogs: blogReducer,
  user: userReducer
})

const store = createStore(
  finalReducer,
  composeWithDevTools(
    applyMiddleware(thunk)
  )
)

export default store