const Query = {
  users(parent, args, { db }, info) {
    if (!args.query) {
      return db.users;
    }
    return db.users.filter((user) => {
      return user.name.toLowerCase().includes(args.query.toLowerCase());
    });
  },
  comments(parent, args, { db }, info) {
    if (!args.query) {
      return db.comments;
    }
    return db.comments.filter((comment) => {
      return comment.text.toLowerCase().includes(args.query.toLowerCase());
    });
  },
  posts(parent, args, { db }, info) {
    if (!args.query) {
      return db.posts;
    }
    return db.posts.filter((post) => {
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
};

export { Query as default };
