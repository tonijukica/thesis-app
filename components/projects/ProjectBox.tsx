import { FunctionComponent } from 'react';
import { Grid, makeStyles, createStyles } from '@material-ui/core';

type StudentProps = {
    name: string,
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

const ProjectBox: FunctionComponent<StudentProps> = ({name, students, commitsNum, lastCommit }) => {
    const classes = useStyles();
    return(
        <Grid container item className = {[classes.box, classes.good].join(' ')  } justify = 'center' alignItems = 'center' >
            <Grid item xs = {3} >
                {name}
            </Grid>
            <Grid  container  direction = 'column' item xs = {3}>
                {students.map((student: any) => {
                    return(
                        <Grid>
                            {student.name}
                        </Grid>
                    );
                })}
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