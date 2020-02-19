import { FunctionComponent } from 'react';
import { Grid, makeStyles, createStyles } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';

type CourseItemProps = {
    name: string,
    studentProjects: number,
    deleteMode: boolean

}

const useStyles = makeStyles(() => createStyles({
   box: {
       border: '1px solid #d1d5da',
       borderRadius: '3px',
       margin: '16px'
   }
  }));

const CourseBox: FunctionComponent<CourseItemProps> = ({name, studentProjects, deleteMode}) => {
    const classes = useStyles();
    return(
        <Grid container xs = {3} item className = {classes.box} justify = 'center'>
            {deleteMode ? <DeleteIcon/> : null }
            {name}
            <br/>
            Number of projects: {studentProjects}
        </Grid>
    );
}
export default CourseBox;