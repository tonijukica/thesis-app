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

const GET_PROJECTS_PROD = gql`
  {
    projects{
      id
      prod_url
    }
  }
`;
const INSERT_PROD_PREVIEW = gql`
mutation insertProdPreview($projectId: Int!, $image: String!) {
  insert_production_preview(objects: {project_id: $projectId, image: $image}) {
    affected_rows
  }
}
`;

const GET_PROJECT_IDS = gql`
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
      prod_url
      name
      students {
        name
        github_username
        id
      }
      production_previews {
        created_at
        image
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
      createdAt
    }
  }
`;

export {
    GET_PROJECTS,
    GET_PROJECTS_PROD,
    GET_PROJECT_IDS,
    GET_PROJECT,
    INSERT_PROJECT,
    INSERT_PROD_PREVIEW,
    INSERT_BULK_PROJECTS,
    DELETE_PROJECT,
    GET_REPO_INFO,
    GET_COMMITS,
}