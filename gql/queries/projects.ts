import { gql } from '@apollo/client';

const branch = process.env.TARGET_BRANCH;

const GET_PROJECTS = gql`
  query getProjects($courseId: Float!) {
    courses(id: $courseId) {
      projects {
        name
        id
        grade
        students {
          id
          name
        }
        github_url
      }
    }
  }
`;

const GET_PROJECTS_PROD = gql`
  query {
    projects_prod {
      id
      prod_url
    }
  }
`;

const INSERT_PROD_PREVIEW = gql`
  mutation insertProdPreview($projectId: Float!, $image: String!) {
    insert_production_preview(project_id: $projectId, image: $image) {
      id
    }
  }
`;

const GET_PROJECT_IDS = gql`
  query getProjectsIds($courseId: Int!) {
    projects(where: { course_id: { _eq: $courseId } }) {
      id
    }
  }
`;

const GET_PROJECT = gql`
  query getProject($projectId: Float!) {
    projects(id: $projectId) {
      id
      github_url
      prod_url
      name
      grade
      students {
        id
        name
        github_username
      }
      prod_preview_count
    }
  }
`;
const GET_PROJECT_PREVIEWS = gql`
  query getProject($projectId: Float!) {
    projects(id: $projectId) {
      production_previews {
        id
        created_at
        image
      }
    }
  }
`;

const INSERT_PROJECT = gql`
  mutation InsertProject(
    $courseId: Float!
    $projectName: String!
    $githubUrl: String!
    $prodUrl: String!
    $students: [StudentInput!]!
  ) {
    insert_project(
      course_id: $courseId
      name: $projectName
      github_url: $githubUrl
      students: $students
      prod_url: $prodUrl
    ) {
      id
      name
      github_url
      prod_url
      students {
        id
        name
      }
    }
  }
`;

const INSERT_BULK_PROJECTS = gql`
  mutation insertBulkProjects($projects: [ProjectInput!]!, $courseId: Float!) {
    insert_projects(projects: $projects, course_id: $courseId) {
      id
      name
      github_url
      students {
        id
        name
      }
    }
  }
`;

const UPDATE_PROJECT = gql`
  mutation(
    $id: Float!
    $name: String!
    $githubUrl: String!
    $prodUrl: String!
    $students: [StudentInput!]!
  ) {
    update_project(
      id: $id
      name: $name
      github_url: $githubUrl
      prod_url: $prodUrl
      students: $students
    ) {
      id
      name
      github_url
      prod_url
      students {
        name
        github_username
      }
    }
  }
`;

const GRADE_PROJECT = gql`
  mutation($id: Float!, $grade: Float!) {
    grade_project(id: $id, grade: $grade) {
      id
      grade
    }
  }
`;

const UNGRADE_PROJECT = gql`
  mutation($id: Float!) {
    ungrade_project(id: $id) {
      id
      grade
    }
  }
`;

const DELETE_PROJECT = gql`
  mutation deleteProject($projectId: Float!) {
    delete_project(id: $projectId)
  }
`;

const GET_REPO_INFO = gql`
	query getRepoInfo($ownerName: String!, $repoName: String!) {
		repository(owner: $ownerName, name: $repoName) {
			object(expression: "${branch}") {
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
			object(expression: "${branch}") {
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
  GET_PROJECT_PREVIEWS,
  INSERT_PROJECT,
  INSERT_PROD_PREVIEW,
  INSERT_BULK_PROJECTS,
  UPDATE_PROJECT,
  GRADE_PROJECT,
  UNGRADE_PROJECT,
  DELETE_PROJECT,
  GET_REPO_INFO,
  GET_COMMITS,
};
