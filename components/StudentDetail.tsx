import { FunctionComponent } from 'react';
import { Grid, makeStyles, createStyles } from '@material-ui/core';
import classNames from 'classnames';


const useStyles = makeStyles(() => createStyles({
    border: {
        border: '1px solid #e1e4e8 !important',
        padding: '16px'
    },
    details: {
        height: '512px'
    }
  }));

const StudentDetail: FunctionComponent = ({}) => {
    const classes = useStyles();
    return(
        <>
            <Grid container direction = 'row'  justify = 'center' className = {classNames(classes.border, classes.details )} >
                <Grid container item xs = {4} className = {classes.border} >
                    DETALJI
                </Grid>
                <Grid container item xs = {6} className = {classes.border} >
                    SLIKA
                </Grid>
            </Grid>
            <Grid container direction = 'row' justify = 'center' className = {classes.border} >
                LISTA COMMITA
            </Grid>
        </>
    );
}
export default StudentDetail;