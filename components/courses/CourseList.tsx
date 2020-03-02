import { FunctionComponent, useState, useReducer, useEffect, ChangeEvent } from 'react';
import { Grid, Button, makeStyles, createStyles } from '@material-ui/core';
import { Context, coursesReducer } from './helper';
import  DeleteIcon from '@material-ui/icons/Delete';
import CourseBox from './CourseBox';
import CourseDialog from './CourseDialog';
import { gql } from 'apollo-boost';
import { useQuery, useMutation } from '@apollo/react-hooks';

const GET_COURSES_QUERY = gql`
{
    courses {
      course_name
      id
      projects_aggregate {
        aggregate {
          count
        }
      }
    }
}
`;
const INSERT_COURSE = gql `
    mutation insertCourse($name: String!, $numProjects: String!) {
        insert_courses(objects: {course_name: $name, year: $numProjects}) {
        returning {
            course_name
            id
            year
        }
        }
    }
`;

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
   }
  }));

const Courses: FunctionComponent<CourseProps> = ({title}) => {
    const classes = useStyles();
    const {data} = useQuery(GET_COURSES_QUERY);
    const [insertCourse] = useMutation(INSERT_COURSE);
    const [dialog, setDialog] = useState(false);
    const [courses, dispatch] = useReducer(coursesReducer, []);
    const [courseName, setCourseName] = useState('');
    const [projectNum, setProjectNum] = useState('');
    const [deleteMode, setDeleteCourse] = useState(false); 
    
    const handleClickOpen = () => {
        setDialog(true);
    }
    const handleClose = () => {
        setDialog(false);
    }
    const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
        setCourseName(e.target.value);
    }
    const handleNumChange = (e: ChangeEvent<HTMLInputElement>) => {
        setProjectNum(e.target.value);
    }
    const addCourse = () => {
        insertCourse({
            variables: {
                name: courseName,
                numProjects: projectNum
            }
        }).then(({data}) => {
            const newCourse = {
                name: courseName,
                courseId: data.insert_courses.returning[0].id,
                studentProjects: Number(projectNum)
            }
            dispatch({type: 'add', course: newCourse});
            setDialog(false);
        })
    }
    const handleDelete = () => {
        setDeleteCourse(!deleteMode);
    }
    useEffect(() => {
       if(data) {
        data.courses.forEach((course: any) => 
            dispatch({type: 'add', course: {name: course.course_name, courseId: course.id, studentProjects: course.projects_aggregate.aggregate.count}})
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
                <CourseDialog open = {dialog} handleClose = {handleClose} handleNameChange = {handleNameChange} handleNumChange = {handleNumChange} addCourse = {addCourse} />
            </Grid>
        </Grid>
        <Grid container direction = 'row' justify = 'center'>
            <Context.Provider value = {{courses, dispatch}}>
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