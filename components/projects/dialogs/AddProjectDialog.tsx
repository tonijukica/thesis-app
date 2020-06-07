import { FunctionComponent, useState, ChangeEvent } from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { makeStyles, createStyles, Theme } from '@material-ui/core';
import { Card, Grid, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core';
import { Button, TextField } from '@material-ui/core';
import { Clear } from '@material-ui/icons'
import { Student } from '../../../interfaces';

type ProjectDialogProps = {
	name: string;
	url: string;
	open: boolean;
	handleClose: any;
	handleNameChange: any;
  handleUrlChange: any;
  handleProdUrlChange: any;
	addStudent: any;
	addProject: any;
};

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		students: {
      paddingTop: '16px'
    },
    studentBox: {
      fontSize: '0.9rem',
      position: 'relative',
      marginRight: '10px',
      padding: '8px'
    },
    deleteIcon: {
			position: 'absolute',
			top: 0,
			right: 0,
			zIndex: 1000,
    },
    saveBtn: {
      marginTop: '8px'
    },
    dialogTitle: {
      backgroundColor: theme.palette.primary.main,
      color: 'white'
    }
	})
);

const AddProjectDialog: FunctionComponent<ProjectDialogProps> = ({
	name,
	url,
	open,
	handleClose,
	addStudent,
	handleNameChange,
  handleUrlChange,
  handleProdUrlChange,
	addProject,
}) => {
  const classes = useStyles();
	const [studentAdd, setStudentAdd] = useState(false);
	const [studentName, setStudentName] = useState('');
	const [studentUsername, setStudentUsername] = useState('');
	const [students, setStudents] = useState<Student[]>([]);

	const addLocalStudent = () => {
		const student: Student = {
			name: studentName,
			github_username: studentUsername,
		};
		setStudents([...students, student]);
		addStudent(student);
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

	return (
		<>
			<Dialog open={open} onClose={handleClose} fullWidth>
				<DialogTitle className={classes.dialogTitle}>
          Add new project
        </DialogTitle>
				<DialogContent>
					<DialogContentText><strong>Fill out the following:</strong></DialogContentText>
					<TextField margin='dense' label='Project name' onChange={handleNameChange} fullWidth />
					<TextField margin='dense' label='Project GitHub url' onChange={handleUrlChange} fullWidth />
          <TextField margin='dense' label='Project Prod url' onChange={handleProdUrlChange} fullWidth />
					<DialogContentText className={classes.students}>
						<strong>Students:</strong>
          </DialogContentText>
          <Grid container direction='row'>
            <TransitionGroup component={null}>
              {students.map((student: Student) => (
                <CSSTransition
                  key={student.id}
                  timeout={400}
                  classNames='custom'
                >
                  <Grid item xs={3} key={student.name}>
                    <Card className={classes.studentBox}>
                      <Clear
                        className={classes.deleteIcon}
                        onClick={() =>
                          setStudents(students.filter(studentEl => studentEl.name !== student.name))
                        }
                        />
                      Student:
                      <br/>
                      {student.name}
                      <br />
                      {student.github_username  &&
                        <>
                        GitHub username:
                        <br/>
                        {student.github_username}
                        </>
                      }
                    </Card>
                  </Grid>
                </CSSTransition>
              ))}
            </TransitionGroup>
          </Grid>
          <Button
            color='primary'
            variant='outlined'
            onClick={handleStudentAdd}
            style={{marginTop: '8px'}}
          >
						Add
					</Button>
					{studentAdd && (
						<>
							<TextField margin='dense' label='Student Name' onChange={handleStudentNameChange} fullWidth />
							<TextField margin='dense' label='Student GitHub username' onChange={handleStudentUsernameChange} fullWidth />
							<Button color='primary' variant='contained' onClick={addLocalStudent} disabled={!!!studentName} className={classes.saveBtn}>
								Save
							</Button>
						</>
					)}
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose} color='secondary' style={{color: 'red'}}>
						Cancel
					</Button>
					<Button onClick={addProject} color='primary' disabled={!(!!name && !!url)}>
						Save
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
};

export default AddProjectDialog;
