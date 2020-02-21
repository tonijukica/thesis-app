import { FunctionComponent } from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core'
import { Button, TextField } from '@material-ui/core'

type ProjectDialogProps = {
    open: boolean,
    handleClose: any,
    handleNameChange: any,
    handleStudenNameChange: any,
    addProject: any
}

const ProjectDialog: FunctionComponent<ProjectDialogProps> = ({open, handleClose, handleNameChange, handleStudenNameChange, addProject}) => {
    return(
        <>
        <Dialog open = {open} onClose = {handleClose}>
        <DialogTitle>Add new project</DialogTitle>
        <DialogContent>
            <DialogContentText>
                Fill out the following:
            </DialogContentText>
            <TextField
                margin = 'dense'
                label = 'Project name'
                onChange = {handleNameChange}
                fullWidth
            />
            <TextField
                margin = 'dense'
                label = 'Student name'
                onChange = {handleStudenNameChange}
                fullWidth
            />
        </DialogContent>
        <DialogActions>
            <Button onClick = {handleClose} color = 'secondary'>
                Cancel
            </Button>
            <Button onClick = {addProject} color = 'primary'>
                Save
            </Button>
        </DialogActions>
        </Dialog>
        </>
    );
}

export default ProjectDialog;