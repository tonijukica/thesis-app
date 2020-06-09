import { FunctionComponent, useState, useEffect, useContext } from 'react';
import { useMutation } from '@apollo/react-hooks';
import { makeStyles, createStyles, Theme } from '@material-ui/core';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Collapse } from '@material-ui/core';
import { Alert } from '@material-ui/lab'
import { Button, LinearProgress } from '@material-ui/core';
import { getFileContent } from '../../common/fileUpload';
import { Context } from '../Context';
import { INSERT_BULK_PROJECTS } from '../../.././gql/queries/projects';

type ProjectDialogProps = {
  courseId: number;
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

const AddProjectDialog: FunctionComponent<ProjectDialogProps> = ({ courseId  }) => {
  const classes = useStyles();
	const [fileName, setfileName] = useState('');
	const [parsedData, setParsedData] = useState('');
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState([]);
  const { state, dispatch } = useContext(Context);
  const [insertProjects] = useMutation(INSERT_BULK_PROJECTS);
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
      setError({
        err: false,
        errMsg: ''
      });
      setProjects(fileData);
      setLoading(false);
    }
    catch(err){
      setLoading(false);
      setError({
        err: true,
        errMsg: 'Unsupported file format. No projects found!'
      });
      setParsedData('');
    }
	};
	const handleAddProjects = () => {
		setLoading(true);
		addProjects().then(() => {
			setLoading(false);
			setParsedData('');
      setfileName('');
      dispatch({ type: 'dialogBulkToggle' });
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

  const addProjects = () => {
		return new Promise((resolve) => {
			const newProjects = projects.map((project: any) => {
				return {
					...project,
				};
			});
			insertProjects({
				variables: {
					projects: newProjects,
					courseId,
				},
			}).then(({ data }) => {
				dispatch({
          type: 'addBulk',
          projects: data.insert_projects
        });
				resolve();
			});
		});
  };
  const closeCleanup = () => {
    setError({
      err: false,
      errMsg: ''
    });
    setLoading(false);
    setParsedData('');
    setfileName('');
    dispatch({ type: 'dialogBulkToggle' });
  }
	return (
		<>
			<Dialog open={state.dialogBulk} onClose={closeCleanup} fullWidth>
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
					<Button onClick={closeCleanup} color='secondary' style={{color: 'red'}}>
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
