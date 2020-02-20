import { FunctionComponent } from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core'
import { Button, TextField } from '@material-ui/core'

type CourseDialogProps = {
    open: boolean,
    handleClose: any,
    handleNameChange: any,
    handleNumChange: any,
    addCourse: any
}

const CourseDialog: FunctionComponent<CourseDialogProps> = ({open , handleClose, handleNameChange, handleNumChange, addCourse}) => {
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
            <TextField
                margin = 'dense'
                label = 'Number of projects'
                onChange = {handleNumChange}
                fullWidth
            />
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