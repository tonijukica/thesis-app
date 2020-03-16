import { FunctionComponent, useState, useEffect } from "react";
import { Grid, makeStyles, createStyles, Paper } from "@material-ui/core";
import { Chart, ArgumentAxis, ValueAxis, SplineSeries } from '@devexpress/dx-react-chart-material-ui';
import { Pagination } from "@material-ui/lab";
import classNames from "classnames";
import ProjectCommits from "./ProjectCommits";
import { useQuery } from "@apollo/react-hooks";
import { GET_PROJECT, GET_COMMITS } from "../../gql/queries/projects";
import { Student } from "../../interfaces";
import { getUserRepoName } from "./helpers";
import * as logo from '../../assets/img/github_logo.png';

type ProjectProps = {
	projectId: number;
};

const useStyles = makeStyles(() =>
	createStyles({
		border: {
			border: "1px solid #e1e4e8 !important",
			padding: "16px",
			textAlign: "center"
		},
		details: {
			height: "512px"
		},
		projectInfo: {
			textAlign: "center"
		},
		commitList: {
			borderBottom: "1px solid #e1e4e8 !important",
			padding: "8px",
			textAlign: "center"
		},
		infoBox: {
			paddingTop: '16px'
		}
	})
);
const ProjectDetails: FunctionComponent<ProjectProps> = ({ projectId }) => {
	const classes = useStyles();
	const rowsPerPage = 5;
	const { data } = useQuery(GET_PROJECT, { variables: { projectId } });
	const [project, setProject] = useState();
	const [commits, setCommits] = useState();
	const [owner, setOwner] = useState("");
	const [repoName, setRepoName] = useState("");
	const [page, setPage] = useState(1);
	const { data: githubData } = useQuery(GET_COMMITS, {
		skip: !data,
		variables: {
			repoName,
			owner
		},
		context: {
			clientName: "github"
		}
	});
	const commitHistory = (commits: any) => {
		const history: any = [];
		commits.forEach((commit: any) => {
			const date = new Date(commit.committedDate);
			const indx = date.getDate() + '-' +(date.getMonth() + 1)
			const index = history.findIndex((x: any) => x.date === indx);
			if(history[index]== null) {
					history.push({date: indx, count: 1});
				}
			else {
				history[index].count += 1;
			}
		})
		history.sort((a:any ,b: any) => {
			var key1 = new Date(a.date);
    	var key2 = new Date(b.date);
			if (key1 < key2) {
					return -1;
			} else if (key1 == key2) {
					return 0;
			} else {
					return 1;
			}
			});
		return history;
	}
	useEffect(() => {
		if (data) setProject(data.projects[0]);
		if (githubData) setCommits(githubData.repository.object.history.nodes);
		if (project) {
			const [user, repo] = getUserRepoName(project.github_url);
			setOwner(user), setRepoName(repo);
		}
	}, [data, githubData, project, page]);
	const handlePageChange = (event: any, value: number) => {
		if (event) setPage(value);
	};
	if (project && commits) {
		return (
			<>
				<Grid container direction='row' justify='center' className={classNames(classes.details)}>
					<Grid
						container
						direction='column'
						item
						xs={2}
						justify='flex-start'
						className={classNames(classes.border, classes.projectInfo)}
						style={{marginRight: '16px'}}
					>
						<Grid item>
							<h2>Project information</h2>
						</Grid>
						<Grid item className = {classes.infoBox}>
							<strong>Project name:</strong>
							<br/>
							{project.name}
						</Grid>
						<Grid item className = {classes.infoBox}>
							<strong>Students:</strong>
							<br/>
							{project.students.map((student: Student) => {
								return (
									<>
										{student.name}
										<br/>
									</>
								);
							})}
						</Grid>
						<Grid item className = {classes.infoBox}>
							Links:
							<br/>
							<a href={project.github_url}><img src={logo} style={{padding: '5px'}}/></a>
						</Grid>
					</Grid>
					<Grid container item xs={9} className={classes.border} justify='center' style={{marginLeft: '16px'}}>
						<Paper>
							<Chart data={commitHistory(commits)} width={900} height={500}>
								<ValueAxis />
								<ArgumentAxis />
								<SplineSeries valueField = 'count' argumentField='date' />
							</Chart>
						</Paper>
					</Grid>
				</Grid>
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
						shape='rounded'
						color='primary'
						page={page}
						count={Math.ceil(commits.length / rowsPerPage)}
						onChange={handlePageChange}
					/>
				</Grid>
			</>
		);
	} else return <p>LOADING</p>;
};
export default ProjectDetails;
