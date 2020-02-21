import { FunctionComponent } from 'react';
import { Grid, Button, makeStyles, createStyles, TextField, InputAdornment } from '@material-ui/core';
import  DeleteIcon from '@material-ui/icons/Delete';
import SearchIcon from '@material-ui/icons/Search';
import ProjectBox from './ProjectBox';


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

const ProjectList: FunctionComponent = ({}) => {
    const classes = useStyles();
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
                <Button variant = 'contained' color = 'primary' className = {classes.button}>
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
        <ProjectBox name = 'Toni Jukica' projectName = 'Diplomski' commitsNum = {5} lastCommit = '23.11.2019' />
        </>
    );
}
export default ProjectList;