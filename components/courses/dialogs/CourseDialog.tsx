import {
  FunctionComponent,
  useState,
  useEffect,
  useContext,
  ChangeEvent,
} from 'react';
import {
  makeStyles,
  createStyles,
  Theme,
  Button,
  TextField,
  LinearProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Collapse,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { useMutation } from '@apollo/react-hooks';
import { getFileContent } from '../../common/fileUpload';
import {
  INSERT_COURSE,
  INESRT_COURSE_BULK_PROJECTS,
} from '../../../gql/queries/courses';
import { Context } from '../helper';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    name: {
      marginTop: '21px',
      paddingLeft: '16px',
    },
    uploadBox: {
      display: 'flex',
      padding: '8px',
      paddingBottom: '16px',
      paddingLeft: '0px',
    },
    dialogTitle: {
      backgroundColor: theme.palette.primary.main,
      color: 'white',
    },
  })
);

const CourseDialog: FunctionComponent = () => {
  const classes = useStyles();
  const [fileName, setfileName] = useState('');
  const [parsedData, setParsedData] = useState('');
  const [courseName, setCourseName] = useState('');
  const [insertCourse] = useMutation(INSERT_COURSE);
  const [insertCourseBulkProjects] = useMutation(INESRT_COURSE_BULK_PROJECTS);
  const [loading, setLoading] = useState(false);
  const [bulkInsertData, setBulkInsertData] = useState<any>([]);
  const { state, dispatch } = useContext(Context);
  const [error, setError] = useState({
    err: false,
    errMsg: '',
  });

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCourseName(e.target.value);
  };

  const handleFileInput = async (file: any) => {
    try {
      setLoading(true);
      setfileName(file[0].name);
      const fileData = await getFileContent(file[0]);
      setParsedData(`Found ${fileData.length} projects`);
      setLoading(false);
      setBulkInsertData(fileData);
    } catch (err) {
      setLoading(false);
      setError({
        err: true,
        errMsg: 'Unsupported file format. No projects found!',
      });
    }
  };

  const addCourse = () => {
    return new Promise((resolve) => {
      if (bulkInsertData) {
        insertCourseBulkProjects({
          variables: {
            courseName,
            year: '2020',
            projects: bulkInsertData,
          },
        }).then((data) => {
          const newCourse = {
            name: courseName,
            courseId: data.data.insert_course.id,
            studentProjects: bulkInsertData.length,
          };
          dispatch({ type: 'add', course: newCourse });
          resolve();
        });
      } else {
        insertCourse({
          variables: {
            name: courseName,
            year: '2020',
          },
        })
          .then(({ data }) => {
            const newCourse = {
              name: courseName,
              courseId: data.insert_course.id,
              studentProjects: 0,
            };
            dispatch({ type: 'add', course: newCourse });
            resolve();
          })
          .catch((e) => console.log(e));
      }
    });
  };
  const handleClose = () => {
    dispatch({ type: 'dialogAddToggle' });
  };
  const handleAddCourse = () => {
    setLoading(true);
    addCourse().then(() => {
      setLoading(false);
      setBulkInsertData([]);
      setParsedData('');
      setfileName('');
      dispatch({ type: 'dialogAddToggle' });
    });
  };
  useEffect(() => {
    setError({
      errMsg: '',
      err: false,
    });
    setfileName('');
    setParsedData('');
    setLoading(false);
  }, [state.dialogAdd]);
  return (
    <>
      <Dialog open={state.dialogAdd} onClose={handleClose} fullWidth>
        <DialogTitle className={classes.dialogTitle}>
          Add new course
        </DialogTitle>
        <DialogContent>
          <DialogContentText>Fill out the following:</DialogContentText>
          <TextField
            margin="dense"
            label="Course name"
            onChange={handleNameChange}
            fullWidth
          />
          <input
            id="fileInput"
            type="file"
            accept=".csv"
            onChange={(e) => handleFileInput(e.target.files)}
            style={{ display: 'none' }}
          />
          <div className={classes.uploadBox}>
            <label htmlFor="fileInput">
              <Button
                variant="outlined"
                color="primary"
                component="span"
                style={{ marginTop: '16px' }}
              >
                Upload
              </Button>
            </label>
            <span className={classes.name}> {fileName} </span>
          </div>
          {loading && <LinearProgress color="primary" />}
          <div>
            <Collapse in={error.err}>
              <Alert
                severity="error"
                onClose={() => setError({ err: false, errMsg: '' })}
              >
                {error.errMsg}
              </Alert>
            </Collapse>
            <Collapse in={!!parsedData}>
              <Alert severity="success">{parsedData}</Alert>
            </Collapse>
          </div>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleClose}
            color="secondary"
            style={{ color: 'red' }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleAddCourse}
            color="primary"
            disabled={!!loading || !courseName}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CourseDialog;
