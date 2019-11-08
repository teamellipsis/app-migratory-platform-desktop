import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import Dialog from '@material-ui/core/Dialog';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';

const styles = theme => ({
    content: {
        textAlign: 'center',
    },
});

class ConfirmationDialog extends React.Component {
    onYes = () => {
        this.props.onYes();
        this.props.onClose();
    };

    onNo = () => {
        this.props.onNo();
        this.props.onClose();
    };

    render() {
        const { classes, open, onClose, title, message, yes, no } = this.props;
        return (
            <Dialog
                fullWidth={true}
                maxWidth={'xs'}
                onClose={onClose}
                open={open}
            >
                {title === undefined ? null :
                    <React.Fragment>
                        <DialogTitle id="dialog-title">
                            <Typography color="inherit">
                                {title}
                            </Typography>
                        </DialogTitle>
                        <Divider />
                    </React.Fragment>
                }
                {message === undefined ? null :
                    <DialogContent className={classes.content}>
                        <Typography color="inherit">
                            {message}
                        </Typography>
                    </DialogContent>
                }
                <DialogActions>
                    <Button onClick={this.onNo} color="primary">
                        {no === undefined ? "No" : no}
                    </Button>
                    <Button onClick={this.onYes} color="primary">
                        {yes === undefined ? "Yes" : yes}
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

ConfirmationDialog.propTypes = {
    classes: PropTypes.object.isRequired,
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onYes: PropTypes.func.isRequired,
    onNo: PropTypes.func.isRequired,
    title: PropTypes.string,
    message: PropTypes.string,
    yes: PropTypes.string,
    no: PropTypes.string,
};

export default withStyles(styles)(ConfirmationDialog);
