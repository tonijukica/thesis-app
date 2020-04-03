import { FunctionComponent, useState, useReducer, useEffect, ChangeEvent } from 'react';
import { Grid, Button, makeStyles, createStyles, CircularProgress } from '@material-ui/core';
import { Context, coursesReducer } from './helper';
import  DeleteIcon from '@material-ui/icons/Delete';
import CourseBox from './CourseBox';
import CourseDialog from './CourseDialog';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { GET_COURSES, INSERT_COURSE, INESRT_COURSE_BULK_PROJECTS } from '../../gql/queries/courses';


type CourseProps = {
    title: string,
}
const useStyles = makeStyles(() => createStyles({
   container: {
       paddingBottom: '16px',
       borderBottom: '1px solid #e1e4e8 !important'
   },
   button: {
       marginRight: '8px'
   },
   loading: {
       padding: '32px'
   }
  }));

const Courses: FunctionComponent<CourseProps> = ({title}) => {
    const classes = useStyles();
    const {data, loading} = useQuery(GET_COURSES);
    const [insertCourse] = useMutation(INSERT_COURSE);
    const [insertCourseBulkProjects] = useMutation(INESRT_COURSE_BULK_PROJECTS);
    const [dialog, setDialog] = useState(false);
    const [courses, dispatch] = useReducer(coursesReducer, []);
    const [courseName, setCourseName] = useState('');
    const [deleteMode, setDeleteCourse] = useState(false); 
    const [bulkInsertData, setBulkInsertData] = useState<any>([]);
    
    const handleClickOpen = () => {
        setDialog(true);
    }
    const handleClose = () => {
        setDialog(false);
    }
    const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
        setCourseName(e.target.value);
    }
    const addCourse = () => {
        return new Promise(function(resolve) {
            if(bulkInsertData){
                insertCourseBulkProjects({
                    variables: {
                        courseName,
                        year: '2020',
                        projects: bulkInsertData
                        }
                })
                .then((data) => {
                    const newCourse = {
                        name: courseName,
                        courseId: data.data.insert_course.id,
                        studentProjects: bulkInsertData.length
                    }
                    dispatch({type: 'add', course: newCourse});
                    setDialog(false);
                    setBulkInsertData([]);
                    resolve();
                })
            }
            else{
                insertCourse({
                    variables: {
                        name: courseName,
                        year: '2020'
                    }
                }).then(({data}) => {
                    const newCourse = {
                        name: courseName,
                        courseId: data.insert_course.id,
                        studentProjects: 0
                    }
                    dispatch({type: 'add', course: newCourse});
                    setDialog(false);
                    resolve();
                })
                .catch(e => console.log(e));
            }
        });
    }
    const handleDelete = () => {
        setDeleteCourse(!deleteMode);
    }
    const handleDataInput = (data: any) => {
        setBulkInsertData(data);
    }
    useEffect(() => {
       if(data) {
        data.courses.forEach((course: any) => 
            dispatch({type: 'add', course: {name: course.course_name, courseId: course.id, studentProjects: course.projects_count}})
        );
       }
    }, [data]);
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
                <CourseDialog open = {dialog} handleClose = {handleClose} handleNameChange = {handleNameChange} dataInput = {handleDataInput} addCourse = {addCourse} />
            </Grid>
        </Grid>
        <Grid container direction = 'row' justify = 'center'>
            <Context.Provider value = {{courses, dispatch}}>
                {loading && <CircularProgress size={120} className = {classes.loading} />}
                {courses.map((course) => {
                    return(
                        <CourseBox key = {course.courseId}  courseId= {course.courseId} name = {course.name} studentProjects = {course.studentProjects} deleteMode = {deleteMode} />
                    )
                })}
            </Context.Provider>
        </Grid>
        </>
    );
}
export {Courses, Context};