import { Resolver, Query } from 'type-graphql';
import { Project } from '../../entities/Project';

@Resolver()
export class ProjectResolver {
  @Query(() => [Project])
  async projects() {
    return Project.find();
  }
}