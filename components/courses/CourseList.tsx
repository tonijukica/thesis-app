import { FunctionComponent, useReducer, useEffect } from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { Grid } from '@material-ui/core';
import { useQuery } from '@apollo/react-hooks';
import { Context, coursesReducer } from './helper';
import CourseBox from './CourseBox';
import CourseDialog from './dialogs/CourseDialog';
import ListHeader from './common/ListHeader';
import { GET_COURSES } from '../../gql/queries/courses';
import { Loader } from '../common/CircuralLoader';

type CourseProps = {
  title: string;
};

const Courses: FunctionComponent<CourseProps> = ({ title }) => {
  const { data, loading } = useQuery(GET_COURSES);
  const [state, dispatch] = useReducer(coursesReducer, {
    courses: [],
    dialogAdd: false,
    delete: false,
  });

  useEffect(() => {
    if (data) {
      data.courses.forEach((course: any) =>
        dispatch({
          type: 'add',
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
        <ListHeader title={title} />
        <CourseDialog />
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
