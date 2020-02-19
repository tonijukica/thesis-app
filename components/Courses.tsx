import { FunctionComponent } from 'react';
import { Grid, Button, makeStyles, createStyles } from '@material-ui/core';
import  DeleteIcon from '@material-ui/icons/Delete';
import CourseBox from './CourseBox';

type CourseProps = {
    title: string,
}
const dummyCourses = [
    {
        name: 'HCI',
        studentProjects: 20
    },
    {
        name: 'HCI',
        studentProjects: 20
    },
    {
        name: 'HCI',
        studentProjects: 20
    },
    {
        name: 'HCI',
        studentProjects: 20
    },
    {
        name: 'HCI',
        studentProjects: 20
    },
    {
        name: 'HCI',
        studentProjects: 20
    },
]

const useStyles = makeStyles(() => createStyles({
   container: {
       paddingBottom: '16px',
       borderBottom: '1px solid #e1e4e8 !important'
   },
   button: {
       marginRight: '8px'
   }
  }));

const Courses: FunctionComponent<CourseProps> = ({title}) => {
    const classes = useStyles();
    return(
        <>
        <Grid container direction = 'row' justify = 'space-around' alignItems = 'flex-start' className = {classes.container}>
            <Grid item xs = {8}>
                {title}
            </Grid>
            <Grid container item xs = {4} justify = 'flex-end' alignItems = 'flex-end'>
                <Button variant = 'contained' color = 'primary' className = {classes.button}>
                    New
                </Button>
                <Button variant = 'contained' color = 'secondary' startIcon = { <DeleteIcon/> } className = {classes.button}>
                    Delete
                </Button>
            </Grid>
        </Grid>
        <Grid container direction = 'row' justify = 'center'>
            {dummyCourses.map((element) => {
                return(
                    <CourseBox name = {element.name} studentProjects = {element.studentProjects} />
                )
            })}
        </Grid>
        </>
    );
}
export default Courses;