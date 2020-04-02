import { Resolver, Query, Arg, Mutation } from 'type-graphql';
import { Project } from '../../entities/Project';
import { StudentInput } from '../inputs';
import { Course } from '../../entities/Course';
import { Student } from '../../entities/Student';

@Resolver()
export class ProjectResolver {

  @Query(() => [Project])
  async projects(
    @Arg('id', { nullable: true }) id: number
  ) {
    if(id)
      return await Project.find({ id });
    else
      return await Project.find();
  }

  @Mutation(() => Project)
  async insert_project(
    @Arg('course_id') courseId: number,
    @Arg('name') name: string,
    @Arg('github_url') githubUrl: string,
    @Arg('prod_url') prodUrl: string,
    @Arg('students', () => [StudentInput], { nullable: true }) students: StudentInput[]
  ){
    const course = await Course.findOne({ id: courseId });
    const project = await Project.create({
      name,
      github_url: githubUrl,
      prod_url: prodUrl,
    });
    if(!students){
      await project.save();
    }
    else{ 
      const newStudents = await Promise.all(students.map(async(student) =>{
        return await Student.create(student).save();
      }));
      project.students = Promise.resolve(newStudents);
      await project.save();
    }
    (await course!.projects).push(project);
    await course!.save();
    return project;
  }

  @Mutation(() => String)
  async delete_project(
    @Arg('id') id: number
  ){
    await Project.delete(id);
    return `Project with ID ${id} was deleted`;
  }
}