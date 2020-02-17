import { FunctionComponent } from 'react';
import { Container, Grid, makeStyles, createStyles } from '@material-ui/core';

const useStyles = makeStyles(() => createStyles({
    footer: {
      backgroundColor: '#e1e4e8',
      paddingTop: '32px',
      paddingBottom: '32px'
    }
  }));
  

const Footer: FunctionComponent = () => {
    const classes = useStyles();
    return(
        <Container maxWidth = {false} className = {classes.footer}>
            <Grid container direction = 'row' justify = 'center' alignItems = 'center'>
                <span>Toni Jukica 2020</span>
            </Grid>
        </Container>
    )
};

export default Footer;