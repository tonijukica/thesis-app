import { Resolver, Query } from 'type-graphql';
import { Course } from '../../entities/Course';

@Resolver()
export class CourseResolver {
  @Query(() => [Course])
  async courses() {
    return Course.find();
  }
}