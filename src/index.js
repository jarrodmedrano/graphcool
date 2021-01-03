import { GraphQLServer } from "graphql-yoga";

// String, Boolean, Int, Float

// Demo user data

const users = [
  {
    id: "1",
    name: "Andrew",
    email: "andrew@example.com",
    age: 27,
  },
  {
    id: "2",
    name: "Sarah",
    email: "sarah@exmaple.com",
  },
  {
    id: "3",
    name: "Mike",
    email: "mike@example.com",
  },
];

const posts = [
  {
    id: "1",
    title: "Post1",
    body: "My post body",
    published: true,
    author: "1",
  },
  {
    id: "2",
    title: "Post2",
    body: "My post body 2",
    published: true,
    author: "1",
  },
  {
    id: "3",
    title: "Post3",
    body: "My post body",
    published: true,
    author: "2",
  },
];

const comments = [
  {
    id: "1",
    text: "a comment",
    author: "1",
    post: "1",
  },
  {
    id: "2",
    text: "another comment",
    author: "2",
    post: "2",
  },
  {
    id: "3",
    text: "another comment 3",
    author: "1",
    post: "3",
  },
];

// Type Definitions schema

const typeDefs = `
  type Query {
    users(query: String): [User!]!
    me: User!
    post: Post!
    comment: Comment!
    posts(query: String): [Post!]!
    comments(query: String): [Comment!]!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    age: Int
    posts: [Post!]!
    comments: [Comment!]!
  }
  
  type Post {
    id: ID!
    title: String!
    body: String!
    published: Boolean!
    type: String!
    author: User!
    comments: [Comment!]!
  }

  type Comment {
    id: ID!
    text: String!
    author: User!
    post: Post!
  }
`;

// Resolvers
const resolvers = {
  Query: {
    users(parent, args, ctx, info) {
      if (!args.query) {
        return users;
      }
      return users.filter((user) => {
        return user.name.toLowerCase().includes(args.query.toLowerCase());
      });
    },
    comments(parent, args, ctx, info) {
      if (!args.query) {
        return comments;
      }
      return comments.filter((comment) => {
        return comment.text.toLowerCase().includes(args.query.toLowerCase());
      });
    },
    posts(parent, args, ctx, info) {
      if (!args.query) {
        return posts;
      }
      return posts.filter((post) => {
        const isTitleMatch = post.title
          .toLowerCase()
          .includes(args.query.toLowerCase());
        const isBodyMatch = post.body
          .toLowerCase()
          .includes(args.query.toLowerCase());
        return isTitleMatch || isBodyMatch;
      });
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
    comment() {
      return {
        id: "1",
        text: "some comment",
      };
    },
  },
  Post: {
    author(parent, args, ctx, info) {
      return users.find((user) => {
        return user.id === parent.author;
      });
    },
    comments(parent, args, ctx, info) {
      return comments.filter((comment) => {
        return comment.post === parent.id;
      });
    },
  },
  Comment: {
    author(parent, args, ctx, info) {
      return users.find((user) => {
        return user.id === parent.author;
      });
    },
    post(parent, args, ctx, info) {
      return posts.find((post) => {
        return post.id === parent.post;
      });
    },
  },
  User: {
    posts(parent, args, ctx, info) {
      return posts.filter((post) => {
        return post.author === parent.id;
      });
    },
    comments(parent, args, ctx, info) {
      return comments.filter((comment) => {
        return comment.author === parent.id;
      });
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
