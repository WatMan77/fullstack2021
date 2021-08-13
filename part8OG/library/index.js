const { ApolloServer, UserInputError, gql, AuthenticationError } = require('apollo-server')
const mongoose = require('mongoose')
const config = require('./config.js')
const Book = require('./models/book.js')
const Author = require('./models/author.js')
const User = require('./models/user.js')
const book = require('./models/book.js')
const jwt = require('jsonwebtoken')

const { PubSub } = require('graphql-subscriptions')
const pubsub = new PubSub()

const JWT_SECRET = 'mypassword'

mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error in connection to MongoDB', error.message)
  })

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

  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }

  type Token {
    value: String!
  }

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]
    allAuthors: [Author!]!
    me: User
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

    createUser(
      username: String!
      favoriteGenre: String
    ): User

    login(
      username: String!
      password: String!
    ): Token
  }

  type Subscription {
    bookAdded: Book!
  }
`

const resolvers = {

  Query: {
    bookCount: () => Book.collection.countDocuments(),
    authorCount: () => Author.collection.countDocuments(),
    allBooks: async(root, args) => {
      let foundBooks = await Book.find({}).populate('author')
      return foundBooks
    },
    allAuthors: async() => {
      let books = await Book.find({}).populate('author')
      let authors = await Author.find({})
      authors.forEach(x => {
        // Not the most effective way... Maybe a Map of authors would've been better
        x.bookCount = books.filter(l => l.author.name === x.name).length
      })
      return authors
    },
    me: (root, args, context) => {
      return context.currentUser
    }
  },

  Mutation: {
    addBook: async(root, args, context) => {
      const theUser = context.currentUser
      if(!theUser){
        throw new AuthenticationError('not authenticated')
      }
      let author = await Author.findOne({ name: args.author})
      if(!author) {
        author = new Author({ name: args.author })
        try {
          await author.save()
        } catch (e) {
          throw new UserInputError(e.message, {
            invalidArgs: args
          })
        }
        
      }
      // So the 'author' parameter takes the whole author object
      // not just the id! Caused a lot of problems in the subscriptions!!
      const book = new Book({ ...args, author: author })
      try {
        await book.save()
      } catch (e){
        throw new UserInputError(e.message, {
          invalidArgs: args
        })
      }
      pubsub.publish('BOOK_ADDED', { bookAdded: book })

      return book
      
    },
    editAuthor: async(root, args, context) => {
      const theUser = context.currentUser
      if(!theUser){
        throw new AuthenticationError('not authenticated')
      }
      const author = await Author.findOne({ name: args.name })
      author.born = args.setBornTo
      try {
        return author.save()
      } catch (e) {
        throw new UserInputError(e.message, {
          invalidArgs: args
        })
      }
    },
    createUser: (root, args) => {
      const user = new User({ username: args.username, favoriteGenre: args.favoriteGenre })
      return user.save()
      .catch(error => {
        throw new UserInputError(error.message, {
          invalidArgs: args
        })
      })
    },
    login: async(root, args) => {
      const user = await User.findOne({ username: args.username })

      if(!user || args.password !== 'secret') {
        throw new UserInputError('wrong credentials')
      }

      const userForToken = {
        usrrname: user.username,
        id: user._id
      }

      return { value : jwt.sign(userForToken, JWT_SECRET)}
    }
  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator(['BOOK_ADDED'])
    }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async({ req }) => {
    const auth = req ? req.headers.authorization : null
    if(auth && auth.toLowerCase().startsWith('bearer ')) {
      const decodedToken = jwt.verify(
        auth.substring(7), JWT_SECRET
      )
      const currentUser = await User.findById(decodedToken.id)
      return { currentUser }
    }
  }
})

server.listen().then(({ url, subscriptionsUrl }) => {
  console.log(`Server ready at ${url}`)
  console.log(`Subscriptions ready at ${subscriptionsUrl}`)
})