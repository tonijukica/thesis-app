import { FunctionComponent, useState, useEffect } from "react";
import { Grid } from "@material-ui/core";
import classNames from "classnames";
import { useStyles } from './common/styles';
import { useQuery } from "@apollo/react-hooks";
import { GET_PROJECT, GET_COMMITS } from "../../gql/queries/projects";
import { Commit, Project } from "../../interfaces";
import { getUserRepoName } from "./helpers";
import { Sidebar } from './common/Sidebar';
import { CommitGraph } from './common/CommitGraph';
import { Preview } from './common/ProductionPreview';
import { CommitList } from './common/CommitList';
import { Loader } from '../common/CircuralLoader';

type ProjectProps = {
	projectId: number;
};

const ProjectDetails: FunctionComponent<ProjectProps> = ({ projectId }) => {
	const classes = useStyles();
	const { data } = useQuery(GET_PROJECT, { variables: { projectId } });
	const [project, setProject] = useState<Project | null>(null);
	const [commits, setCommits] = useState<Commit[] | null>(null);
	const [owner, setOwner] = useState("");
	const [creationDate, setCreationDate] = useState("");
	const [repoName, setRepoName] = useState("");

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
	}, [data, githubData, project]);
	if (project && commits) {
		return (
			<>
				<Grid container direction='row' justify='center' className={classNames(classes.details)}>
					<Sidebar project = {project} creationDate = {creationDate} commits = {commits}/>
					<CommitGraph commits = {commits} />
				</Grid>
				{ project.production_previews!.length>0 &&
					<Preview previews = {project.production_previews!} />
				}
				<CommitList commits = {commits} />
			</>
		);
	} else return (
		<Loader />
	)
};
export default ProjectDetails;
