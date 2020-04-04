import { Resolver, Query, Mutation, Arg } from 'type-graphql';
import { Course } from '../../entities/Course';
import { Project } from '../../entities/Project';
import { Student } from '../../entities/Student';
import { ProjectInput } from '../inputs';

@Resolver()
export class CourseResolver {
	@Query(() => [Course])
	async courses(@Arg('id', { nullable: true }) id: number): Promise<Course[]> {
		if(id){
			const courses = await Course.find({ id });
			return Promise.all(
				courses.map(async (course) => {
					course.projects_count = (await course.projects).length;
					return course;
				})
			);
		} else {
			const courses = await Course.find();
			return Promise.all(
				courses.map(async (course) => {
					course.projects_count = (await course.projects).length;
					return course;
				})
			);
		}
	}

	@Mutation(() => Course)
	async insert_course(
		@Arg('name') name: string,
		@Arg('year') year: string,
		@Arg('projects', () => [ProjectInput], { nullable: true }) projects: ProjectInput[]
	): Promise<Course> {
		const course = await Course.create({
			course_name: name,
			year,
		});
		if(!projects) 
			return await course.save();
		else {
			const newProjects = await Promise.all(
				projects.map(async (projectEl) => {
					const { student_data } = projectEl;
					const project = await Project.create(projectEl);
					if (!student_data) return await project.save();
					else {
						const newStudents = await Promise.all(
							student_data.map(async (student) => {
								return await Student.create(student).save();
							})
						);
						project.students = Promise.resolve(newStudents);
						return await project.save();
					}
				})
			);
			course.projects = Promise.resolve(newProjects);
			await course.save();
			return course;
		}
	}

	@Mutation(() => String)
	async delete_course(@Arg('id') id: number) {
		await Course.delete(id);
		return `Course with ID ${id} deleted`;
	}
}
