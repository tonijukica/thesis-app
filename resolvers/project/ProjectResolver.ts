import { Resolver, Query, Arg, Mutation, Authorized } from 'type-graphql';
import { Project } from '../../entities/Project';
import { StudentInput } from '../inputs';
import { Course } from '../../entities/Course';
import { Student } from '../../entities/Student';
import { ProjectInput } from '../inputs/Project';
import { projectsProd } from '../../types/projectsProd';

@Resolver()
export class ProjectResolver {
  @Authorized()
  @Query(() => [Project])
  async projects(
    @Arg('id', { nullable: true }) id: number
  ): Promise<Project[]> {
    if (id) {
      const projects = await Project.find({ id });
      return Promise.all(
        projects.map(async (project) => {
          project.prod_preview_count = (
            await project.production_previews
          ).length;
          return project;
        })
      );
    } else {
      const projects = await Project.find();
      return Promise.all(
        projects.map(async (project) => {
          project.prod_preview_count = (
            await project.production_previews
          ).length;
          return project;
        })
      );
    }
  }

  @Query(() => [projectsProd])
  async projects_prod(
    @Arg('id', { nullable: true }) id: number
  ): Promise<projectsProd[]> {
    if (id) return Project.find({ id });
    else return Project.find();
  }

  @Authorized()
  @Mutation(() => Project)
  async insert_project(
    @Arg('course_id') courseId: number,
    @Arg('name') name: string,
    @Arg('github_url') githubUrl: string,
    @Arg('prod_url', { nullable: true }) prodUrl: string,
    @Arg('students', () => [StudentInput], { nullable: true })
    students: StudentInput[]
  ): Promise<Project> {
    const course = await Course.findOne({ id: courseId });
    const project = await Project.create({
      name,
      github_url: githubUrl,
      prod_url: prodUrl,
    });
    if (!students) {
      await project.save();
    } else {
      const newStudents = await Promise.all(
        students.map(async (student) => {
          return Student.create(student).save();
        })
      );
      project.students = Promise.resolve(newStudents);
      await project.save();
    }
    (await course!.projects).push(project);
    await course!.save();
    return project;
  }

  @Authorized()
  @Mutation(() => [Project])
  async insert_projects(
    @Arg('course_id') courseId: number,
    @Arg('projects', () => [ProjectInput]) projects: ProjectInput[]
  ): Promise<Project[]> {
    const course = await Course.findOne({ id: courseId });
    const newProjects = await Promise.all(
      projects.map(async (projectEl) => {
        const { student_data } = projectEl;
        const project = await Project.create(projectEl);
        if (!student_data) return project.save();
        else {
          const newStudents = await Promise.all(
            student_data.map(async (student) => {
              return Student.create(student).save();
            })
          );
          project.students = Promise.resolve(newStudents);
          return project.save();
        }
      })
    );
    await Promise.all(
      newProjects.map(async (project) => {
        return (await course!.projects).push(project);
      })
    );
    await course!.save();
    return newProjects;
  }

  @Authorized()
  @Mutation(() => String)
  async delete_project(@Arg('id') id: number) {
    await Project.delete(id);
    return `Project with ID ${id} was deleted`;
  }

  @Authorized()
  @Mutation(() => Project)
  async update_project(
    @Arg('id') id: number,
    @Arg('name') name: string,
    @Arg('github_url') githubUrl: string,
    @Arg('prod_url', { nullable: true }) prodUrl: string,
    @Arg('students', () => [StudentInput], { nullable: true })
    students: StudentInput[]
  ): Promise<Project | string> {
    try {
      const project = await Project.findOneOrFail({ id });
      project.name = name;
      project.github_url = githubUrl;
      project.prod_url = prodUrl;
      (await project.students).forEach((student: Student) => {
        student.remove();
      });
      const newStudents = await Promise.all(
        students.map(async (student) => {
          return Student.create(student).save();
        })
      );
      project.students = Promise.resolve(newStudents);
      return project.save();
    } catch (err) {
      return Promise.reject(new Error('No project found'));
    }
  }

  @Authorized()
  @Mutation(() => Project)
  async grade_project(
    @Arg('id') id: number,
    @Arg('grade') grade: number
  ): Promise<Project | string> {
    try {
      const project = await Project.findOneOrFail({ id });
      project.grade = grade;
      return project.save();
    } catch (err) {
      return Promise.reject(new Error('No project found'));
    }
  }

  @Authorized()
  @Mutation(() => Project)
  async ungrade_project(@Arg('id') id: number): Promise<Project | string> {
    try {
      const project = await Project.findOneOrFail({ id });
      project.grade = Number(null);
      return project.save();
    } catch (err) {
      return Promise.reject(new Error('No project found'));
    }
  }
}
