import { FunctionComponent, useState, Fragment, ChangeEvent } from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core';
import { Button, TextField } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { Student } from '../../../interfaces';

type ProjectDialogProps = {
	name: string;
	url: string;
	open: boolean;
	handleClose: any;
	handleNameChange: any;
	handleUrlChange: any;
	addStudent: any;
	addProject: any;
};

const AddProjectDialog: FunctionComponent<ProjectDialogProps> = ({
	name,
	url,
	open,
	handleClose,
	addStudent,
	handleNameChange,
	handleUrlChange,
	addProject,
}) => {
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
			<Dialog open={open} onClose={handleClose}>
				<DialogTitle>Add new project</DialogTitle>
				<DialogContent>
					<DialogContentText>Fill out the following:</DialogContentText>
					<TextField margin='dense' label='Project name' onChange={handleNameChange} fullWidth />
					<TextField margin='dense' label='Project GitHub url' onChange={handleUrlChange} fullWidth />
					<DialogContentText>
						Students:
						{students.map((student: Student) => (
							<Fragment key={student.github_username}>
								<br />
								Student: {student.name}
								<br />
								GitHub username: {student.github_username}
							</Fragment>
						))}
					</DialogContentText>
					<Button color='primary' variant='outlined' onClick={handleStudentAdd}>
						Add student
					</Button>
					{studentAdd && (
						<>
							<TextField margin='dense' label='Student Name' onChange={handleStudentNameChange} fullWidth />
							<TextField margin='dense' label='Student GitHub username' onChange={handleStudentUsernameChange} fullWidth />
							<Button color='primary' variant='contained' onClick={addLocalStudent} disabled={!!!studentName}>
								<AddIcon />
							</Button>
						</>
					)}
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose} color='secondary'>
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
