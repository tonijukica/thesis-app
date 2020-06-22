import { FunctionComponent, useContext } from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core';
import { Button } from '@material-ui/core';
import { useMutation } from '@apollo/react-hooks';
import { DELETE_PROJECT } from '../../../gql/queries/projects';
import { Context } from '../Context';
import { Project } from '../../../interfaces';

type DeleteProjectDialogProps = {
  projectId: number;
	name: string;
	open: boolean;
  closeDialog: any;
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

const DeleteProjectDialog: FunctionComponent<DeleteProjectDialogProps> = ({
  projectId,
	name,
	open,
  closeDialog,
}) => {
  const { state, dispatch } = useContext(Context);
  const classes = useStyles();
  const [deleteProject] = useMutation(DELETE_PROJECT);
  const handleDelete = async () => {
    await deleteProject({
			variables: {
				projectId: Number(projectId),
			},
    });
    const project: Project = state.projects.find((projectEl: Project) => projectEl.id === projectId)!;
    dispatch({
      type: 'remove',
      project
    });
    closeDialog();
  }
	return (
		<>
			<Dialog open={open} onClose={closeDialog} fullWidth>
				<DialogTitle className={classes.dialogTitle}>Confirmation</DialogTitle>
				<DialogContent>
					<DialogContentText>
            Are you sure you want to delete <strong>{name}</strong> project?
          </DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={closeDialog} color='secondary' style={{color: 'red'}}>
						Cancel
					</Button>
					<Button onClick={handleDelete} color='primary'>
						Delete
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
};

export default DeleteProjectDialog;
