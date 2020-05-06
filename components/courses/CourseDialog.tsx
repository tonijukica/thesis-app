import { FunctionComponent, useState, useEffect } from 'react';
import { makeStyles, createStyles } from '@material-ui/core';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Collapse } from '@material-ui/core';
import { Button, TextField, LinearProgress } from '@material-ui/core';
import { Alert } from '@material-ui/lab'
import { getFileContent } from '../common/fileUpload';

type CourseDialogProps = {
	name: string;
	open: boolean;
	handleClose: any;
	handleNameChange: any;
	dataInput: any;
	addCourse: any;
};

const useStyles = makeStyles(() =>
	createStyles({
		name: {
      marginTop: '21px',
      paddingLeft: '16px'
    },
    uploadBox: {
      display: 'flex',
      padding: '8px',
      paddingBottom: '16px',
      paddingLeft: '0px'
    }
	})
);

const CourseDialog: FunctionComponent<CourseDialogProps> = ({
	name,
	open,
	handleClose,
	handleNameChange,
	dataInput,
	addCourse,
}) => {
  const classes = useStyles();
	const [fileName, setfileName] = useState('');
	const [parsedData, setParsedData] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({
    err: false,
    errMsg: ''
  });

	const handleFileInput = async (file: any) => {
    try{
      setLoading(true);
      setfileName(file[0].name);
      const fileData = await getFileContent(file[0]);
      setParsedData(`Found ${fileData.length} projects`);
      setLoading(false);
      dataInput(fileData);
    }
    catch(err){
      setLoading(false);
      setError({
        err: true,
        errMsg: 'Unsupported file format. No projects found!'
      });
    }
	};
	const handleAddCourse = () => {
		setLoading(true);
		addCourse().then(() => {
			setLoading(false);
			setParsedData('');
			setfileName('');
		});
	};
  useEffect(() => {
    setError({
      errMsg: '',
      err: false
    });
    setfileName('');
    setParsedData('');
    setLoading(false);
  }, [open]);
	return (
		<>
			<Dialog open={open} onClose={handleClose} fullWidth>
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
          <div className={classes.uploadBox}>
            <label htmlFor='fileInput'>
              <Button variant='outlined' color='primary' component='span' style={{ marginTop: '16px' }}>
                Upload
              </Button>
            </label>
            <span className={classes.name}> {fileName} </span>
          </div>
          {loading && <LinearProgress color='primary' />}
					<div>
            <Collapse in={error.err}>
              <Alert severity="error" onClose={() => setError({ err: false, errMsg: ''})}>
                {error.errMsg}
              </Alert>
            </Collapse>
            <Collapse in={!!parsedData}>
              <Alert severity="success">
                {parsedData}
              </Alert>
            </Collapse>
					</div>
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
