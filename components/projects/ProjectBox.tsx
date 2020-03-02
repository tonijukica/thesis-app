import { FunctionComponent } from 'react';
import { Grid, makeStyles, createStyles } from '@material-ui/core';
import Link from 'next/link';

type StudentProps = {
    name: string,
    projectId: number,
    students: [],
    commitsNum: number,
    lastCommit: string,
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
   }
  }));

const ProjectBox: FunctionComponent<StudentProps> = ({name, projectId, students, commitsNum, lastCommit }) => {
    const classes = useStyles();
    return(
        <Grid key = {projectId} container item className = {[classes.box, classes.good].join(' ')  } justify = 'center' alignItems = 'center' >
            <Link href = {`/projects/${projectId}`}>
                <Grid item xs = {3} >
                    {name}
                </Grid>
            </Link>
            <Grid  container  direction = 'column' item xs = {3}>
                {students.map((student: any) => (
                        <Grid key = {student.id}>
                            {student.name}
                        </Grid>
                    ))}
            </Grid> 
            <Grid item xs = {3}>
                {commitsNum}
            </Grid> 
            <Grid item xs = {3}>
                {lastCommit}
            </Grid> 
        </Grid>
    );
}
export default ProjectBox;