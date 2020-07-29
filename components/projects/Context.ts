import { createContext } from 'react';
import { Project } from '../../interfaces';

interface ActionType {
  type:
    | 'add'
    | 'addBulk'
    | 'remove'
    | 'set'
    | 'dialogAddToggle'
    | 'dialogBulkToggle'
    | 'deleteToggle'
    | 'standingToggle';
  project?: Project;
  projects?: Project[];
}

type Dispatch = (action: ActionType) => void;

interface Context {
  dispatch: Dispatch;
  state: State;
}

interface State {
  projects: Project[];
  dialogAdd: boolean;
  dialogBulk: boolean;
  delete: boolean;
  standing: boolean;
}

const Context = createContext<Context>({
  state: {
    projects: [],
    dialogAdd: false,
    dialogBulk: false,
    delete: false,
    standing: false,
  },
  dispatch: () => null,
});
function projectsReducer(state: State, action: ActionType): State {
  switch (action.type) {
    case 'add': {
      const newProjects = [...state.projects];
      newProjects.push(action.project!);
      return {
        ...state,
        projects: newProjects,
      };
    }
    case 'addBulk': {
      const newProjects = [...state.projects, ...action.projects!];
      return {
        ...state,
        projects: newProjects,
      };
    }
    case 'remove': {
      const newProjects = state.projects.filter(
        (el) => el.id !== action.project!.id
      );
      return {
        ...state,
        projects: newProjects,
      };
    }
    case 'set': {
      return {
        ...state,
        projects: action.projects!,
      };
    }
    case 'dialogAddToggle': {
      return {
        ...state,
        dialogAdd: !state.dialogAdd,
      };
    }
    case 'dialogBulkToggle': {
      return {
        ...state,
        dialogBulk: !state.dialogBulk,
      };
    }
    case 'deleteToggle': {
      return {
        ...state,
        delete: !state.delete,
      };
    }
    case 'standingToggle': {
      return {
        ...state,
        standing: !state.standing,
      };
    }
  }
}
export { projectsReducer, Context };
