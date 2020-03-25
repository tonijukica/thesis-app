import { FunctionComponent, useState, useEffect } from "react";
import { Grid, makeStyles, createStyles, Paper, CircularProgress } from "@material-ui/core";
import { Chart, ArgumentAxis, ValueAxis, SplineSeries, BarSeries } from "@devexpress/dx-react-chart-material-ui";
import { Pagination } from "@material-ui/lab";
import classNames from "classnames";
import ProjectCommits from "./ProjectCommits";
import { useQuery } from "@apollo/react-hooks";
import { GET_PROJECT, GET_COMMITS } from "../../gql/queries/projects";
import { Commit, Student, Project } from "../../interfaces";
import { getUserRepoName, formatDate } from "./helpers";
import * as logo from "../../assets/img/github_logo.png";

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
			height: "600px"
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
			paddingTop: "8px"
		}
	})
);
const ProjectDetails: FunctionComponent<ProjectProps> = ({ projectId }) => {
	const classes = useStyles();
	const rowsPerPage = 5;
	const { data } = useQuery(GET_PROJECT, { variables: { projectId } });
	const [project, setProject] = useState<Project | null>(null);
	const [commits, setCommits] = useState<Commit[] | null>(null);
	const [owner, setOwner] = useState("");
	const [creationDate, setCreationDate] = useState("");
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
			const indx = date.getDate() + "-" + (date.getMonth() + 1);
			const index = history.findIndex((x: any) => x.date === indx);
			if (history[index] == null) {
				history.push({ date: indx, count: 1 });
			} else {
				history[index].count += 1;
			}
		});
		history.sort((a: any, b: any) => {
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
	};
	const userCommits = (commits: any) => {
		const userCommits: any = [];
		commits.forEach((commit: any) => {
			const user = commit.author.user.login;
			const userIndex = userCommits.findIndex((x: any) => x.user == user);
			if (userCommits[userIndex] == null) {
				userCommits.push({ user, count: 1 });
			} else userCommits[userIndex].count += 1;
		});
		return userCommits;
	};
	useEffect(() => {
		if (data) setProject(data.projects[0]);
		if (githubData) {
			setCommits(githubData.repository.object.history.nodes);
			setCreationDate(githubData.repository.createdAt);
		}
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
						style={{ marginRight: "16px" }}
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
								<img src={logo} style={{ padding: "5px" }} />
							</a>
						</Grid>

						<Grid container item justify='center' className={classes.infoBox}>
							<Chart data={userCommits(commits)} width={150} height={175}>
								<ValueAxis />
								<ArgumentAxis />
								<BarSeries valueField='count' argumentField='user' />
							</Chart>
						</Grid>
					</Grid>
					<Grid container direction='column' item xs={9}  justify='center' style={{ marginLeft: "16px" }}>
					<Grid item style={{textAlign: 'center', paddingBottom: '16px'}}>
								<strong>Commits graph</strong>
								<br/>
					</Grid>
					<br/>
						<Grid container justify = 'center' item>
							<Paper>
								<Chart data={commitHistory(commits)} width={900} height={500}>
									<ValueAxis />
									<ArgumentAxis />
									<SplineSeries valueField='count' argumentField='date' />
								</Chart>
							</Paper>
						</Grid>
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
	} else return (
		<Grid container direction = 'row' justify = 'center' alignItems = 'center'>
			<CircularProgress size={120} />
		</Grid>
	)
};
export default ProjectDetails;
