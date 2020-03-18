import { FunctionComponent } from 'react';
import { Container, makeStyles, createStyles } from '@material-ui/core';

const useStyles = makeStyles(() => createStyles({
    container: {
        paddingBottom: '16px',
        paddingTop: '16px',
        height: '1000px',
        maxHeight: '1200px'
    }   
  }));

const Main: FunctionComponent = ({ children }) => {
    const classes = useStyles();
    return(
        <Container maxWidth = 'xl' className = {classes.container}>
                {children}
        </Container>
    );
}
export default Main;