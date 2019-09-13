import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import Dialog from '@material-ui/core/Dialog';
import Divider from '@material-ui/core/Divider';
import QRCode from 'qrcode.react';

const styles = {
    content: {
        textAlign: 'center',
    },
};

class QrCodeDialog extends React.Component {
    handleClose = () => {
        this.props.onClose();
    };

    render() {
        const { classes, open, title, qrCode } = this.props;

        return (
            <Dialog
                fullWidth={true}
                maxWidth={'xs'}
                onClose={this.handleClose}
                open={open}
            >
                <DialogTitle id="dialog-title">{title}</DialogTitle>
                <Divider />
                <DialogContent className={classes.content}>
                    <QRCode value={qrCode} includeMargin={true} size={256}/>
                </DialogContent>
            </Dialog>
        );
    }
}

QrCodeDialog.propTypes = {
    classes: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    title: PropTypes.string.isRequired,
    qrCode: PropTypes.string.isRequired,
};

export default withStyles(styles)(QrCodeDialog);
