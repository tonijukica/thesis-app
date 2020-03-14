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

const GET_PROJECT_IDS = gql `
query getProjectsIds($courseId: Int!) {
  projects(where: {course_id: {_eq: $courseId}}) {
    id
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
const INSERT_BULK_PROJECTS = gql`
mutation insertBulkProjects($projects: [projects_insert_input!]!) {
  insert_projects(objects: $projects) {
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

const GET_REPO_INFO = gql`
query getRepoInfo($ownerName: String!, $repoName: String!)  {
    repository(owner: $ownerName, name: $repoName) {
      object(expression: "master") {
        ... on Commit {
          history(first: 1) {
            totalCount
            nodes {
              message
              authoredDate
            }
          }
        }
      }
    }
  }  
`;

const GET_COMMITS = gql`
query getCommits($repoName: String!, $owner: String!) {
    repository(name: $repoName, owner: $owner) {
      object(expression: "master") {
        ... on Commit {
          history(first: 100) {
            nodes {
              id
              message
              commitUrl
              committedDate
              author {
                user {
                  login
                }
              }
            }
          }
        }
      }
    }
  }
`;

export {
    GET_PROJECTS,
    GET_PROJECT_IDS,
    GET_PROJECT,
    INSERT_PROJECT,
    INSERT_BULK_PROJECTS,
    DELETE_PROJECT,
    GET_REPO_INFO,
    GET_COMMITS
}