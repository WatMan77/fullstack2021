import React from 'react'
import AnecdoteForm from './components/AnecdoteForm'
import AnecdotesList from './components/AnecdoteList'

const App = () => {
  return (
    <div>
      <AnecdoteForm />
      <AnecdotesList />
    </div>
  )
}

export default App