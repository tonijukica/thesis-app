import { FunctionComponent, useState, useEffect } from 'react';
import { Grid, Button, makeStyles, createStyles, TextField, InputAdornment } from '@material-ui/core';
import { useQuery, useMutation } from '@apollo/react-hooks';
import  DeleteIcon from '@material-ui/icons/Delete';
import SearchIcon from '@material-ui/icons/Search';
import ProjectBox from './ProjectBox';
import ProjectDialog from './ProjectDialog';
import { gql } from 'apollo-boost';
import { Student, Project } from '../../interfaces'; 

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
type ProjectListProps = {
    courseId: number
}
const useStyles = makeStyles(() => createStyles({
   container: {
       paddingBottom: '16px',
       borderBottom: '1px solid #e1e4e8 !important'
   },
   button: {
    marginRight: '8px'
   },
   header: {
       paddingTop: '16px',
       textAlign: 'center',
       paddingBottom: '16px',
       borderBottom: '1px solid #e1e4e8 !important'
   }
  }));

const ProjectList: FunctionComponent<ProjectListProps> = ({courseId}) => {
    const classes = useStyles();
    const [dialog, setDialog] = useState(false);
    const [deleteMode, setDeleteMode] = useState(false);
    const [deleteProject] = useMutation(DELETE_PROJECT);
    const { data } = useQuery(GET_PROJECTS, { variables: { courseId}});
    const [insertProject] = useMutation(INSERT_PROJECT);
    const [projects, setProjects] = useState<Project []>([]);
    const [projectName, setProjectName] = useState('');
    const [projectUrl, setProjectUrl] = useState('');
    const [students, setStudents] = useState<Student []>([]);

    useEffect(() => {
        if(data)
            setProjects(data.projects)
    }, [data]);
    const handleDialogOpen = () => {
        setDialog(true)
    }
    const handleDialogClose = () => {
        setDialog(false)
    }
    const handleDeleteMode = () => {
        setDeleteMode(!deleteMode);
    }
    const handleProjectNameChange = (e: any) => {
        setProjectName(e.target.value);
    }
    const handleProjectUrlChange = (e: any) => {
        setProjectUrl(e.target.value);
    }
    const addStudent = (student: Student) => {
        setStudents([...students, student]);
    }
    const handleDeleteProject = (projectId: number) => {
        deleteProject({
            variables: {
                projectId
            }
        })
        .then(() => {
            setProjects(projects.filter(project => project.id !== projectId));
        })
    }
    const addProject = () => {
        insertProject({
            variables: {
                courseId,
                projectName,
                githubUrl: projectUrl,
                students
        }})
        .then(({data}) => {
            const projectData = data.insert_projects.returning[0];
            const newProject: Project = {
                id: projectData.id,
                name: projectData.name,
                githubUrl: projectData.github_url,
                students: projectData.students
            };
            setProjects([ ...projects, newProject]);
            setStudents([]);
        })
        setDialog(false);
    }
    return(
        <>
        <Grid container direction = 'row' justify = 'space-around' alignItems = 'flex-start' className = {classes.container}>
            <Grid item xs = {8}>
                <TextField 
                    label = 'Search' 
                    variant = 'outlined' 
                    size = 'small'
                    InputProps = {{ 
                        startAdornment: (
                            <InputAdornment position = 'start'>
                                <SearchIcon />
                            </InputAdornment>
                        
                    )}} 
                    />
            </Grid>
            <Grid container item xs = {4} justify = 'flex-end' alignItems = 'flex-end'>
                <Button variant = 'contained' color = 'primary' className = {classes.button} onClick = {handleDialogOpen}>
                    New
                </Button>
                <Button variant = 'contained' color = 'primary' className = {classes.button}>
                    Bulk insert
                </Button>
                <Button variant = 'contained' color = 'secondary' startIcon = { <DeleteIcon/> } className = {classes.button} onClick = {handleDeleteMode}>
                    Delete
                </Button>
            </Grid>
        </Grid>
        <ProjectDialog 
            open = {dialog} 
            handleClose = {handleDialogClose} 
            handleNameChange = {handleProjectNameChange} 
            handleUrlChange = {handleProjectUrlChange}
            addStudent = {addStudent} 
            addProject = {addProject}
        />
        <Grid container direction = 'row' justify = 'space-evenly' className = { classes.header }>
            <Grid item xs = {3}>
                Project name
            </Grid>
            <Grid item xs = {3}>
                Studens
            </Grid> 
            <Grid item xs = {3}>
                Number of commits
            </Grid> 
            <Grid item xs = {3}>
                Last commit
            </Grid> 
        </Grid>
        {projects.map((project: any) => {
            return(
                <div key = {project.id} onClick = {() => handleDeleteProject(project.id)}>
                    <ProjectBox 
                        key = {project.id} 
                        name = {project.name} 
                        projectId = {project.id} 
                        students = {project.students}
                        deleteMode = {deleteMode}
                    />
                </div>
            )
        })}
        </>
    );
}
export default ProjectList;