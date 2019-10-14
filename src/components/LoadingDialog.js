import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import CircularProgress from '@material-ui/core/CircularProgress';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';

const styles = theme => ({
    container: {
        marginTop: theme.spacing.unit,
    },
    message: {
        marginTop: theme.spacing.unit,
    },
});

class LoadingDialog extends React.Component {
    handleClose = () => {
        this.props.onClose();
    };

    render() {
        const { classes, title, message } = this.props;
        return (
            <Dialog
                open={this.props.open}
                maxWidth={'xs'}
                fullWidth={true}
                onClose={this.handleClose}
                aria-labelledby="dialog-title"
                disableBackdropClick
                disableEscapeKeyDown
            >
                {title ?
                    <React.Fragment>
                        <DialogTitle id="dialog-title">{title}</DialogTitle>
                        <Divider />
                    </React.Fragment>
                    : null
                }
                <DialogContent>
                    <Grid container spacing={16} className={classes.container}>
                        <Grid item xs={3}>
                            <CircularProgress />
                        </Grid>
                        <Grid item xs={9} className={classes.message}>
                            <DialogContentText>
                                {message ? message : 'Loading...'}
                            </DialogContentText>
                        </Grid>
                    </Grid>
                </DialogContent>
            </Dialog>
        );
    }
}

LoadingDialog.propTypes = {
    classes: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    title: PropTypes.string,
    message: PropTypes.string,
};

export default withStyles(styles)(LoadingDialog);
