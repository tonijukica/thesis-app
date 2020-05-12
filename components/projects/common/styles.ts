import { makeStyles, createStyles, Theme } from '@material-ui/core';

export const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		border: {
			border: '1px solid #e1e4e8 !important',
			padding: '16px',
			textAlign: 'center',
		},
		details: {
			minHeight: '600px',
		},
		projectInfo: {
      padding: '16px',
      textAlign: 'center',
      position: 'relative'
    },
    editIcon: {
      padding: '4px',
      color: 'grey',
      cursor: 'pointer',
      position: 'absolute',
			top: 0,
			right: 0,
			zIndex: 1000
    },
		commitList: {
			borderBottom: '1px solid #e1e4e8 !important',
			textAlign: 'center',
		},
		infoBox: {
			paddingTop: '8px',
    },
    cardHeader: {
      backgroundColor: theme.palette.secondary.main,
      color: 'white',
    },
    cardContent: {
      padding: '16px'
    },
    card: {
      marginTop: '16px'
    },
    expandIcon: {
      transform: 'rotate(0deg)',
      marginTop: '4px',
      color: 'white',
      transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
      }),
    },
    expandIconOpen: {
      transform: 'rotate(180deg)'
    }
	})
);
