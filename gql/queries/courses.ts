import { gql } from 'apollo-boost';

const GET_COURSES = gql`
{
    courses {
      course_name
      id
      projects_aggregate {
        aggregate {
          count
        }
      }
    }
}
`;
const INSERT_COURSE = gql`
    mutation insertCourse($name: String!, $numProjects: String!) {
        insert_courses(objects: {course_name: $name, year: $numProjects}) {
        returning {
            course_name
            id
            year
        }
        }
    }
`;

const DELETE_COURSE = gql`
mutation deleteCourse($name: String!) {
    delete_courses(where: {course_name: {_eq: $name}}) {
      returning {
        course_name
      }
    }
  }
`;
export {
    GET_COURSES, 
    INSERT_COURSE,
    DELETE_COURSE,
}