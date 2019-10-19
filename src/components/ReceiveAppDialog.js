import React from 'react';
import PropTypes from 'prop-types';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import Dialog from '@material-ui/core/Dialog';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import LoadingDialog from './LoadingDialog';
import QrReaderDialog from './QrReaderDialog';
import TypeQrCodeDialog from './TypeQrCodeDialog';

import appManager from '../config/AppManager';
import encoder from '../config/Encoder';
import Snack from '../const/Snack';
import Window from '../const/Window';

class ReceiveAppDialog extends React.Component {
    state = {
        openQrReader: false,
        openLoadingDialog: false,
        openTypeQrDialog: false,
    }

    handleOpenQrReader = () => {
        this.setState({ openQrReader: true });
    };

    handleCloseQrReader = () => {
        this.setState({ openQrReader: false });
    };

    handleOnScanQr = (qrCode) => {
        if (qrCode !== null) {
            const decoded = encoder.decodeIpv4(qrCode);
            if (!decoded) {
                this.handleSnackOpen(`Invalid QR code.`, Snack.WARN);
                return;
            }
            this.handleCloseQrReader();
            const { ipv4, port } = decoded;
            this.initReceiveApp(ipv4, port);
        }
    };

    handleOnErrorQrReader = (error) => {
        this.handleSnackOpen(`Error occured while scanning QR code. Try again.`, Snack.ERROR);
    };

    initReceiveApp = (ipv4, port) => {
        this.handleOpenLoadingDialog();
        appManager.receiveApp(ipv4, port).then(() => {
            this.handleCloseLoadingDialog();
            this.handleSnackOpen(`App successfully received.`, Snack.SUCCESS);
            this.props.onClose();
            this.props.changeWindow(Window.APPS);
        }).catch(() => {
            this.handleCloseLoadingDialog();
            this.handleSnackOpen(`Failed to receive app. Try again.`, Snack.ERROR);
        });
    };

    handleOpenTypeQrDialog = () => {
        this.setState({ openTypeQrDialog: true });
    };

    handleCloseTypeQrDialog = () => {
        this.setState({ openTypeQrDialog: false });
    };

    handleOpenLoadingDialog = () => {
        this.setState({ openLoadingDialog: true });
    };

    handleCloseLoadingDialog = () => {
        this.setState({ openLoadingDialog: false });
    };

    handleSnackOpen = (msg, variant) => {
        this.props.snackOpen(msg, variant);
    };

    handleSnackClose = () => {
        this.props.snackClose();
    };

    render() {
        const { open, onClose } = this.props;

        return (
            <React.Fragment>
                <Dialog
                    fullWidth={true}
                    maxWidth={'xs'}
                    onClose={onClose}
                    open={open}
                >
                    <DialogTitle id="dialog-title">Receive app</DialogTitle>
                    <Divider />
                    <DialogContent>
                        <List component="nav">
                            <ListItem button onClick={this.handleOpenQrReader}>
                                <ListItemText primary="Scan QR code" />
                            </ListItem>
                            <ListItem button onClick={this.handleOpenTypeQrDialog}>
                                <ListItemText primary="Type code" />
                            </ListItem>
                        </List>
                    </DialogContent>
                </Dialog>
                <QrReaderDialog
                    open={this.state.openQrReader}
                    onClose={this.handleCloseQrReader}
                    onScan={this.handleOnScanQr}
                    onError={this.handleOnErrorQrReader}
                />
                <TypeQrCodeDialog
                    open={this.state.openTypeQrDialog}
                    onClose={this.handleCloseTypeQrDialog}
                    onClick={this.handleOnScanQr}
                />
                <LoadingDialog
                    open={this.state.openLoadingDialog}
                    onClose={this.handleCloseLoadingDialog}
                    message="Receiving..."
                />
            </React.Fragment>
        );
    }
}

ReceiveAppDialog.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    changeWindow: PropTypes.func.isRequired,
    snackOpen: PropTypes.func.isRequired,
    snackClose: PropTypes.func.isRequired,
};

export default ReceiveAppDialog;
