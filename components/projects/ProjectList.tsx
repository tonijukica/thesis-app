import { FunctionComponent, useState } from 'react';
import { Grid, Button, makeStyles, createStyles, TextField, InputAdornment } from '@material-ui/core';
import  DeleteIcon from '@material-ui/icons/Delete';
import SearchIcon from '@material-ui/icons/Search';
import ProjectBox from './ProjectBox';
import ProjectDialog from './ProjectDialog';


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
const dummyProjects = [
    {
        name: 'Diplomski',
        studentName: 'Toni Jukica'
    }
]
const ProjectList: FunctionComponent = ({}) => {
    const classes = useStyles();
    const [dialog, setDialog] = useState(false);
    const [projects, setProjects] = useState(dummyProjects);
    const [projectName, setProjectName] = useState('');
    const [studentName, setStudentName] = useState('');

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
        setProjects([ ...projects, { name: projectName, studentName}]);
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
                Student name
            </Grid> 
            <Grid item xs = {3}>
                Number of commits
            </Grid> 
            <Grid item xs = {3}>
                Last commit
            </Grid> 
        </Grid>
        {projects.map((project) => {
            return(
                <ProjectBox name = {project.name} studentName = {project.studentName} commitsNum = {0} lastCommit = '1212' />
            )
        })}
        </>
    );
}
export default ProjectList;