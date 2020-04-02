import { Resolver, Query, Mutation, Arg  } from 'type-graphql';
import { Course } from '../../entities/Course';
import { Project } from '../../entities/Project';
import { Student } from '../../entities/Student';
import { ProjectInput } from '../inputs';

@Resolver()
export class CourseResolver {

  @Query(() => [Course])
  async courses(
    @Arg('id', {nullable: true}) id: number
  ): Promise<Course[]> {
    if(id)
      return await Course.find({ id });
    else
      return Course.find();
  }

  @Mutation(() => Course)
  async insert_course(
    @Arg('name') name: string,
    @Arg('year') year: string,
    @Arg('projects', () => [ProjectInput], { nullable: true}) projects: ProjectInput[]
  ): Promise<Course> {
    const course = await Course.create({
      course_name: name,
      year
    });
    if(!projects)
      return await course.save();
    else {
      const newProjects = await Promise.all(projects.map(async(projectEl) => {
        const { data } = projectEl;
        const project = await Project.create(projectEl);
        if(!data)
          return await project.save();
        else {
          const newStudents = await Promise.all(data.map(async(student) => {
            return await Student.create(student).save();
          }));
          project.students = Promise.resolve(newStudents);
          return await project.save();
        }
      }));
      course.projects = Promise.resolve(newProjects);
      await course.save();
      return course
    }
  }

  @Mutation(() => String)
  async delete_course(
    @Arg('id') id: number
  ) {
    await Course.delete(id);
    return `Course with ID ${id} deleted`;
  }
}