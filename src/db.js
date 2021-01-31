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

const db = {
  users,
  posts,
  comments,
};

export { db as default };
