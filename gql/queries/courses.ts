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

const INESRT_COURSE_BULK_PROJECTS = gql`
mutation insertCourseWithBulkProjects($courseName: String!, $year: String!, $projects: [projects_insert_input!]!) {
  insert_courses(objects: {course_name: $courseName, year: $year, projects: {data: $projects}}) {
    returning {
      id
    }
  }
}
`;

const DELETE_COURSE_BY_ID = gql`
mutation deleteCourse($courseId: Int!) {
    delete_courses(where: {id: {_eq: $courseId}}) {
      returning {
        course_name
      }
    }
  }
`;

export {
    GET_COURSES, 
    INSERT_COURSE,
    INESRT_COURSE_BULK_PROJECTS,
    DELETE_COURSE,
    DELETE_COURSE_BY_ID
}