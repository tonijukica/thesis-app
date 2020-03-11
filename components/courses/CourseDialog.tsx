import { FunctionComponent, useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core'
import { Button, TextField } from '@material-ui/core'

type CourseDialogProps = {
    open: boolean,
    handleClose: any,
    handleNameChange: any,
    addCourse: any
}

const CourseDialog: FunctionComponent<CourseDialogProps> = ({open , handleClose, handleNameChange, addCourse}) => {
    const [fileInput, setFileInput] = useState('');
    let fileReader: any;
    const handleFileInput = (file: any) => {
          fileReader = new FileReader;
          fileReader.onloadend = handleFileRead;
          fileReader.readAsText(file[0]);
    };
    const handleFileRead = () => {
        const content: string = fileReader.result;
        setFileInput(content);
    };
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
            <input type = 'file' onChange = {(e) => handleFileInput(e.target.files)} />
            {fileInput}
        </DialogContent>
        <DialogActions>
            <Button onClick = {handleClose} color = 'secondary'>
                Cancel
            </Button>
            <Button onClick = {addCourse} color = 'primary'>
                Save
            </Button>
        </DialogActions>
        </Dialog>
        </>
    );
}

export default CourseDialog;