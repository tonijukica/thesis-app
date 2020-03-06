import { FunctionComponent, useState, useEffect } from 'react';
import { Grid, makeStyles, createStyles } from '@material-ui/core';
import { Student } from '../../interfaces';
import Link from 'next/link';
import { GET_REPO_INFO } from '../../gql/queries/projects';
import { useQuery } from '@apollo/react-hooks';
import { getUserRepoName, formatDate, projectStanding, dataExtract } from './helpers';

type ProjectBoxProps = {
    name: string,
    projectId: number,
    githubUrl: string,
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
            <Grid key = {projectId} container item className = {deleteMode ? [classes.box, classes.deleteHover].join(' ') :[classes.box, projectStanding(lastCommitDate, classes)].join(' ')} 
            justify = 'center' alignItems = 'center'>
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
