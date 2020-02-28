import { FunctionComponent } from 'react';
import Link from 'next/link';
import { Container, Grid, makeStyles, createStyles } from '@material-ui/core';

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
                    <Link href="/users">
                        <a className = {classes.link}>Users List</a>
                    </Link>
                </nav>
            </Grid>
        </Grid>
    </Container>
  )
}
export default Header;