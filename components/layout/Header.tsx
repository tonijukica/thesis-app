import { FunctionComponent } from 'react';
import Link from 'next/link';
import { Container, Grid, makeStyles, createStyles } from '@material-ui/core';
import { useAuth0 } from '../../lib/auth0-spa';

const useStyles = makeStyles(() => createStyles({
  header: {
    backgroundColor: '#24292e',
    paddingTop: '16px',
    paddingBottom: '21px',
    fontSize: '14px',
    lineHeight: 1.5,
    color: 'white'
  },
  row: {
   height: '16px'
  },
  link: {
    marginRight: '16px',
    color: 'white'
  }   
}));


const Header: FunctionComponent = () => {
  const classes = useStyles();
  const { user, isAuthenticated, loginWithRedirect, logout, loading } = useAuth0();
  return(
    <Container maxWidth = {false} className = {classes.header}>
        <Grid container direction = 'row' justify = 'space-around' alignItems = 'flex-start' className = {classes.row}>
            <Grid item xs = {12} sm = {6}>
                <div>
                    APP
                </div>
            </Grid>
            <Grid item xs = {12} sm = {6}>
                <nav style = {{textAlign: 'end'}}>
                    <Link href="/courses">
                        <a className = {classes.link}>Courses</a>
                    </Link>
                    <Link href="/projects">
                        <a className = {classes.link}>Projects</a>
                    </Link>
                    {!loading && !isAuthenticated && (
                      <span onClick={() => loginWithRedirect({})}>Log in</span>
                    )}
                    { user &&
                      <span className = {classes.link}>{user.nickname}</span>
                    }
                    {!loading && isAuthenticated && (
                      <span onClick={() => logout()}>Log out</span>
                    )}

                </nav>
            </Grid>
        </Grid>
    </Container>
  )
}
export default Header;