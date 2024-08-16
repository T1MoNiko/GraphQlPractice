const express = require('express');
const cors = require('cors');
const axios = require('axios');
const { buildSchema } = require('graphql');
const { graphqlHTTP } = require('express-graphql');

// Определение схемы GraphQL
const schema = buildSchema(`
  type Post {
    userId: Int
    id: Int
    title: String
    body: String
  }

  type Query {
    posts: [Post]
    post(id: Int!): Post
  }
`);

const root = {
  posts: async () => {
    const response = await axios.get('https://jsonplaceholder.typicode.com/posts');
    return response.data;
  },
  post: async ({ id }) => {
    const response = await axios.get(`https://jsonplaceholder.typicode.com/posts/${id}`);
    return response.data;
  },
};

const app = express();

app.use(cors());

app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}/graphql`);
});
