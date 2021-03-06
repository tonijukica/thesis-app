import { gql } from '@apollo/client';

const GET_COURSES = gql`
  query {
    courses {
      course_name
      id
      projects_count
    }
  }
`;

const INSERT_COURSE = gql`
  mutation insertCourse($name: String!, $year: String!) {
    insert_course(name: $name, year: $year) {
      course_name
      id
      year
    }
  }
`;

const DELETE_COURSE = gql`
  mutation deleteCourse($name: String!) {
    delete_courses(where: { course_name: { _eq: $name } }) {
      returning {
        course_name
      }
    }
  }
`;

const INESRT_COURSE_BULK_PROJECTS = gql`
  mutation insertCourseWithBulkProjects(
    $courseName: String!
    $year: String!
    $projects: [ProjectInput!]!
  ) {
    insert_course(name: $courseName, year: $year, projects: $projects) {
      id
    }
  }
`;

const DELETE_COURSE_BY_ID = gql`
  mutation deleteCourse($courseId: Float!) {
    delete_course(id: $courseId)
  }
`;

export {
  GET_COURSES,
  INSERT_COURSE,
  INESRT_COURSE_BULK_PROJECTS,
  DELETE_COURSE,
  DELETE_COURSE_BY_ID,
};
