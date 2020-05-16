import { FunctionComponent, useState, FormEvent } from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core';
import { RadioGroup, Radio, FormControlLabel} from '@material-ui/core';
import { Button } from '@material-ui/core';

type GradeProjectDialogProps = {
  projectId: number;
  name: string;
  grade: number | null;
	open: boolean;
  closeDialog: any;
};

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		name: {
      marginTop: '21px',
      paddingLeft: '16px'
    },
    group: {
      justifyContent: 'center'
    },
    dialogTitle: {
      backgroundColor: theme.palette.primary.main,
      color: 'white'
    }
	})
);

const GradeProjectDialog: FunctionComponent<GradeProjectDialogProps> = ({
  projectId,
  name,
  grade: initialGrade,
	open,
  closeDialog,
}) => {
  const classes = useStyles();
  const [grade, setGrade] = useState<Number | null>(initialGrade);

  const handleGradeChange = (event: FormEvent<HTMLInputElement>) => {
    setGrade(Number((event.target as HTMLInputElement).value));
  }
  const handleGrading = async () => {
    closeDialog();
  }
	return (
		<>
			<Dialog open={open} onClose={closeDialog} fullWidth>
				<DialogTitle className={classes.dialogTitle}>Confirmation</DialogTitle>
				<DialogContent>
					<DialogContentText>
            Select a grade for <strong>{name}</strong> project?
          </DialogContentText>
          <RadioGroup
            row
            className={classes.group}
            aria-label='grade'
            name='grade'
            value={grade}
            onChange={handleGradeChange}
          >
            <FormControlLabel value={1} control={<Radio/>} label='1' />
            <FormControlLabel value={2} control={<Radio/>} label='2' />
            <FormControlLabel value={3} control={<Radio/>} label='3' />
            <FormControlLabel value={4} control={<Radio/>} label='4' />
            <FormControlLabel value={5} control={<Radio/>} label='5' />
          </RadioGroup>
				</DialogContent>
				<DialogActions>
					<Button onClick={closeDialog} color='secondary' style={{color: 'red'}}>
						Cancel
					</Button>
					<Button onClick={handleGrading} color='primary' disabled={!!!grade}>
						Grade
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
};

export default GradeProjectDialog;
