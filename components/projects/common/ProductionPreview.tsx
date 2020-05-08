import { FC } from 'react';
import { ProductionPreview } from '../../../interfaces';
import { Grid } from '@material-ui/core';
import { Carousel } from '../../common/carousel/Carousel';
import { formatDate } from '../helpers';

type PreviewProps = {
	previews: ProductionPreview[];
};

export const Preview: FC<PreviewProps> = ({ previews }) => {
	return (
		<>
			<Grid container direction='row' justify='center' alignContent='center' style={{ marginTop: '32px' }}>
				<Grid container justify='center' alignContent='center' item>
					<Carousel>
						{previews!.map((preview) => {
							return (
								<div key={preview.id} style={{ textAlign: 'center' }}>
                  Snapshot taken on:
									<h2>{formatDate(preview.created_at)}</h2>
									<img height='576' width='1024' src={`data:image/png;base64,${preview.image}`} />
								</div>
							);
						})}
					</Carousel>
				</Grid>
			</Grid>
		</>
	);
};
