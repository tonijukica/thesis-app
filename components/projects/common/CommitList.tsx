import { Commit } from '../../../interfaces';
import { FC, useState } from 'react';
import { Grid } from '@material-ui/core';
import { Pagination } from '@material-ui/lab';
import ProjectCommits from './ProjectCommits';
import { useStyles } from './styles';

type CommitListProps = {
	commits: Commit[];
};

export const CommitList: FC<CommitListProps> = ({ commits }) => {
	const classes = useStyles();
	const rowsPerPage = 5;
  const [page, setPage] = useState(1);
  
	const handlePageChange = (event: any, value: number) => {
		if(event) 
			setPage(value);
  };
  
	return (
		<Grid container direction='row' justify='center' className={classes.commitList}>
			<h2>Commits</h2>
			<Grid item container direction='row' justify='center' className={classes.commitList}>
				<Grid item xs={4}>
					User
				</Grid>
				<Grid item xs={4}>
					Commit message
				</Grid>
				<Grid item xs={4}>
					Date
				</Grid>
			</Grid>
			<ProjectCommits commits={commits.slice(page * rowsPerPage - rowsPerPage, page * rowsPerPage)} />
			<Pagination
				shape='round'
				color='primary'
				page={page}
				count={Math.ceil(commits.length / rowsPerPage)}
				onChange={handlePageChange}
			/>
		</Grid>
	);
};
