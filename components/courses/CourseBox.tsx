import { FunctionComponent, useContext } from 'react';
import { Grid, makeStyles, createStyles, Card, CardActionArea, CardContent } from '@material-ui/core';
import { Context } from './CourseList';
import DeleteIcon from '@material-ui/icons/Delete';
 import { useQuery, useMutation } from '@apollo/react-hooks';
 import { DELETE_COURSE_BY_ID } from '../../gql/queries/courses';
 import { DELETE_PROJECT, GET_PROJECT_IDS } from '../../gql/queries/projects';

import Link from 'next/link';


type CourseBoxProps = {
    name: string,
    courseId: number,
    studentProjects: number,
    deleteMode: boolean
}

const useStyles = makeStyles(() => createStyles({
   card: {
     width: '75%',
     textAlign: 'center',
     marginBottom: '8px',
     marginTop: '8px'
   },
   cardActionArea: {
      paddingTop: '16px',
      paddingBottom: '16px',
      fontSize: '1em',
      
   },
   deleteIcon: {
     position: 'absolute',
     top: 0,
     right: 0,
     zIndex: 1000
   }
  }));


const CourseBox: FunctionComponent<CourseBoxProps> = ({name, courseId, studentProjects, deleteMode}) => {
  const classes = useStyles();
  const context: any = useContext(Context); 
  const { dispatch } = context;
  const { data } = useQuery(GET_PROJECT_IDS, { variables: { courseId }});
  const [deleteProject] = useMutation(DELETE_PROJECT);
  const [deleteCourse] = useMutation(DELETE_COURSE_BY_ID);
  async function deleteCourseFull(courseId: number) {
    if(data.projects.length>0) {
        for(const project of data.projects) {
          await deleteProject({
              variables: {
                projectId: project.id
              }
          });
          console.log('deleted project', project.id)
        } 
    }
    deleteCourse({
        variables: {
          courseId
        }
    })
  } 
  const handleDelete = () => {
      deleteCourseFull(courseId);
      dispatch({type: 'remove', course: {name, studentProjects}});
  }
  return(
      <Grid container xs = {4} item justify = 'center'>
            <Card className = {classes.card}>
                <CardActionArea className = {classes.cardActionArea}>
                  {deleteMode ? <DeleteIcon className = {classes.deleteIcon} onClick = {handleDelete} /> : null }
                  <CardContent>
                    <Link href = {`/courses/${courseId}`}>
                          <div>
                            {name}
                            <br/>
                            Projects: {studentProjects}
                          </div>
                    </Link>
                  </CardContent>
                </CardActionArea>
            </Card>
      </Grid>
  );
}
export default CourseBox;