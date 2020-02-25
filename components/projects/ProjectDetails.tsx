import { FunctionComponent } from 'react';
import { Grid, makeStyles, createStyles } from '@material-ui/core';
import classNames from 'classnames';
import ProjectCommits from './ProjectCommits';
import { Commit } from '../../interfaces';
type ProjectProps = {
    name: string,
    studentName: string,
    url: string
}

const useStyles = makeStyles(() => createStyles({
    border: {
        border: '1px solid #e1e4e8 !important',
        padding: '16px',
        textAlign: 'center'
    },
    details: {
        height: '512px'
    },
    projectInfo: {
        textAlign: 'center'
    },
    commitList: {
        borderBottom: '1px solid #e1e4e8 !important',
        padding: '8px',
        textAlign: 'center'
    }
  }));

const dummyCommits: Commit[] = [
    {
        user: 'Toni Jukica',
        commitMsg: 'Init project',
        date: '22.2.2020'
    },
    {
        user: 'Toni Jukica',
        commitMsg: 'Add component',
        date: '22.2.2020'
    }
]
const ProjectDetails: FunctionComponent<ProjectProps> = ({name, studentName, url}) => {
    const classes = useStyles();
    return(
        <>
            <Grid container direction = 'row'  justify = 'center' className = {classNames(classes.details)} >
                <Grid container direction = 'column' item xs = {3} justify = 'center' className = {classNames(classes.border, classes.projectInfo)} >
                    <div>
                       Project name: {name}
                    </div>
                    <div>
                        Student name: {studentName}
                    </div>
                    <div>
                        GitHub repo:  <a href = {url}>G</a>
                    </div>
                </Grid>
                <Grid container item xs = {7} className = {classes.border} justify= 'center'>
                    Deploy preview
                </Grid>
            </Grid>
            <Grid container direction = 'row' justify = 'center' className = {classes.commitList} >
                <h2>Commits</h2>
                <Grid item container direction = 'row' justify = 'center' className = {classes.commitList}>
                    <Grid item xs = {4}>
                        User
                    </Grid>
                    <Grid item xs = {4}>
                        Commit message
                    </Grid>
                    <Grid item xs = {4}>
                        Date
                    </Grid>
                </Grid>
                <ProjectCommits commits = {dummyCommits} />
            </Grid>
        </>
    );
}
export default ProjectDetails;