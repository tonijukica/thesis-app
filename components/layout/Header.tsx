import { FunctionComponent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Container, Grid, makeStyles, createStyles, Button, Theme } from '@material-ui/core';
import { useAuth } from '../../auth/hooks/useAuth';
import red from '@material-ui/core/colors/red';


const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		header: {
			backgroundColor: theme.palette.primary.main,
			paddingTop: '16px',
			paddingBottom: '21px',
			fontSize: '14px',
			lineHeight: 1.5,
			color: 'white',
			height: '64px',
		},
		row: {
			height: '16px',
		},
		link: {
			marginRight: '16px',
			color: 'white',
    },
    logoutBtn: {
      marginRight: '8px',
      backgroundColor: red[300],
      color: 'white',
      '&:hover': {
        backgroundColor: red[500]
      }
    }
	})
);

const Header: FunctionComponent = () => {
	const classes = useStyles();
	const router = useRouter();
  const { user, isAuthenticated, logout, isLoading } = useAuth();
  const handleLogout = () => {
    router.push('/').then(()=>{
      logout();
      router.reload();
    });
  }

	return (
		<Container maxWidth={false} className={classes.header}>
			<Grid container direction='row' justify='space-around' alignItems='flex-start' className={classes.row}>
				<Grid container item xs={12} sm={6} style={{ height: '36.5px' }} alignContent='center'>
					<Link href='/'>
            <strong style={{ cursor: 'pointer' }}>APP</strong>
          </Link>
				</Grid>
				<Grid item xs={12} sm={6}>
					<nav style={{ textAlign: 'end' }}>
						{!isLoading && !isAuthenticated && (
							<Button onClick={() => router.push('/auth') } color='secondary' variant='contained'>
								Log in
							</Button>
						)}
						{!isLoading && isAuthenticated && (
							<>
								<strong><span className={classes.link}>{user}</span></strong>
								<Button onClick={handleLogout} variant='text' className={classes.logoutBtn}>
									Log out
								</Button>
							</>
						)}
					</nav>
				</Grid>
			</Grid>
		</Container>
	);
};
export default Header;
