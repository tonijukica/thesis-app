import { FunctionComponent, useContext } from 'react';
import { Grid, makeStyles, createStyles, Card, CardActionArea, CardContent } from '@material-ui/core';
import { Context } from './CourseList';
import DeleteIcon from '@material-ui/icons/Delete';
import { useMutation } from '@apollo/react-hooks';
import { DELETE_COURSE_BY_ID } from '../../gql/queries/courses';
import { useRouter } from 'next/router';

type CourseBoxProps = {
	name: string;
	courseId: number;
	studentProjects: number;
	deleteMode: boolean;
};

const useStyles = makeStyles(() =>
	createStyles({
		card: {
			width: '75%',
			textAlign: 'center',
			marginBottom: '8px',
			marginTop: '8px',
		},
		cardActionArea: {
			paddingTop: '16px',
			paddingBottom: '16px',
			fontSize: '1em',
		},
		deleteIcon: {
			position: 'absolute',
			top: 0,
			right: 0,
			zIndex: 1000,
		},
	})
);

const CourseBox: FunctionComponent<CourseBoxProps> = ({ name, courseId, studentProjects, deleteMode }) => {
	const classes = useStyles();
	const router = useRouter();
	const context: any = useContext(Context);
	const { dispatch } = context;
	const [deleteCourse] = useMutation(DELETE_COURSE_BY_ID);

	const handleDelete = async () => {
		await deleteCourse({
			variables: {
				courseId: Number(courseId),
			},
		});
		dispatch({ type: 'remove', course: { courseId, name, studentProjects } });
	};
	const handleRedirect = (e: any) => {
		e.preventDefault();
		router.push(`/courses/${courseId}`);
	};

	return (
		<Grid container xs={4} item justify='center'>
			<Card className={classes.card} onClick={deleteMode ? handleDelete : handleRedirect}>
				<CardActionArea className={classes.cardActionArea}>
					{deleteMode ? <DeleteIcon className={classes.deleteIcon} onClick={handleDelete} /> : null}
					<CardContent>
						<div>
							{name}
							<br />
							Projects: {studentProjects}
						</div>
					</CardContent>
				</CardActionArea>
			</Card>
		</Grid>
	);
};

export default CourseBox;
