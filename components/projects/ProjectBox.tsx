import { FunctionComponent, useState, useEffect } from 'react';
import { Grid, makeStyles, createStyles } from '@material-ui/core';
import { Student } from '../../interfaces';
import Link from 'next/link';
import { gql } from 'apollo-boost';
import { useQuery } from '@apollo/react-hooks';

type ProjectBoxProps = {
    name: string,
    projectId: number,
    githubUrl: string,
    students: Student[],
    deleteMode: boolean
}

const GET_REPO_INFO = gql`
query getRepoInfo($ownerName: String!, $repoName: String!)  {
    repository(owner: $ownerName, name: $repoName) {
      object(expression: "master") {
        ... on Commit {
          history(first: 1) {
            totalCount
            nodes {
              message
              authoredDate
            }
          }
        }
      }
    }
  }  
`;
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

const ProjectBox: FunctionComponent<ProjectBoxProps> = ({name, projectId, githubUrl, students, deleteMode}) => {
    const classes = useStyles();
    const [commitNum, setCommitNum] = useState('');
    const [lastCommitDate, setLastCommitDate] = useState('');
    const [user, repoName] = getUserRepoName(githubUrl);
    const { data } = useQuery(GET_REPO_INFO, {
        variables: {
            ownerName: user,
            repoName
        },
        context: {
            clientName: 'github'
        }
    });
    useEffect(() => {
        if(data){
            const {num, date} = dataExtract(data);
            setCommitNum(num);
            setLastCommitDate(date);
        }
    }, [data])
    if(data)
        return(
            <Grid key = {projectId} container item className = {deleteMode ? [classes.box, classes.deleteHover].join(' ') :[classes.box, projectStanding(lastCommitDate, classes)].join(' ')  } justify = 'center' alignItems = 'center'>
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
                    {commitNum}
                </Grid> 
                <Grid item xs = {3}>
                    {formatDate(lastCommitDate)}
                </Grid> 
            </Grid>
        );
    else
        return(<p>Loading</p>)
}
export default ProjectBox;

function getUserRepoName(url: string) {
    const userRepo = url.slice(19);
    return userRepo.split('/');
}

function dataExtract(data: any) {
    const result = {
        num: data.repository.object.history.totalCount,
        date: data.repository.object.history.nodes[0].authoredDate
    }
    return result;
}
 function formatDate(commitDate: string) {
    const date = new Date(commitDate);
    return `${date.getDate()}.${date.getMonth()+1}.${date.getFullYear()}`
 }

function projectStanding(date: string, classes: any) {
    const commitDate = new Date(date).getTime();
    const currentDate = new Date().getTime();
    const elapsedTime = currentDate - commitDate;
    if(elapsedTime<6.048e+8)
        return classes.good;
    else if(elapsedTime> 6.048e+8 && elapsedTime <1.814e+9)
        return classes.warning;
    else
        return classes.bad;
}