import { FunctionComponent, useState, useEffect } from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Collapse } from '@material-ui/core';
import { Alert } from '@material-ui/lab'
import { Button, LinearProgress } from '@material-ui/core';
import { getFileContent } from '../../common/fileUpload';

type ProjectDialogProps = {
	open: boolean;
	handleClose: any;
	bulkProjects: any;
	addProjects: any;
};

const useStyles = makeStyles((theme: Theme) =>
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
    },
    dialogTitle: {
      backgroundColor: theme.palette.primary.main,
      color: 'white'
    }
	})
);

const AddProjectDialog: FunctionComponent<ProjectDialogProps> = ({ open, handleClose, bulkProjects, addProjects }) => {
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
      bulkProjects(fileData);
      setLoading(false);
    }
    catch(err){
      setLoading(false);
      setError({
        err: true,
        errMsg: 'Unsupported file format. No projects found!'
      });
    }
	};
	const handleAddProjects = () => {
		setLoading(true);
		addProjects().then(() => {
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
				<DialogTitle className={classes.dialogTitle}>Add new projects</DialogTitle>
				<DialogContent>
					<DialogContentText>Select file with projects</DialogContentText>
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
					<Button onClick={handleClose} color='secondary' style={{color: 'red'}}>
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
