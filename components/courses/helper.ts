import { createContext } from 'react';

interface Course {
	name: string;
	courseId: number;
  studentProjects: number;
}
interface ActionType {
	type: 'add' | 'remove' | 'dialogAddToggle' | 'deleteToggle';
	course?: Course;
}
type Dispatch = (action: ActionType) => void;

interface State {
  courses: Course[];
  dialogAdd: boolean;
  delete: boolean;
}
interface Context {
	dispatch: Dispatch;
	state: State
}
const Context = createContext<Context>({
  state: {
    courses: [],
    dialogAdd: false,
    delete: false
  },
  dispatch: () => null
});

function coursesReducer(state: State, action: ActionType): State {
	switch (action.type) {
		case 'add': {
			const newCourses = [...state.courses];
			newCourses.push(action.course!);
			return {
        ...state,
        courses: newCourses
      };
		}
		case 'remove': {
			const newCourses = state.courses.filter((el) => el.courseId !== action.course!.courseId);
			return {
        ...state,
        courses: newCourses
      }
    }
    case 'dialogAddToggle': {
      return {
        ...state,
        dialogAdd: !state.dialogAdd
      }
    }
    case 'deleteToggle': {
      return {
        ...state,
        delete: !state.delete
      }
    }
	}
}

export { coursesReducer, Context };
