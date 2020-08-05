import { FC, useState, ChangeEvent } from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import {
  makeStyles,
  createStyles,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Button,
  Grid,
  Card,
  LinearProgress,
  Theme,
} from '@material-ui/core';
import { useMutation } from '@apollo/react-hooks';
import { Clear } from '@material-ui/icons';
import { UPDATE_PROJECT } from '../../../gql/queries/projects';
import { Project, Student } from '../../../interfaces';

type EditDialogProps = {
  project: Project;
  updateProject: any;
  open: boolean;
  handleClose: any;
  handleSave: any;
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
      marginBottom: '16px',
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

export const EditProjectDialog: FC<EditDialogProps> = ({
  project,
  updateProject,
  open,
  handleClose,
  handleSave,
}) => {
  const classes = useStyles();
  const [state, setState] = useState<Project>(project);
  const [loading, setLoading] = useState(false);
  const [studentAdd, setStudentAdd] = useState({
    state: false,
    studentName: '',
    studentUsername: '',
  });
  const [update] = useMutation(UPDATE_PROJECT);
  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
    setState({
      ...state,
      name: e.target.value,
    });
  };
  const handleGitHubURLChange = (e: ChangeEvent<HTMLInputElement>) => {
    setState({
      ...state,
      github_url: e.target.value,
    });
  };
  const handleProdURLChange = (e: ChangeEvent<HTMLInputElement>) => {
    setState({
      ...state,
      prod_url: e.target.value,
    });
  };
  const handleStudentAdd = () => {
    setStudentAdd({
      ...studentAdd,
      state: true,
    });
  };
  const handleStudentNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setStudentAdd({
      ...studentAdd,
      studentName: e.target.value,
    });
  };
  const handleStudentUsernameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setStudentAdd({
      ...studentAdd,
      studentUsername: e.target.value,
    });
  };
  const addStudent = () => {
    setState({
      ...state,
      students: [
        ...state.students,
        {
          name: studentAdd.studentName,
          github_username: studentAdd.studentUsername,
        },
      ],
    });
    setStudentAdd({
      state: false,
      studentName: '',
      studentUsername: '',
    });
  };
  const close = () => {
    setStudentAdd({
      state: false,
      studentName: '',
      studentUsername: '',
    });
    handleClose();
  };
  const saveEdit = () => {
    setLoading(true);
    updateProject(state);
    update({
      variables: {
        id: Number(state.id),
        name: state.name,
        githubUrl: state.github_url,
        prodUrl: state.prod_url ? state.prod_url : '',
        students: state.students.map((student) => {
          return {
            name: student.name,
            github_username: student.github_username,
          };
        }),
      },
    }).then(() => {
      setLoading(false);
      handleSave();
    });
  };
  return (
    <Dialog open={open} fullWidth>
      <DialogTitle className={classes.dialogTitle}>Edit project</DialogTitle>
      <DialogContent>
        <DialogContentText>
          <strong>Edit following project information:</strong>
        </DialogContentText>
        <TextField
          margin="dense"
          value={state.name}
          onChange={handleNameChange}
          label="Project name"
          fullWidth
        />
        <TextField
          margin="dense"
          value={state.github_url}
          onChange={handleGitHubURLChange}
          label="Project GitHub url"
          fullWidth
        />
        <TextField
          margin="dense"
          value={state.prod_url}
          onChange={handleProdURLChange}
          label="Project production url"
          fullWidth
        />
        <DialogContentText>
          <strong>Students:</strong>
        </DialogContentText>
        <Grid container direction="row">
          <TransitionGroup component={null}>
            {state.students.map((student: Student) => (
              <CSSTransition key={student.id} timeout={400} classNames="custom">
                <Grid item xs={3} key={student.name}>
                  <Card className={classes.studentBox}>
                    <Clear
                      className={classes.deleteIcon}
                      onClick={() =>
                        setState({
                          ...state,
                          students: state.students.filter(
                            (studentEl) => studentEl.name !== student.name
                          ),
                        })
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
        <Button color="primary" variant="outlined" onClick={handleStudentAdd}>
          Add
        </Button>
        {studentAdd.state && (
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
              onClick={addStudent}
              disabled={!studentAdd.studentName}
              className={classes.saveBtn}
            >
              Save
            </Button>
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button color="secondary" onClick={close} style={{ color: 'red' }}>
          Cancel
        </Button>
        <Button color="primary" onClick={saveEdit}>
          Save
        </Button>
        {loading && <LinearProgress color="primary" />}
      </DialogActions>
    </Dialog>
  );
};
