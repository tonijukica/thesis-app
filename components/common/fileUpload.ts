import Papa from 'papaparse';
import { Student } from '../../interfaces';

function parseInput(input: string) {
    const result = Papa.parse(input, {header: true, skipEmptyLines: true })
    return result.data;
}
function prepareInputData(data: any) {
    return data.map((rawProject: any) => {
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