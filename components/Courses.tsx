import { FunctionComponent, useState, createContext, useReducer } from 'react';
import { Grid, Button, makeStyles, createStyles, TextField } from '@material-ui/core';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core'
import  DeleteIcon from '@material-ui/icons/Delete';
import CourseBox from './CourseBox';

type CourseProps = {
    title: string,
}
interface Course {
    name: string,
    studentProjects: number
}
interface ActionType {
    type: 'add' | 'remove',
    course: Course
}
type Dispatch = (action: ActionType) => void;
interface Context {
    dispatch: Dispatch,
    courses: Course[]
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
const Context = createContext<Context | undefined>(undefined);
function coursesReducer(courses: Course[], action: ActionType) {
    switch(action.type) {
        case 'add': {
            const newCourses = [ ...courses];
            newCourses.push(action.course);
            return newCourses;
        }
        case 'remove': { 
            const newCourses = courses.filter(el => el.name !== action.course.name)
            return newCourses;
        }
    }
}
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
    const [open, setOpen] = useState(false);
    const [courses, dispatch] = useReducer(coursesReducer, dummyCourses);
    const [courseName, setCourseName] = useState('');
    const [projectNum, setProjectNum] = useState('');
    const [deleteMode, setDeleteCourse] = useState(false); 
    
    const handleClickOpen = () => {
        setOpen(true);
    }
    const handleClose = () => {
        setOpen(false);
    }
    const handleNameChange = (e: any) => {
        setCourseName(e.target.value);
    }
    const handleNumChange = (e: any) => {
        setProjectNum(e.target.value);
    }
    const addCourse = () => {
        dispatch({type: 'add', course: {name: courseName, studentProjects: Number(projectNum)}})
        setOpen(false);
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
                <Dialog open = {open} onClose = {handleClose}>
                    <DialogTitle>Add new course</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Fill out the following:
                        </DialogContentText>
                        <TextField
                            margin = 'dense'
                            label = 'Course name'
                            onChange = {handleNameChange}
                            fullWidth
                        />
                        <TextField
                            margin = 'dense'
                            label = 'Number of projects'
                            onChange = {handleNumChange}
                            fullWidth
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick = {handleClose} color = 'primary'>
                            Cancel
                        </Button>
                        <Button onClick = {addCourse} color = 'primary'>
                            Save
                        </Button>
                    </DialogActions>
                </Dialog>
                <Button variant = 'contained' color = 'secondary' startIcon = { <DeleteIcon/> } className = {classes.button} onClick = {handleDelete}>
                    Delete
                </Button>
            </Grid>
        </Grid>
        <Grid container direction = 'row' justify = 'center'>
            <Context.Provider value = {{courses, dispatch}}>
                {courses.map((element) => {
                    return(
                        <CourseBox name = {element.name} studentProjects = {element.studentProjects} deleteMode = {deleteMode} />
                    )
                })}
            </Context.Provider>
        </Grid>
        </>
    );
}
export {Courses, Context};