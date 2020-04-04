import { Resolver, Query, Arg, Mutation } from 'type-graphql';
import { Project } from '../../entities/Project';
import { Student } from '../../entities/Student';

@Resolver()
export class StudentResolver {

  @Query(() => [Project])
  async students(
    @Arg('id', { nullable: true }) id: number
  ) {
    if(id)
      return await Student.find({ id });
    else
      return await Student.find();
  }

  @Mutation(() => Student)
  async insert_student(
    @Arg('project_id') projectId: number,
    @Arg('name') name: string,
    @Arg('github_username') githubUsername: string,
  ){
    const project = await Project.findOne({ id: projectId });
    const student = await Student.create({
      name,
      github_username: githubUsername
    }).save();
    (await project!.students).push(student);
    await project!.save();
    return student;
  }

  @Mutation(() => String)
  async delete_student(
    @Arg('id') id: number
  ){
    await Student.delete(id);
    return `Student with ID ${id} was deleted`;
  }
}