import { GraphQLServer } from "graphql-yoga";

// String, Boolean, Int, Float

// Type Definitions schema

const typeDefs = `
  type Query {
    greeting(name: String, position: String): String!
    grades: [Int!]!
    add(numbers: [Float!]!): Float!
    me: User!
    post: Post!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    age: Int
  }

  type Post {
    id: ID!
    title: String!
    body: String!
    published: Boolean!
    type: String!
  }
`;

// Resolvers
const resolvers = {
  Query: {
    greeting(parent, args, ctx, info) {
      if (args.name && args.position) {
        return `Hello, ${args.name}! You are my favorit ${args.position}`;
      } else {
        return "Hello!";
      }
    },
    add(parent, args, ctx, info) {
      if (args.numbers.length === 0) {
        return 0;
      }

      // [1, 5, 10, 2]
      return args.numbers.reduce((acc, curr) => {
        return acc + curr;
      });
    },
    grades(parent, args, ctx, info) {
      return [99, 80, 93];
    },
    me() {
      return {
        id: "123098",
        name: "Mike",
        email: "mike@example.com",
        age: 28,
      };
    },
    post() {
      return {
        id: "12345",
        title: "New Post",
        body: "New Body",
        published: true,
        type: "blog",
      };
    },
  },
};

const server = new GraphQLServer({
  typeDefs,
  resolvers,
});

server.start(() => {
  console.log("the server is up!");
});
