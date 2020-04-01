import { Resolver, Query } from 'type-graphql';
import { ProductionPreview } from '../../entities/ProductionPreview';

@Resolver()
export class ProductionPreviewResolver {
  @Query(() => [ProductionPreview])
  async production_previews() {
    return ProductionPreview.find();
  }
}