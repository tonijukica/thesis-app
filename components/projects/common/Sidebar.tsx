import { FC } from 'react';
import classNames from 'classnames';
import { Grid } from '@material-ui/core';
import { useStyles } from './styles';
import { Project, Student } from '../../../interfaces';
import { formatDate, userCommits } from '../helpers';
import { Chart, ArgumentAxis, ValueAxis, BarSeries } from '@devexpress/dx-react-chart-material-ui';
import * as githubLogo from '../../../assets/img/github_logo.png';
import * as netlifyLogo from '../../../assets/img/netlify_logo.png';

type SidebarProps = {
	project: Project;
	creationDate: string;
	commits: any[];
};

export const Sidebar: FC<SidebarProps> = ({ project, creationDate, commits }) => {
	const classes = useStyles();
	return (
		<>
			<Grid
				container
				direction='column'
				item
				xs={2}
				justify='flex-start'
				className={classNames(classes.border, classes.projectInfo)}
				style={{ marginRight: '16px' }}
			>
				<Grid item>
					<h2>Project information</h2>
				</Grid>
				<Grid item className={classes.infoBox}>
					<strong>Project name:</strong>
					<br />
					{project.name}
				</Grid>
				<Grid item className={classes.infoBox}>
					<strong>Students:</strong>
					<br />
					{project.students.map((student: Student) => {
						return (
							<div key={student.id}>
								{student.name}
								<br />
							</div>
						);
					})}
				</Grid>
				<Grid item className={classes.infoBox}>
					<strong>Created at:</strong>
					<br />
					{formatDate(creationDate)}
				</Grid>
				<Grid item className={classes.infoBox}>
					Links:
					<br />
					<a href={project.github_url}>
						<img src={githubLogo} style={{ padding: '5px' }} />
					</a>
					{project.prod_url && (
						<a href={project.prod_url}>
							<img src={netlifyLogo} style={{ padding: '5px' }} />
						</a>
					)}
				</Grid>
				<Grid container item justify='center' className={classes.infoBox}>
					<Chart data={userCommits(commits)} width={200} height={250}>
						<ValueAxis />
						<ArgumentAxis />
						<BarSeries valueField='count' argumentField='user' />
					</Chart>
				</Grid>
			</Grid>
		</>
	);
};
