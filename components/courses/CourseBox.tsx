import { FunctionComponent, useState, useContext } from 'react';
import {
  Grid,
  makeStyles,
  createStyles,
  Card,
  CardActionArea,
  CardContent,
  CardHeader,
  Theme,
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import { useRouter } from 'next/router';
import CourseDeleteDialog from './dialogs/CourseDeleteDialog';
import { Context } from './helper';

type CourseBoxProps = {
  name: string;
  courseId: number;
  studentProjects: number;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    card: {
      width: '60%',
      textAlign: 'center',
      marginBottom: '16px',
      marginTop: '16px',
    },
    cardHeader: {
      color: 'white',
      backgroundColor: theme.palette.secondary.main,
      fontSize: '2rem',
    },
    cardName: {
      fontSize: '1.5rem',
    },
    cardActionArea: {
      fontSize: '1em',
    },
    content: {
      color: theme.palette.primary.main,
    },
    deleteIcon: {
      position: 'absolute',
      top: 0,
      right: 0,
      zIndex: 1000,
    },
  })
);

const CourseBox: FunctionComponent<CourseBoxProps> = ({
  name,
  courseId,
  studentProjects,
}) => {
  const classes = useStyles();
  const router = useRouter();
  const [dialog, setDialog] = useState(false);
  const { state } = useContext(Context);

  const handleRedirect = (e: any) => {
    e.preventDefault();
    router.push(`/courses/${courseId}`);
  };
  const handleDialog = () => {
    setDialog(!dialog);
  };

  return (
    <Grid container xs={4} item justify="center">
      <CourseDeleteDialog
        courseId={courseId}
        name={name}
        open={dialog}
        closeDialog={handleDialog}
      />
      <Card
        className={classes.card}
        onClick={state.delete ? handleDialog : handleRedirect}
      >
        <CardActionArea className={classes.cardActionArea}>
          {state.delete ? (
            <DeleteIcon
              style={{ color: 'white' }}
              className={classes.deleteIcon}
            />
          ) : null}
          <CardHeader
            title={name.toLocaleUpperCase()}
            className={classes.cardHeader}
          />
          <CardContent className={classes.content}>
            <div>
              <span className={classes.cardName}>{studentProjects}</span>
              <br />
              Projects
            </div>
          </CardContent>
        </CardActionArea>
      </Card>
    </Grid>
  );
};

export default CourseBox;
