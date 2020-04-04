import { FunctionComponent, useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core';
import { Button, LinearProgress } from '@material-ui/core';
import { getFileContent } from '../../common/fileUpload';

type ProjectDialogProps = {
	open: boolean;
	handleClose: any;
	bulkProjects: any;
	addProjects: any;
};

const AddProjectDialog: FunctionComponent<ProjectDialogProps> = ({ open, handleClose, bulkProjects, addProjects }) => {
	const [fileName, setfileName] = useState('');
	const [parsedData, setParsedData] = useState('');
	const [loading, setLoading] = useState(false);

	const handleFileInput = async (file: any) => {
		setLoading(true);
		const fileData = await getFileContent(file[0]);
		setParsedData(`Found ${fileData.length} projects`);
		bulkProjects(fileData);
		setLoading(false);
	};
	const handleAddProjects = () => {
		setLoading(true);
		addProjects().then(() => {
			setLoading(false);
			setParsedData('');
			setfileName('');
		});
	};
	
	return (
		<>
			<Dialog open={open} onClose={handleClose}>
				<DialogTitle>Add new projects</DialogTitle>
				<DialogContent>
					<DialogContentText>Select file with projects</DialogContentText>
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
					<Button onClick={handleAddProjects} color='primary' disabled={!!loading || !!!parsedData}>
						Save
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
};

export default AddProjectDialog;
