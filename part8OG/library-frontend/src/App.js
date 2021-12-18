
import { useApolloClient, useSubscription } from '@apollo/client'
import React, { useState, useEffect } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import LoginForm from './components/LoginForm'
import NewBook from './components/NewBook'
import Recommend from './components/Recommend'
import { ALL_BOOKS, BOOK_ADDED } from './query'

const App = () => {
  const [page, setPage] = useState('authors')
  const [token, setUserToken] = useState(null)
  const client = useApolloClient()

  const updateCacheWith = (addedBook) => {
    const includeIn = (set, object) =>
    set.map(p => p.id).includes(object.id)

    const dataInStore = client.readQuery({ query: ALL_BOOKS })
    if(!includeIn(dataInStore.allBooks, addedBook)) {
      client.writeQuery({
        query: ALL_BOOKS,
        data: { allBooks : dataInStore.allBooks.concat(addedBook)}
      })
    }
  }

  useSubscription(BOOK_ADDED, {
    onSubscriptionData: ({ subscriptionData }) => {
      console.log(subscriptionData)
      const book = subscriptionData.data.bookAdded
      window.alert(
        `Added book: ${book.title} by ${book.author.name}`
      )
      updateCacheWith(book)
    }
  })

  useEffect(() => {
    setUserToken(localStorage.getItem('book-user-token'))
  }, [])

  const logout = () => {
    setUserToken(null)
    localStorage.clear()
    client.resetStore()
  }

  const loggedIn = token
  ? 
  <>
    <button onClick={() => setPage('add')} >add book</button>
    <button onClick={() => setPage('recommend')}>recommend</button>
    <button onClick={logout}>logout</button>
  </>
  : null

  const loggedOut = token
  ? null
  :
  <>
   <button onClick={() => setPage('login')} >login</button>
  </>



  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        {loggedIn}
        {loggedOut}
      </div>

      <Authors
        show={page === 'authors'}
      />

      <Books
        show={page === 'books'}
      />

      <NewBook
        show={page === 'add'}
      />

      <LoginForm
        show={page === 'login'}
        setToken={setUserToken}
        setPage={setPage}
      />

      <Recommend 
        show={page === 'recommend'}
      />

    </div>
  )
}

export default App