import { v4 as uuidv4 } from "uuid";

const Mutation = {
  createPost(parent, args, { db }, info) {
    const userExists = db.users.some((user) => {
      return user.id === args.data.author;
    });

    if (!userExists) {
      throw new Error("User not found");
    }

    const post = {
      id: uuidv4(),
      ...args.data,
    };

    db.posts.push(post);

    return post;
  },
  updateUser(parent, args, { db }, info) {
    const { id, data } = args;
    const user = db.users.find((user) => user.id === id);

    if (!user) {
      throw new Error("User not found");
    }

    if (typeof data.email === "string") {
      const emailTaken = db.users.some((user) => user.email === data.email);

      if (emailTaken) {
        throw new Error("Email taken");
      }

      user.email = data.email;
    }

    if (typeof data.name === "string") {
      user.name = data.name;
    }

    if (typeof data.age !== "undefined") {
      user.age = data.age;
    }

    return user;
  },
  createUser(parent, args, { db }, info) {
    const emailTaken = db.users.some((user) => {
      return user.email === args.data.email;
    });

    if (emailTaken) {
      throw new Error("Email Taken Liam Neeson");
    }

    const one = {
      name: "Philadelphia",
      country: "USA",
    };

    const two = {
      population: 150000,
      ...one,
    };

    const user = {
      id: uuidv4(),
      ...args.data,
    };

    db.users.push(user);

    return user;
  },
  deletePost(parent, args, { db }, info) {
    const postIdx = db.posts.findIndex((post) => post.id === args.id);

    if (postIdx === -1) {
      throw new Error("Post not found");
    }

    const deletedPosts = db.posts.splice(postIdx, 1);

    comments = db.comments.filter((comment) => {
      const match = comment.post === args.id;

      if (match) {
        comments = db.comments.filter((comment) => comment.post === args.id);
      }
    });

    return deletedPosts[0];
  },
  deleteUser(parent, args, { db }, info) {
    const userIndex = db.users.findIndex((user) => user.id === args.id);

    if (userIndex === -1) {
      throw new Error("User not found");
    }

    const deletedUsers = db.users.splice(userIndex, 1);

    posts = db.posts.filter((post) => {
      const match = post.author === args.id;

      if (match) {
        comments = db.comments.filter((comment) => comment.post === comment.id);
      }

      return !match;
    });

    comments = db.comments.filter((comment) => comment.author !== args.id);

    return deletedUsers[0];
  },
  deleteComment(parent, args, { db }, info) {
    const commentIdx = db.comments.findIndex(
      (comment) => comment.id === args.id
    );

    const deletedComments = db.comments.splice(commentIdx, 1);

    if (commentIdx === -1) {
      throw new Error("Comment not found");
    }

    return deletedComments[0];
  },
  createComment(parent, args, { db }, info) {
    const userExists = db.users.some((user) => {
      return user.id === args.data.author;
    });

    const postExists = db.posts.some(
      (post) => post.id === args.data.post && post.published
    );

    if (!postExists || !userExists) {
      throw new Error("Unable to find user and post");
    }

    const comment = {
      id: uuidv4(),
      ...args.data,
    };

    db.comments.push(comment);

    return comment;
  },
};

export { Mutation as default };
