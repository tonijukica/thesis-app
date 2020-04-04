import { createContext } from 'react';

interface Course {
	name: string;
	courseId: number;
	studentProjects: number;
}
interface ActionType {
	type: 'add' | 'remove';
	course: Course;
}
type Dispatch = (action: ActionType) => void;

interface Context {
	dispatch: Dispatch;
	courses: Course[];
}
const Context = createContext<Context | undefined>(undefined);
function coursesReducer(courses: Course[], action: ActionType) {
	switch (action.type) {
		case 'add': {
			const newCourses = [...courses];
			newCourses.push(action.course);
			return newCourses;
		}
		case 'remove': {
			const newCourses = courses.filter((el) => el.courseId !== action.course.courseId);
			return newCourses;
		}
	}
}

export { coursesReducer, Context };
