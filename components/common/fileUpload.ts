import Papa from 'papaparse';
import { Student } from '../../interfaces';

function parseInput(input: string) {
    const result = Papa.parse(input, {header: true, skipEmptyLines: true })
    return result.data;
}
function prepareInputData(data: any) {
    return data.map((rawProject: any) => {
        const rawStudents = rawProject[process.env.PROJECT_STUDENTS!].split(', ');
        const rawStudentUsernames = rawProject[process.env.STUDENTS_USERNAMES!].split(', ');
        const students: Student[] = []
        for(let i=0; i < rawStudents.length; i++) {
            const student: Student = {
                name: rawStudents[i],
                github_username: rawStudentUsernames[i]
            }
            students.push(student);
        }
        const project = {
            name: rawProject[process.env.PROJECT_NAME!],
            github_url: rawProject[process.env.PROJECT_URL!],
            students: {
                data: students
            }
        };
        return project;
    });
}

function readFile(fileName: Blob) {
    return new Promise((resolve, reject) => {
        let reader = new FileReader();
        reader.onloadend = () => {
            resolve(reader.result);
        }
        reader.onerror = reject;
        reader.readAsText(fileName);
    });
}

async function getFileContent(fileName: Blob) {
        const rawFileData: any = await readFile(fileName);
        const fileData = prepareInputData(parseInput(rawFileData));
        return fileData;
}

export {
    getFileContent
}