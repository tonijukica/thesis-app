import { Resolver, Query } from 'type-graphql';
import { Student } from '../../entities/Student';

@Resolver()
export class StudentResolver {
  @Query(() => [Student])
  async Students() {
    return Student.find();
  }
}