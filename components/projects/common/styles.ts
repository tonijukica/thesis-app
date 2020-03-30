import { makeStyles, createStyles } from '@material-ui/core';

export const useStyles = makeStyles(() =>
createStyles({
  border: {
    border: "1px solid #e1e4e8 !important",
    padding: "16px",
    textAlign: "center"
  },
  details: {
    height: "600px"
  },
  projectInfo: {
    textAlign: "center"
  },
  commitList: {
    borderBottom: "1px solid #e1e4e8 !important",
    padding: "8px",
    textAlign: "center"
  },
  infoBox: {
    paddingTop: "8px"
  }
})
);
