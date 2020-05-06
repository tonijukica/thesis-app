import { FunctionComponent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Container, Grid, makeStyles, createStyles, Button } from '@material-ui/core';
import { useAuth } from '../../auth/hooks/useAuth';


const useStyles = makeStyles(() =>
	createStyles({
		header: {
			backgroundColor: '#24292e',
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
					APP
				</Grid>
				<Grid item xs={12} sm={6}>
					<nav style={{ textAlign: 'end' }}>
						{!isLoading && !isAuthenticated && (
							<Button onClick={() => router.push('/auth') } color='primary'>
								Log in
							</Button>
						)}
						{!isLoading && isAuthenticated && (
							<>
								<Link href='/courses'>
									<a className={classes.link}>Courses</a>
								</Link>
								<span className={classes.link}>{user}</span>
								<Button onClick={handleLogout} color='secondary'>
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
