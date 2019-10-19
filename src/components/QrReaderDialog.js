import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import QrReader from 'react-qr-reader';

const styles = theme => ({
    root: {
        textAlign: '-webkit-center',
    },
    content: {
        textAlign: 'center',
    },
    close: {
        position: 'absolute',
        right: theme.spacing.unit,
        top: theme.spacing.unit,
    },
});

class QrReaderDialog extends React.Component {
    render() {
        const { classes, open, onClose, onScan, onError } = this.props;
        return (
            <Dialog
                fullScreen
                onClose={onClose}
                open={open}
            >
                <DialogTitle id="dialog-title">
                    <Typography color="inherit">
                        Scan QR code
                    </Typography>
                    <IconButton className={classes.close} onClick={onClose}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <Divider />
                <DialogContent className={classes.content}>
                    <div className={classes.root}>
                        <QrReader
                            delay={300}
                            onError={onError}
                            onScan={onScan}
                            style={{ width: '60%' }}
                        />
                    </div>
                </DialogContent>
            </Dialog>
        )
    }
}

QrReaderDialog.propTypes = {
    classes: PropTypes.object.isRequired,
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onScan: PropTypes.func.isRequired,
    onError: PropTypes.func.isRequired,
};

export default withStyles(styles)(QrReaderDialog);
