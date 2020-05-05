import { Resolver, Query, Arg, Mutation, Authorized } from 'type-graphql';
import { Project } from '../../entities/Project';
import { ProductionPreview } from '../../entities/ProductionPreview';

@Resolver()
export class ProductionPreviewResolver {
  @Authorized()
	@Query(() => [ProductionPreview])
	async productionPreviews(@Arg('project_id') id: number): Promise<ProductionPreview[]> {
		const project = await Project.findOne({ id });
		return project!.production_previews;
	}

	@Mutation(() => ProductionPreview)
	async insert_production_preview(@Arg('project_id') id: number, @Arg('image') image: string): Promise<ProductionPreview> {
		const project = await Project.findOne({ id });
		const productionPreview = await ProductionPreview.create({
			image,
		}).save();
		(await project!.production_previews).push(productionPreview);
		await project!.save();
		return productionPreview;
	}

  @Authorized()
	@Mutation(() => String)
	async delete_production_previw(@Arg('id') id: number) {
		await ProductionPreview.delete(id);
		return `Production Preview with ID ${id} was deleted`;
	}
}
