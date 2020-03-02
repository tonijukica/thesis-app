import { FunctionComponent, HTMLAttributes } from 'react';
import { Grid, makeStyles, createStyles } from '@material-ui/core';
import { Student } from '../../interfaces';
import Link from 'next/link';

interface StudentProps extends HTMLAttributes<HTMLDivElement> {
    name: string,
    projectId: number,
    students: Student[],
    deleteMode: boolean
}

const useStyles = makeStyles(() => createStyles({
   box: {
       textAlign: 'center',
       borderRadius: '3px',
       paddingTop: '16px',
       paddingBottom: '16px',
       marginBottom: '8px',
       marginTop: '8px'
   },
   good: {
       backgroundColor: '#b7f2ae',
   },
   bad: {
    backgroundColor: '#ffb3b3',
   },
   warning: {
       backgroundColor: '#fffeb3'
   },
   deleteHover: {
       '&:hover': {
        backgroundColor: 'grey',
        transform: 'scale(1.05)',
        cursor: 'pointer'
       }
   }
  }));

const ProjectBox: FunctionComponent<StudentProps> = ({name, projectId, students, deleteMode}) => {
    const classes = useStyles();
    return(
        <Grid key = {projectId} container item className = {deleteMode ? [classes.box, classes.deleteHover].join(' ') :[classes.box, classes.good].join(' ')  } justify = 'center' alignItems = 'center'>
            <Link href = {`/projects/${projectId}`}>
                <Grid item xs = {3} >
                    {name}
                </Grid>
            </Link>
            <Grid  container  direction = 'column' item xs = {3}>
                {students.map((student: Student) => (
                        <Grid key = {student.id}>
                            {student.name}
                        </Grid>
                    ))}
            </Grid> 
            <Grid item xs = {3}>
                
            </Grid> 
            <Grid item xs = {3}>
                
            </Grid> 
        </Grid>
    );
}
export default ProjectBox;