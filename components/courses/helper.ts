import { createContext } from 'react';
import Papa from 'papaparse';
import { Student } from '../../interfaces';

interface Course {
    name: string,
    courseId: number,
    studentProjects: number
}
interface ActionType {
    type: 'add' | 'remove',
    course: Course,

}
type Dispatch = (action: ActionType) => void;

interface Context {
    dispatch: Dispatch,
    courses: Course[]
}
const Context = createContext<Context | undefined>(undefined);
function coursesReducer(courses: Course[], action: ActionType) {
    switch(action.type) {
        case 'add': {
            const newCourses = [ ...courses];
            newCourses.push(action.course);
            return newCourses;
        }
        case 'remove': { 
            const newCourses = courses.filter(el => el.name !== action.course.name)
            return newCourses;
        }
    }
}

function parseInput(input: string) {
    const result = Papa.parse(input, {header: true, skipEmptyLines: true })
    return result.data;
}
function prepareInputData(data: any) {
    const inputData = data.map((rawProject: any) => {
        const rawStudents = rawProject.Studenti.split(', ');
        const rawStudentUsernames = rawProject.Usernames.split(', ');
        const students: Student[] = []
        for(let i=0; i < rawStudents.length; i++) {
            const student: Student = {
                name: rawStudents[i],
                github_username: rawStudentUsernames[i]
            }
            students.push(student);
        }
        const project = {
            name: rawProject.Name,
            github_url: rawProject.GitHubURL,
            students
        };
        return project;
    });
    return inputData;

}
export  {coursesReducer, Context, parseInput, prepareInputData};