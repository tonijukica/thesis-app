import { FunctionComponent } from 'react';
import { Container, Grid } from '@material-ui/core';

const Footer: FunctionComponent = ({}) => (
    <Container maxWidth = 'xl'>
        <hr />
        <Grid container direction = 'row' justify = 'center' alignItems = 'center'>
            <span>Toni Jukica 2020</span>
        </Grid>
    </Container>
);

export default Footer;