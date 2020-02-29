import { FunctionComponent, useState, useEffect } from 'react';
import { Grid, Button, makeStyles, createStyles, TextField, InputAdornment } from '@material-ui/core';
import { useQuery } from '@apollo/react-hooks';
import  DeleteIcon from '@material-ui/icons/Delete';
import SearchIcon from '@material-ui/icons/Search';
import ProjectBox from './ProjectBox';
import ProjectDialog from './ProjectDialog';
import { gql } from 'apollo-boost';

const GET_PROJECTS = gql`
query getProjects($courseId: Int!) {
    projects(where: {course_id: {_eq: $courseId}}) {
      name
      id
      students {
        name
      }
      github_url
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
    const { data } = useQuery(GET_PROJECTS, { variables: { courseId}});
    const [projects, setProjects] = useState([]);
    const [projectName, setProjectName] = useState('');
    const [students, setStudentName] = useState('');

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
    const handleProjectNameChange = (e: any) => {
        setProjectName(e.target.value);
    }
    const handleStudentNameChange = (e: any) => {
        setStudentName(e.target.value);
    }
    const addProject = () => {
        console.log(projectName, students);
        //setProjects([ ...projects, { name: projectName, studentName}]);
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
                <Button variant = 'contained' color = 'secondary' startIcon = { <DeleteIcon/> } className = {classes.button}>
                    Delete
                </Button>
            </Grid>
        </Grid>
        <ProjectDialog open = {dialog} handleClose = {handleDialogClose} handleNameChange = {handleProjectNameChange} handleStudenNameChange = {handleStudentNameChange} addProject = {addProject} />
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
                <ProjectBox key = {project.id} name = {project.name} projectId = {project.id} students = {project.students} commitsNum = {0} lastCommit = '1212' />
            )
        })}
        </>
    );
}
export default ProjectList;