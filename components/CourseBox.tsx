import { FunctionComponent, useContext } from 'react';
import { Grid, makeStyles, createStyles } from '@material-ui/core';
import { Context } from './Courses';
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
    const context: any = useContext(Context); 
    const { dispatch } = context; 
    const handleDelete = () => {
        dispatch({type: 'remove', course: {name, studentProjects}});
    }
    return(
        <Grid container xs = {3} item className = {classes.box} justify = 'center'>
            {deleteMode ? <DeleteIcon onClick = {handleDelete} /> : null }
            {name}
            <br/>
            Number of projects: {studentProjects}
        </Grid>
    );
}
export default CourseBox;