const { ApolloServer, UserInputError, gql } = require('apollo-server')
const mongoose = require('mongoose')
const config = require('./config.js')
const Book = require('./models/book.js')
const Author = require('./models/author.js')
const book = require('./models/book.js')

mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error in connection to MongoDB', error.message)
  })

let authors = [
  {
    name: 'Robert Martin',
    id: "afa51ab0-344d-11e9-a414-719c6709cf3e",
    born: 1952,
  },
  {
    name: 'Martin Fowler',
    id: "afa5b6f0-344d-11e9-a414-719c6709cf3e",
    born: 1963
  },
  {
    name: 'Fyodor Dostoevsky',
    id: "afa5b6f1-344d-11e9-a414-719c6709cf3e",
    born: 1821
  },
  { 
    name: 'Joshua Kerievsky', // birthyear not known
    id: "afa5b6f2-344d-11e9-a414-719c6709cf3e",
  },
  { 
    name: 'Sandi Metz', // birthyear not known
    id: "afa5b6f3-344d-11e9-a414-719c6709cf3e",
  },
]

/*
 * Suomi:
 * Saattaisi olla järkevämpää assosioida kirja ja sen tekijä tallettamalla kirjan yhteyteen tekijän nimen sijaan tekijän id
 * Yksinkertaisuuden vuoksi tallennamme kuitenkin kirjan yhteyteen tekijän nimen
 *
 * English:
 * It might make more sense to associate a book with its author by storing the author's name in the context of the book instead of the author's id
 * However, for simplicity, we will store the author's name in connection with the book
*/

let books = [
  {
    title: 'Clean Code',
    published: 2008,
    author: 'Robert Martin',
    id: "afa5b6f4-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring']
  },
  {
    title: 'Agile software development',
    published: 2002,
    author: 'Robert Martin',
    id: "afa5b6f5-344d-11e9-a414-719c6709cf3e",
    genres: ['agile', 'patterns', 'design']
  },
  {
    title: 'Refactoring, edition 2',
    published: 2018,
    author: 'Martin Fowler',
    id: "afa5de00-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring']
  },
  {
    title: 'Refactoring to patterns',
    published: 2008,
    author: 'Joshua Kerievsky',
    id: "afa5de01-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring', 'patterns']
  },  
  {
    title: 'Practical Object-Oriented Design, An Agile Primer Using Ruby',
    published: 2012,
    author: 'Sandi Metz',
    id: "afa5de02-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring', 'design']
  },
  {
    title: 'Crime and punishment',
    published: 1866,
    author: 'Fyodor Dostoevsky',
    id: "afa5de03-344d-11e9-a414-719c6709cf3e",
    genres: ['classic', 'crime']
  },
  {
    title: 'The Demon ',
    published: 1872,
    author: 'Fyodor Dostoevsky',
    id: "afa5de04-344d-11e9-a414-719c6709cf3e",
    genres: ['classic', 'revolution']
  },
]

const typeDefs = gql`

  type Book {
    title: String!
    published: Int!
    author: Author!
    genres: [String!]
    id: ID!
  }

  type Author {
    name: String!
    id: ID!
    born: Int
    bookCount: Int
  }

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]
    allAuthors: [Author!]!
  }

  type Mutation {
    addBook(
      title: String!
      published: Int!
      genres: [String!]
      author: String!
      born: Int
    ): Book

    editAuthor(
      name: String,
       setBornTo: Int
      ): Author
  }
`

const resolvers = {

  Query: {
    bookCount: () => Book.collection.countDocuments(),
    authorCount: () => authors.length,
    allBooks: async(root, args) => {
      let foundBooks = await Book.find({}).populate('author')
      console.log('foundBooks now:', foundBooks)
      return foundBooks
      // let booksCopy = [...books]
      // if(args.author){
      //   booksCopy = booksCopy.filter(x => x.author === args.author)
      // }
      // if(args.genre) {
      //   booksCopy = booksCopy.filter(x => x.genres.includes(args.genre))
      // }
      // return booksCopy
    },
    allAuthors: () => {
      return Author.find({})
    }
      // authors.map(x => {
      // x.bookCount = books.filter(l => l.author === x.name).length
      // return x
    // })
  },/* 
  Book: {
    author: (root) => {
      return {
        name: root.author,
        born: root.born
      }
    }
  }, */

  Mutation: {
    addBook: async(root, args) => {
      console.log('creating a book!')
      const author = new Author({ name: args.author })
      if(!authors.includes(args.author)) {
        console.log('Created author:', author)
        authors = authors.concat(author)
        await author.save()
      }
      console.log('args?', args)
      const book = new Book({ ...args, author: author.id })
      console.log('created book', book)
      books = books.concat(book)
      console.log('saving book...')
      return book.save()
    },
    editAuthor: (root, args) => {
      const person = authors.find(p => p.name === args.name)
      if(!person) {
        return null
      }
      const updatedAuthor = { ...person, born: args.setBornTo }
      authors = authors.map(x => x.name === args.name ? updatedAuthor : x)
      return updatedAuthor
    }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`)
})