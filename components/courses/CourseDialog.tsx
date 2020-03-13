import { FunctionComponent, useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core'
import { Button, TextField, LinearProgress } from '@material-ui/core'
import { parseInput, prepareInputData } from './helper';

type CourseDialogProps = {
    open: boolean,
    handleClose: any,
    handleNameChange: any,
    dataInput: any
    addCourse: any
}

const CourseDialog: FunctionComponent<CourseDialogProps> = ({open , handleClose, handleNameChange, dataInput, addCourse}) => {
    let fileReader: any;
    const [fileName, setfileName] = useState('');
    const [parsedData, setParsedData] = useState('');
    const [loading, setLoading] = useState(false)
    const handleFileInput = (file: any) => {
        setLoading(true);
          fileReader = new FileReader;
          fileReader.onloadend = handleFileRead;
          fileReader.readAsText(file[0]);
          setfileName(file[0].name);
    };
    const handleFileRead = () => {
        const content: string = fileReader.result;
        const parsedInput = parseInput(content);
        const prepedData = prepareInputData(parsedInput);
        setParsedData(`Found ${prepedData.length} projects`);
        setLoading(false);
        dataInput(prepedData);
    };
    const handleAddCourse = () => {
        setLoading(true);
        addCourse()
        .then(() => {
            setLoading(false);
            setParsedData('');
            setfileName('');
        })
    }
    return(
        <>
        <Dialog open = {open} onClose = {handleClose}>
        <DialogTitle>Add new course</DialogTitle>
        <DialogContent>
            <DialogContentText>
                Fill out the following:
            </DialogContentText>
            <TextField
                margin = 'dense'
                label = 'Course name'
                onChange = {handleNameChange}
                fullWidth
            />
            <input 
                id='fileInput' 
                type = 'file'
                accept='.csv'
                onChange = {(e) => handleFileInput(e.target.files)}
                style = {{ display: 'none'}} />
            <label htmlFor='fileInput'>
                <Button variant='outlined' color='primary' component='span' style={{marginTop: '16px'}}>
                    Upload
                </Button>
            </label>
            <div>
                {fileName}
                <br/>
                {parsedData}
            </div>
            {loading && <LinearProgress color='primary' />}
        </DialogContent>
        <DialogActions>
            <Button onClick = {handleClose} color = 'secondary'>
                Cancel
            </Button>
            <Button onClick = {handleAddCourse} color = 'primary'>
                Save
            </Button>
        </DialogActions>
        </Dialog>
        </>
    );
}

export default CourseDialog;