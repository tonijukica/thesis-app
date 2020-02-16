import { FunctionComponent } from 'react';
import Link from 'next/link';
import { Container, Grid,  } from '@material-ui/core';

const Header: FunctionComponent = () => (
    <Container maxWidth = 'xl' >
        <Grid container direction = 'row' justify = 'space-around' alignItems = 'flex-start'>
            <Grid item xs = {12} sm = {6}>
                <div>
                    app
                </div>
            </Grid>
            <Grid item xs = {12} sm = {6}>
                <nav style = {{textAlign: 'end'}}>
                    <Link href="/">
                        <a>Home</a>
                    </Link>{' '}
                    |{' '}
                    <Link href="/about">
                        <a>About</a>
                    </Link>{' '}
                    |{' '}
                    <Link href="/users">
                        <a>Users List</a>
                    </Link>
                </nav>
            </Grid>
        </Grid>
    </Container>
);

export default Header;