import { FunctionComponent, useState, useEffect } from 'react';
import { Grid, makeStyles, createStyles } from '@material-ui/core';
import classNames from 'classnames';
import ProjectCommits from './ProjectCommits';
import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import { Commit, Student } from '../../interfaces';
type ProjectProps = {
    projectId: number
}

const GET_PROJECT = gql`
query getProject($projectId: Int!) {
    projects(where: {id: {_eq: $projectId}}) {
      github_url
      name
      students {
        name
        github_username
        id
      }
    }
  }  
`;
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
const ProjectDetails: FunctionComponent<ProjectProps> = ({projectId}) => {
    const classes = useStyles();
    const { data } = useQuery(GET_PROJECT, {variables: { projectId }});
    const [project, setProject] = useState();
    useEffect(() => {
        if(data)
            setProject(data.projects[0])
    }, [data]);
    if(project) { 
        return(
            <>
                <Grid container direction = 'row'  justify = 'center' className = {classNames(classes.details)} >
                    <Grid container direction = 'column' item xs = {3} justify = 'center' className = {classNames(classes.border, classes.projectInfo)} >
                        <div>
                        Project name: {project.name}
                        </div>
                        <div>
                            Students: {project.students.map((student: Student) => {
                                return(student.name)
                            })}
                        </div>
                        <div>
                            GitHub repo:  <a href = {project.url}>G</a>
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
    else
        return(<p>LOADING</p>)
}
export default ProjectDetails;