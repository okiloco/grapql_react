const express = require("express");
const app = express();
const cors = require("cors");
const express_graphql = require("express-graphql");
const { buildSchema } = require("graphql");

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
const { courses } = require("./data.json");

const schema = buildSchema(`
  type Query {
      message: String
      course(id: Int): Course
      courses(topic: String): [Course]
      allCourse: [Course]
  }

  type Course {
      id: Int
      title: String
      author: String
      topic: String
      description: String
      url: String
  }

  type Mutation {
    updateCourseTopic(id:Int!,topic:String!): Course
  }
`);

let getCourse = args => {
  let id = args.id;
  return courses.filter(item => item.id == id)[0];
};
let getCourses = args => {
  let { topic } = args;
  if (topic) {
    return courses.filter(item => item.topic == topic);
  } else {
    return courses;
  }
};
let updateCourseTopic = ({ id, topic }) => {
  courses.map(item => {
    if (item.id == id) {
      item.topic = topic;
    }
    return item;
  });
  return courses.filter(item => item.id === id)[0];
};
let getAllCourses = () => {
    return courses;
}
const root = {
  message: () => "Hello world!",
  course: getCourse,
  courses: getCourses,
  updateCourseTopic,
  allCourse:getAllCourses
};

app.use(
  "/___graphql",
  cors(),
  express_graphql({
    schema,
    rootValue: root,
    graphiql: true
  })
);

app.listen(3000, () => console.log("Server is runing."));
