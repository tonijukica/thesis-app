import { FunctionComponent, useContext } from 'react';
import { Context } from '../CourseList';
import { makeStyles, createStyles, Theme } from '@material-ui/core';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core';
import { Button } from '@material-ui/core';
import { useMutation } from '@apollo/react-hooks';
import { DELETE_COURSE_BY_ID } from '../../../gql/queries/courses';

type CourseDeleteDialogProps = {
  courseId: number;
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

const CourseDeleteDialog: FunctionComponent<CourseDeleteDialogProps> = ({
  courseId,
	name,
	open,
  closeDialog
}) => {
  const classes = useStyles();
  const context: any = useContext(Context);
  const { dispatch } = context;
  const [deleteCourse] = useMutation(DELETE_COURSE_BY_ID);
  const handleDelete = async () => {
    await deleteCourse({
			variables: {
				courseId: Number(courseId),
			},
    });
    dispatch({ type: 'remove', course: { courseId } });
    closeDialog();
  }
	return (
		<>
			<Dialog open={open} onClose={closeDialog} fullWidth>
				<DialogTitle className={classes.dialogTitle}>Confirmation</DialogTitle>
				<DialogContent>
					<DialogContentText>
            Are you sure you want to delete <strong>{name}</strong> course?
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

export default CourseDeleteDialog;
