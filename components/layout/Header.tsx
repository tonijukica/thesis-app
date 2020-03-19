import { FunctionComponent } from "react";
import Link from "next/link";
import { Container, Grid, makeStyles, createStyles, Button } from "@material-ui/core";
import { useAuth0 } from "../../lib/auth0-spa";

const useStyles = makeStyles(() =>
	createStyles({
		header: {
			backgroundColor: "#24292e",
			paddingTop: "16px",
			paddingBottom: "21px",
			fontSize: "14px",
			lineHeight: 1.5,
      color: "white",
      height: '64px'
		},
		row: {
			height: "16px"
		},
		link: {
			marginRight: "16px",
			color: "white"
		}
	})
);

const Header: FunctionComponent = () => {
	const classes = useStyles();
	const { user, isAuthenticated, loginWithRedirect, logout, loading } = useAuth0();
	return (
		<Container maxWidth={false} className={classes.header}>
			<Grid container direction='row' justify='space-around' alignItems='flex-start' className={classes.row}>
				<Grid container item xs={12} sm={6} style={{height: '36.5px'}} alignContent='center'>
          APP
				</Grid>
				<Grid item xs={12} sm={6}>
					<nav style={{ textAlign: "end" }}>
						{!loading && !isAuthenticated && (
							<Button onClick={() => loginWithRedirect({})} color='primary'>
								Log in
							</Button>
						)}
						{!loading && isAuthenticated && (
							<>
								<Link href='/courses'>
									<a className={classes.link}>Courses</a>
								</Link>
								<Link href='/projects'>
									<a className={classes.link}>Projects</a>
								</Link>
								<span className={classes.link}>{user.nickname}</span>
								<Button onClick={() => logout()} color='secondary'>
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
