import { FC, useContext } from "react";
import { Context } from '../helper';
import { Grid, Button, Collapse, Theme, makeStyles, createStyles } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import DeleteIcon from '@material-ui/icons/Delete';

type ListHeaderProps = {
  title: string;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      paddingBottom: "16px",
      borderBottom: "1px solid #e1e4e8 !important",
    },
    button: {
      marginRight: "8px",
    },
    delBtn: {
      marginRight: "8px",
      backgroundColor: theme.palette.error.main,
      color: "white",
      "&:hover": {
        backgroundColor: theme.palette.error.dark,
      },
    }
  })
);

const ListHeader: FC<ListHeaderProps> = ({ title }) => {
  const classes = useStyles();
  const { state, dispatch } = useContext(Context);

  const handleClickOpen = () => {
    dispatch({ type: "dialogAddToggle" });
  };
  const handleDelete = () => {
    dispatch({ type: "deleteToggle" });
  };

  return (
    <Grid
      container
      direction="row"
      justify="space-around"
      alignItems="flex-start"
      className={classes.container}
    >
      <Grid item xs={4}>
        {title}
      </Grid>
      <Grid item xs={4}>
        <Collapse in={state.delete}>
          <Alert severity="error">Delete mode is enabled</Alert>
        </Collapse>
      </Grid>
      <Grid container item xs={4} justify="flex-end" alignItems="flex-end">
        <Button
          variant="contained"
          color="secondary"
          className={classes.button}
          onClick={handleClickOpen}
        >
          New
        </Button>
        <Button
          variant="contained"
          startIcon={<DeleteIcon />}
          className={classes.delBtn}
          onClick={handleDelete}
        >
          Delete
        </Button>
      </Grid>
    </Grid>
  );
};
export default ListHeader;
