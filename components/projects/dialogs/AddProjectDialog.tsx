import { FunctionComponent, useState, ChangeEvent, useContext } from 'react';
import { useMutation } from '@apollo/client';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import {
  makeStyles,
  createStyles,
  Theme,
  Card,
  Grid,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  TextField,
} from '@material-ui/core';
import { Clear } from '@material-ui/icons';
import { Student, Project } from '../../../interfaces';
import { Context } from '../Context';
import { INSERT_PROJECT } from '../../../gql/queries/projects';

type ProjectDialogProps = {
  courseId: number;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    students: {
      paddingTop: '16px',
    },
    studentBox: {
      fontSize: '0.9rem',
      position: 'relative',
      marginRight: '10px',
      padding: '8px',
    },
    deleteIcon: {
      position: 'absolute',
      top: 0,
      right: 0,
      zIndex: 1000,
    },
    saveBtn: {
      marginTop: '8px',
    },
    dialogTitle: {
      backgroundColor: theme.palette.primary.main,
      color: 'white',
    },
  })
);

const AddProjectDialog: FunctionComponent<ProjectDialogProps> = ({
  courseId,
}) => {
  const classes = useStyles();
  const [studentAdd, setStudentAdd] = useState(false);
  const [studentName, setStudentName] = useState('');
  const [studentUsername, setStudentUsername] = useState('');
  const [projectName, setProjectName] = useState('');
  const [projectUrl, setProjectUrl] = useState('');
  const [projectProdUrl, setProjectProdUrl] = useState('');
  const [students, setStudents] = useState<Student[]>([]);
  const { state, dispatch } = useContext(Context);
  const [insertProject] = useMutation(INSERT_PROJECT);

  const addLocalStudent = () => {
    const student: Student = {
      name: studentName,
      github_username: studentUsername,
    };
    setStudents([...students, student]);
    setStudentAdd(!studentAdd);
    setStudentName('');
    setStudentUsername('');
  };
  const handleStudentAdd = () => {
    setStudentAdd(!studentAdd);
  };
  const handleStudentNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setStudentName(e.target.value);
  };
  const handleStudentUsernameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setStudentUsername(e.target.value);
  };
  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setProjectName(e.target.value);
  };
  const handleUrlChange = (e: ChangeEvent<HTMLInputElement>) => {
    setProjectUrl(e.target.value);
  };
  const handleProdUrlChange = (e: ChangeEvent<HTMLInputElement>) => {
    setProjectProdUrl(e.target.value);
  };
  const addProj = () => {
    insertProject({
      variables: {
        courseId,
        projectName,
        githubUrl: projectUrl,
        prodUrl: projectProdUrl,
        students,
      },
    }).then(({ data }) => {
      const projectData = data.insert_project;
      const newProject: Project = {
        id: projectData.id,
        name: projectData.name,
        github_url: projectData.github_url,
        students: projectData.students,
      };
      dispatch({
        type: 'add',
        project: newProject,
      });
      setStudents([]);
    });
    dispatch({ type: 'dialogAddToggle' });
  };
  const cleanup = () => {
    setStudentAdd(false);
    setProjectName('');
    setProjectUrl('');
    setProjectProdUrl('');
    setStudentName('');
    setStudentUsername('');
    setStudents([]);
    dispatch({ type: 'dialogAddToggle' });
  };

  return (
    <>
      <Dialog open={state.dialogAdd} onClose={cleanup} fullWidth>
        <DialogTitle className={classes.dialogTitle}>
          Add new project
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            <strong>Fill out the following:</strong>
          </DialogContentText>
          <TextField
            margin="dense"
            label="Project name"
            onChange={handleNameChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Project GitHub url"
            onChange={handleUrlChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Project Prod url"
            onChange={handleProdUrlChange}
            fullWidth
          />
          <DialogContentText className={classes.students}>
            <strong>Students:</strong>
          </DialogContentText>
          <Grid container direction="row">
            <TransitionGroup component={null}>
              {students.map((student: Student) => (
                <CSSTransition
                  key={student.name}
                  timeout={400}
                  classNames="custom"
                >
                  <Grid item xs={3} key={student.name}>
                    <Card className={classes.studentBox}>
                      <Clear
                        className={classes.deleteIcon}
                        onClick={() =>
                          setStudents(
                            students.filter(
                              (studentEl) => studentEl.name !== student.name
                            )
                          )
                        }
                      />
                      Student:
                      <br />
                      {student.name}
                      <br />
                      {student.github_username && (
                        <>
                          GitHub username:
                          <br />
                          {student.github_username}
                        </>
                      )}
                    </Card>
                  </Grid>
                </CSSTransition>
              ))}
            </TransitionGroup>
          </Grid>
          <Button
            color="primary"
            variant="outlined"
            onClick={handleStudentAdd}
            style={{ marginTop: '8px' }}
          >
            Add
          </Button>
          {studentAdd && (
            <>
              <TextField
                margin="dense"
                label="Student Name"
                onChange={handleStudentNameChange}
                fullWidth
              />
              <TextField
                margin="dense"
                label="Student GitHub username"
                onChange={handleStudentUsernameChange}
                fullWidth
              />
              <Button
                color="primary"
                variant="contained"
                onClick={addLocalStudent}
                disabled={!studentName}
                className={classes.saveBtn}
              >
                Save
              </Button>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={cleanup} color="secondary" style={{ color: 'red' }}>
            Cancel
          </Button>
          <Button
            onClick={addProj}
            color="primary"
            disabled={!(!!projectName && !!projectUrl)}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AddProjectDialog;
