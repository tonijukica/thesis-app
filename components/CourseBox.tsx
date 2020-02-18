import { FunctionComponent } from 'react';
import { Grid, makeStyles, createStyles } from '@material-ui/core';

type CourseItemProps = {
    name: string,
    studentProjects: number

}

const useStyles = makeStyles(() => createStyles({
   box: {
       border: '1px solid #d1d5da',
       borderRadius: '3px',
       margin: '16px'
   }
  }));

const CourseBox: FunctionComponent<CourseItemProps> = ({name, studentProjects}) => {
    const classes = useStyles();
    return(
        <Grid container xs = {3} item className = {classes.box} justify = 'center'>
            {name}
            <br/>
            Number of projects: {studentProjects}
        </Grid>
    );
}
export default CourseBox;