import { CourseResolver } from './course/CourseResolver';
import { ProjectResolver } from './project/ProjectResolver';
import { StudentResolver } from './student/StudentResolver';
import { ProductionPreviewResolver } from './production_preview/ProductionPreviewResolver';
import { buildSchema } from 'type-graphql';

export const getSchema = () => buildSchema({
    resolvers: [
      CourseResolver,
      ProjectResolver,
      StudentResolver,
      ProductionPreviewResolver
    ]
  });