const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const cors = require('cors');

// Sample in-memory data
const books = [
    { id: "1", title: "GraphQL Basics", author: "John Doe" },
    { id: "2", title: "Learning GraphQL", author: "Jane Smith" },
];

// GraphQL Schema
const schema = buildSchema(`
    type Book {
        id: ID!
        title: String!
        author: String!
    }

    type Query {
        books: [Book]
        book(id: ID!): Book
    }

    type Mutation {
        addBook(title: String!, author: String!): Book
    }
`);

// Resolvers
const root = {
    books: () => books,
    book: ({ id }) => books.find(book => book.id === id),
    addBook: ({ title, author }) => {
        const newBook = { id: String(books.length + 1), title, author };
        books.push(newBook);
        return newBook;
    }
};

const app = express();
app.use(cors());

app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true  // Enables GraphiQL tool for testing GraphQL queries
}));

const PORT = 4000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/graphql`);
});
