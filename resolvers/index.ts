import { AuthResolver } from './auth/AuthResolver';
import { CourseResolver } from './course/CourseResolver';
import { ProjectResolver } from './project/ProjectResolver';
import { StudentResolver } from './student/StudentResolver';
import { ProductionPreviewResolver } from './production_preview/ProductionPreviewResolver';
import { authChecker } from './auth/helpers';
import { buildSchema } from 'type-graphql';

export const getSchema = () =>
	buildSchema({
		resolvers: [
      AuthResolver,
      CourseResolver,
      ProjectResolver,
      StudentResolver,
      ProductionPreviewResolver
    ],
    authChecker
	});
