import { FunctionComponent } from 'react';
import { Container } from '@material-ui/core';

const Main: FunctionComponent = ({ children }) => (
    <Container maxWidth = 'xl'>
            {children}
    </Container>
);

export default Main;