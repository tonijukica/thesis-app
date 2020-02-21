import { FunctionComponent, useState, useReducer } from 'react';
import { Grid, Button, makeStyles, createStyles } from '@material-ui/core';
import { Context, coursesReducer } from './helper';
import  DeleteIcon from '@material-ui/icons/Delete';
import CourseBox from './CourseBox';
import CourseDialog from './CourseDialog';

type CourseProps = {
    title: string,
}
const dummyCourses = [
    {
        name: 'HCI',
        studentProjects: 20
    },
    {
        name: 'HCI1',
        studentProjects: 20
    },
    {
        name: 'HCI2',
        studentProjects: 20
    },
    {
        name: 'HCI3',
        studentProjects: 20
    },
    {
        name: 'HCI4',
        studentProjects: 20
    },
    {
        name: 'HCI5',
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
    const [dialog, setDialog] = useState(false);
    const [courses, dispatch] = useReducer(coursesReducer, dummyCourses);
    const [courseName, setCourseName] = useState('');
    const [projectNum, setProjectNum] = useState('');
    const [deleteMode, setDeleteCourse] = useState(false); 
    
    const handleClickOpen = () => {
        setDialog(true);
    }
    const handleClose = () => {
        setDialog(false);
    }
    const handleNameChange = (e: any) => {
        setCourseName(e.target.value);
    }
    const handleNumChange = (e: any) => {
        setProjectNum(e.target.value);
    }
    const addCourse = () => {
        dispatch({type: 'add', course: {name: courseName, studentProjects: Number(projectNum)}})
        setDialog(false);
    }
    const handleDelete = () => {
        setDeleteCourse(!deleteMode);
    }
    return(
        <>
        <Grid container direction = 'row' justify = 'space-around' alignItems = 'flex-start' className = {classes.container}>
            <Grid item xs = {8}>
                {title}
            </Grid>
            <Grid container item xs = {4} justify = 'flex-end' alignItems = 'flex-end'>
                <Button variant = 'contained' color = 'primary' className = {classes.button} onClick = {handleClickOpen}>
                    New
                </Button>
                <Button variant = 'contained' color = 'secondary' startIcon = { <DeleteIcon/> } className = {classes.button} onClick = {handleDelete}>
                    Delete
                </Button>
                <CourseDialog open = {dialog} handleClose = {handleClose} handleNameChange = {handleNameChange} handleNumChange = {handleNumChange} addCourse = {addCourse} />
            </Grid>
        </Grid>
        <Grid container direction = 'row' justify = 'center'>
            <Context.Provider value = {{courses, dispatch}}>
                {courses.map((course) => {
                    return(
                        <CourseBox key = {course.name} name = {course.name} studentProjects = {course.studentProjects} deleteMode = {deleteMode} />
                    )
                })}
            </Context.Provider>
        </Grid>
        </>
    );
}
export {Courses, Context};