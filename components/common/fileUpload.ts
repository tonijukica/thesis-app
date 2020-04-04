import Papa from 'papaparse';
import { Student } from '../../interfaces';

function parseInput(input: string) {
	const result = Papa.parse(input, { header: true, skipEmptyLines: true });
	return result.data;
}

function prepareInputData(data: any) {
	return data.map((rawProject: any) => {
		const rawStudents = rawProject[process.env.PROJECT_STUDENTS!].split(', ');
		const rawStudentUsernames = rawProject[process.env.STUDENTS_USERNAMES!].split(', ');
		const students: Student[] = [];
		for (let i = 0; i < rawStudents.length; i++) {
			const student: Student = {
				name: rawStudents[i],
				github_username: rawStudentUsernames[i],
			};
			students.push(student);
		}
		const project = {
			name: rawProject[process.env.PROJECT_NAME!],
			github_url: rawProject[process.env.PROJECT_URL!],
			student_data: students,
		};
		return project;
	});
}

function prepareLegacyInputData(data: any) {
	let projects: any = [];
	data.map((el: any) => {
		const project = data.filter((pro: any) => pro['Projekt ID'] == el['Projekt ID']);
		const name = el['GitHub Repo'].split('/')[4];
		const validProject = {
			name,
			github_url: el['GitHub Repo'],
			prod_url: el['Production link'],
			student_data: project.map((el: any) => {
				const key = 'Prezime i ime';
				const studentName = el[key];
				return {
					name: studentName,
				};
			}),
		};

		const exists = projects.find((el: any) => el.name === validProject.name);
		if(!exists) 
			projects.push(validProject);
	});
	return projects;
}
function readFile(fileName: Blob) {
	return new Promise((resolve, reject) => {
		let reader = new FileReader();
		reader.onloadend = () => {
			resolve(reader.result);
		};
		reader.onerror = reject;
		reader.readAsText(fileName);
	});
}

async function getFileContent(fileName: Blob) {
	const rawFileData: any = await readFile(fileName);
	const legacyMode = process.env.LEGACY;
	const legacy = legacyMode === 'true' ? true : false;
	let fileData;
	if(legacy) 
		fileData = prepareLegacyInputData(parseInput(rawFileData));
	else
		fileData = prepareInputData(parseInput(rawFileData));
	return fileData;
}

export { getFileContent };
