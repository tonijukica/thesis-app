import { FunctionComponent, useReducer, useEffect } from "react";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import {
  Grid,
  Button,
  makeStyles,
  createStyles,
  Theme,
  Collapse,
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { Context, coursesReducer } from "./helper";
import DeleteIcon from "@material-ui/icons/Delete";
import CourseBox from "./CourseBox";
import CourseDialog from "./dialogs/CourseDialog";
import { useQuery } from "@apollo/react-hooks";
import { GET_COURSES } from "../../gql/queries/courses";
import { Loader } from "../common/CircuralLoader";

type CourseProps = {
  title: string;
};
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      paddingBottom: "16px",
      borderBottom: "1px solid #e1e4e8 !important",
    },
    button: {
      marginRight: "8px",
    },
    delBtn: {
      marginRight: "8px",
      backgroundColor: theme.palette.error.main,
      color: "white",
      "&:hover": {
        backgroundColor: theme.palette.error.dark,
      },
    },
    loading: {
      padding: "32px",
    },
  })
);

const Courses: FunctionComponent<CourseProps> = ({ title }) => {
  const classes = useStyles();
  const { data, loading } = useQuery(GET_COURSES);
  const [state, dispatch] = useReducer(coursesReducer, {
    courses: [],
    dialogAdd: false,
    delete: false,
  });

  const handleClickOpen = () => {
    dispatch({ type: "dialogAddToggle" });
  };
  const handleDelete = () => {
    dispatch({ type: "deleteToggle" });
  };
  useEffect(() => {
    if (data) {
      data.courses.forEach((course: any) =>
        dispatch({
          type: "add",
          course: {
            name: course.course_name,
            courseId: course.id,
            studentProjects: course.projects_count,
          },
        })
      );
    }
  }, [data]);

  return (
    <>
      <Context.Provider value={{ state, dispatch }}>
        <Grid
          container
          direction="row"
          justify="space-around"
          alignItems="flex-start"
          className={classes.container}
        >
          <Grid item xs={4}>
            {title}
          </Grid>
          <Grid item xs={4}>
            <Collapse in={state.delete}>
              <Alert severity="error">Delete mode is enabled</Alert>
            </Collapse>
          </Grid>
          <Grid container item xs={4} justify="flex-end" alignItems="flex-end">
            <Button
              variant="contained"
              color="secondary"
              className={classes.button}
              onClick={handleClickOpen}
            >
              New
            </Button>
            <Button
              variant="contained"
              startIcon={<DeleteIcon />}
              className={classes.delBtn}
              onClick={handleDelete}
            >
              Delete
            </Button>
            <CourseDialog />
          </Grid>
        </Grid>
        <Grid container direction="row" justify="center">
          {loading && <Loader />}
          <TransitionGroup component={null}>
            {state.courses.map((course) => {
              return (
                <CSSTransition
                  key={course.courseId}
                  timeout={600}
                  classNames="custom"
                >
                  <CourseBox
                    courseId={course.courseId}
                    name={course.name}
                    studentProjects={course.studentProjects}
                  />
                </CSSTransition>
              );
            })}
          </TransitionGroup>
        </Grid>
      </Context.Provider>
    </>
  );
};

export { Courses, Context };
