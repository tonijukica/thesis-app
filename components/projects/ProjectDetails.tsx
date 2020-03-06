import { FunctionComponent, useState, useEffect } from 'react';
import { Grid, makeStyles, createStyles } from '@material-ui/core';
import { Pagination } from '@material-ui/lab';
import classNames from 'classnames';
import ProjectCommits from './ProjectCommits';
import { useQuery } from '@apollo/react-hooks';
import { GET_PROJECT, GET_COMMITS } from '../../gql/queries/projects';
import { Student } from '../../interfaces';
import { getUserRepoName } from './helpers';

type ProjectProps = {
    projectId: number
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
const ProjectDetails: FunctionComponent<ProjectProps> = ({projectId}) => {
    const classes = useStyles();
    const rowsPerPage = 5;
    const { data } = useQuery(GET_PROJECT, {variables: { projectId }});
    const [project, setProject] = useState();
    const [commits, setCommits] = useState();
    const [owner, setOwner] = useState('');
    const [repoName, setRepoName] = useState('');
    const [page, setPage] = useState(1);
    const { data: githubData } = useQuery(GET_COMMITS, {
        skip: !data,
        variables: {
            repoName,
            owner
        },
        context: {
            clientName: 'github'
        }
    });
    useEffect(() => {
        if(data)
            setProject(data.projects[0])
        if(githubData)
            setCommits(githubData.repository.object.history.nodes);
        if(project){
            const [user, repo] = getUserRepoName(project.github_url);
            setOwner(user),
            setRepoName(repo);
        }
    }, [data, githubData, project, page]);
    const handlePageChange = (event: any, value: number) => {
        if(event)
            setPage(value);
    }
    if(project && commits) { 
        return(
            <>
                <Grid container direction = 'row'  justify = 'center' className = {classNames(classes.details)} >
                    <Grid container direction = 'column' item xs = {3} justify = 'center' className = {classNames(classes.border, classes.projectInfo)}>
                        <div>
                        Project name: {project.name}
                        </div>
                        <div>
                            Students: {project.students.map((student: Student) => {
                                return(student.name)
                            })}
                        </div>
                        <div>
                            GitHub repo:  <a href = {project.github_url}>G</a>
                        </div>
                    </Grid>
                    <Grid container item xs = {7} className = {classes.border} justify= 'center'>
                        Deploy preview
                    </Grid>
                </Grid>
                <Grid container direction = 'row' justify = 'center' className = {classes.commitList}>
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
                    <ProjectCommits commits = {commits.slice(page*rowsPerPage-rowsPerPage, page*rowsPerPage)} />
                    <Pagination shape = 'rounded'  color = 'primary' page = {page} count = {Math.ceil(commits.length / rowsPerPage)} onChange = {handlePageChange} />
                </Grid>
            </>
        );
    }
    else
        return(<p>LOADING</p>)
}
export default ProjectDetails;
