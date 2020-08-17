import { FunctionComponent } from 'react';
import { Container, makeStyles, createStyles } from '@material-ui/core';

const useStyles = makeStyles(() =>
  createStyles({
    container: {
      paddingBottom: '3rem',
      paddingTop: '16px',
      minHeight: '95vh',
    },
  })
);

const Main: FunctionComponent = ({ children }) => {
  const classes = useStyles();
  return (
    <Container maxWidth="xl" className={classes.container}>
      {children}
    </Container>
  );
};
export default Main;
