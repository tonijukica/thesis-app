import { FunctionComponent } from 'react';
import {
  Container,
  Grid,
  makeStyles,
  createStyles,
  Theme,
} from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    footer: {
      color: theme.palette.grey[500],
      height: '2.5rem',
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
        <span>Toni Jukica @ FESB 2020</span>
      </Grid>
    </Container>
  );
};

export default Footer;
