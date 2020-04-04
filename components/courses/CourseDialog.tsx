import { FunctionComponent, useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core';
import { Button, TextField, LinearProgress } from '@material-ui/core';
import { getFileContent } from '../common/fileUpload';

type CourseDialogProps = {
	name: string;
	open: boolean;
	handleClose: any;
	handleNameChange: any;
	dataInput: any;
	addCourse: any;
};

const CourseDialog: FunctionComponent<CourseDialogProps> = ({
	name,
	open,
	handleClose,
	handleNameChange,
	dataInput,
	addCourse,
}) => {
	const [fileName, setfileName] = useState('');
	const [parsedData, setParsedData] = useState('');
	const [loading, setLoading] = useState(false);

	const handleFileInput = async (file: any) => {
		setLoading(true);
		const fileData = await getFileContent(file[0]);
		setParsedData(`Found ${fileData.length} projects`);
		setLoading(false);
		dataInput(fileData);
	};
	const handleAddCourse = () => {
		setLoading(true);
		addCourse().then(() => {
			setLoading(false);
			setParsedData('');
			setfileName('');
		});
	};

	return (
		<>
			<Dialog open={open} onClose={handleClose}>
				<DialogTitle>Add new course</DialogTitle>
				<DialogContent>
					<DialogContentText>Fill out the following:</DialogContentText>
					<TextField margin='dense' label='Course name' onChange={handleNameChange} fullWidth />
					<input
						id='fileInput'
						type='file'
						accept='.csv'
						onChange={(e) => handleFileInput(e.target.files)}
						style={{ display: 'none' }}
					/>
					<label htmlFor='fileInput'>
						<Button variant='outlined' color='primary' component='span' style={{ marginTop: '16px' }}>
							Upload
						</Button>
					</label>
					<div>
						{fileName}
						<br />
						{parsedData}
					</div>
					{loading && <LinearProgress color='primary' />}
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose} color='secondary'>
						Cancel
					</Button>
					<Button onClick={handleAddCourse} color='primary' disabled={!!loading || !!!name}>
						Save
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
};

export default CourseDialog;
