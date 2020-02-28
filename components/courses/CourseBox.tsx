import { FunctionComponent, useContext } from 'react';
import { Grid, makeStyles, createStyles } from '@material-ui/core';
import { Context } from './CourseList';
import DeleteIcon from '@material-ui/icons/Delete';
import { gql } from 'apollo-boost';
import { useMutation } from '@apollo/react-hooks';
import Link from 'next/link';

const DELETE_COURSE = gql`
mutation deleteCourse($name: String!) {
    delete_courses(where: {course_name: {_eq: $name}}) {
      returning {
        course_name
      }
    }
  }
`;
type CourseBoxProps = {
    name: string,
    courseId: number,
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


const CourseBox: FunctionComponent<CourseBoxProps> = ({name, courseId, studentProjects, deleteMode}) => {
    const classes = useStyles();
    const [deleteCourse] = useMutation(DELETE_COURSE);
    const context: any = useContext(Context); 
    const { dispatch } = context; 
    const handleDelete = () => {
        deleteCourse({
            variables: {
                name
            }
        });
        dispatch({type: 'remove', course: {name, studentProjects}});
    }
    return(
       <Link href = {`/courses/${courseId}`}>
          <Grid container xs = {3} item className = {classes.box} justify = 'center'>
            {deleteMode ? <DeleteIcon onClick = {handleDelete} /> : null }
            {name}
            <br/>
            Number of projects: {studentProjects}
        </Grid>
       </Link>
    );
}
export default CourseBox;