import { gql } from 'apollo-boost';

const GET_PROJECTS = gql`
query getProjects($courseId: Int!) {
    projects(where: {course_id: {_eq: $courseId}}) {
      name
      id
      students {
        id
        name
      }
      github_url
    }
  }  
`;

const GET_PROJECT = gql`
query getProject($projectId: Int!) {
    projects(where: {id: {_eq: $projectId}}) {
      github_url
      name
      students {
        name
        github_username
        id
      }
    }
  }  
`;

const INSERT_PROJECT = gql`
mutation InsertProject($courseId: Int!, $projectName: String!, $githubUrl: String!, $students: [student_insert_input!]!) {
    insert_projects(objects: {
      course_id: $courseId, 
      name: $projectName, 
      github_url: $githubUrl, 
      students: {data: $students}
    }) 
    {
        returning {
            id
            name
            github_url
            students {
              id
              name
            }
        }
    }
  }  
`;
const DELETE_PROJECT = gql`
mutation deleteProject($projectId: Int!) {
    delete_student(where: {project_id: {_eq: $projectId}}) {
      affected_rows
    }
    delete_projects(where: {id: {_eq: $projectId}}) {
      affected_rows
    }
  }
  
`;

export {
    GET_PROJECTS,
    GET_PROJECT,
    INSERT_PROJECT,
    DELETE_PROJECT
}