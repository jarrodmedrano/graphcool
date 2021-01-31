import { v4 as uuidv4 } from "uuid";

const Mutation = {
  createPost(parent, args, { db, pubsub }, info) {
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

    post.published &&
      pubsub.publish(`post`, {
        post: {
          mutation: "CREATED",
          data: post,
        },
      });

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
  deletePost(parent, args, { db, pubsub }, info) {
    const postIdx = db.posts.findIndex((post) => post.id === args.id);

    if (postIdx === -1) {
      throw new Error("Post not found");
    }

    const [post] = db.posts.splice(postIdx, 1);

    db.comments = db.comments.filter((comment) => {
      const match = comment.post === args.id;

      if (match) {
        db.comments = db.comments.filter((comment) => comment.post === args.id);
      }
    });

    if (post.published) {
      pubsub.publish("post", {
        post: {
          mutation: "DELETED",
          data: post,
        },
      });
    }

    return post;
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
  deleteComment(parent, args, { db, pubsub }, info) {
    const commentIdx = db.comments.findIndex(
      (comment) => comment.id === args.id
    );

    const [deletedComment] = db.comments.splice(commentIdx, 1);

    pubsub.publish(`comment ${deletedComment.post}`, {
      comment: {
        mutation: "DELETED",
        data: deletedComment,
      },
    });

    if (commentIdx === -1) {
      throw new Error("Comment not found");
    }

    return deletedComment;
  },

  updatePost(parent, args, { db, pubsub }, info) {
    const { id, data } = args;
    const originalPost = { ...post };

    const post = db.posts.find((post) => {
      console.log("post", post);
      return post.id === id;
    });

    if (!post) {
      throw new Error("Post not found");
    }

    if (typeof data.title === "string") {
      post.title = data.title;
    }

    if (typeof data.body === "string") {
      post.body = data.body;
    }

    if (typeof data.published === "boolean") {
      post.published = data.published;

      if (originalPost.published && !post.published) {
        pubsub.publish({
          post: {
            mutation: "DELETED",
            data: originalPost,
          },
        });
      } else if (!originalPost.published && post.published) {
        pubsub.publish("post", {
          post: {
            mutation: "CREATED",
            data: post,
          },
        });
      }
    } else if (post.published) {
      pubsub.publish("post", {
        post: {
          mutation: "UPDATED",
          data: post,
        },
      });
    }

    return post;
  },

  createComment(parent, args, { db, pubsub }, info) {
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
    pubsub.publish(`comment ${args.data.post}`, { comment });

    pubsub.publish("comment", {
      comment: {
        mutation: "CREATED",
        data: comment,
      },
    });

    return comment;
  },
  updateComment(parent, args, { db, pubsub }, info) {
    const { id, data } = args;
    const comment = db.comments.find((comment) => comment.id === id);

    if (!comment) {
      throw new Error("Comment not found");
    }

    if (typeof data.text === "string") {
      comment.text = data.text;
    }

    pubsub.publish(`comment ${comment.post}`, {
      comment: {
        mutation: "UPDATED",
        data: comment,
      },
    });

    return comment;
  },
};

export { Mutation as default };
