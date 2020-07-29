import { FunctionComponent } from 'react';
import { Container, Grid, makeStyles, createStyles } from '@material-ui/core';

const useStyles = makeStyles(() =>
  createStyles({
    footer: {
      borderTop: '1px solid #d1d5da !important',
      color: 'grey',
      height: '2.5rem',
      position: 'absolute',
      bottom: '0',
      textAlign: 'center',
      paddingTop: '8px',
    },
  })
);

const Footer: FunctionComponent = () => {
  const classes = useStyles();
  return (
    <Container maxWidth={false} className={classes.footer}>
      <Grid container direction="row" justify="center" alignItems="center">
        <span>Toni Jukica 2020</span>
      </Grid>
    </Container>
  );
};

export default Footer;
