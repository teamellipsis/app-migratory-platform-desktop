import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import Typography from '@material-ui/core/Typography';
import SendIcon from '@material-ui/icons/Send';
import ReceiveIcon from '@material-ui/icons/GetApp';
import QrCodeDialog from './QrCodeDialog';
import SelectNetworkDialog from './SelectNetworkDialog';
import ReceiveAppDialog from './ReceiveAppDialog';
import _ from 'lodash';

import Intent from '../const/Intent';
import appManager from '../config/AppManager';
import Snack from '../const/Snack';
import encoder from '../config/Encoder';

import os from 'os';

const styles = theme => ({
    root: {
        backgroundColor: theme.palette.background.paper,
        textAlign: 'center',
    },
    fab: {
        width: theme.spacing.unit * 20,
        height: theme.spacing.unit * 20,
        margin: theme.spacing.unit * 2,
    },
    container: {
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
    },
});

class Sharing extends React.Component {
    state = {
        qrCode: '',
        openQrCodeDialog: false,
        openSelectNetworkDialog: false,
        appName: null,
        connections: [],
        server: null,
        openReceiveAppDialog: false,
    };

    componentDidUpdate(prevProps, prevState) {
        const { intent } = this.props;
        if (intent !== null && !_.isEqual(intent, prevProps.intent)) {
            if (intent.action === Intent.ACTION_EXECUTE) {
                this[intent.func](intent.args);
            }
        }
    }

    updateConnectionList = () => {
        this.setState({ connections: [] });
        let networkInterfaces = os.networkInterfaces();
        Object.keys(networkInterfaces).forEach((ifaceName, index, array) => {
            let connection = {};
            let alias = 0;
            networkInterfaces[ifaceName].forEach((iface, index, array) => {

                if (iface.family !== 'IPv4' || iface.internal) {
                    return;
                }

                if (alias === 0) {
                    connection.ip = iface.address;
                    connection.name = ifaceName;
                    connection.mac = iface.mac;
                }
                alias++;
            });
            if (!(Object.keys(connection).length === 0 && connection.constructor === Object)) {
                this.setState((state) => {
                    let connections = state.connections;
                    connections.push(connection);
                    return { connections };
                });
            }
        });
    };

    handleCloseQrCodeDialog = () => {
        this.setState({
            openQrCodeDialog: false,
        });
    };

    handleCloseSelectNetworkDialog = () => {
        this.setState({
            openSelectNetworkDialog: false,
        });
    };

    handleSendApp = ({ appName }) => {
        this.handleOpenLoadingDialog();
        appManager.sendAppInit(appName).then((server) => {
            this.updateConnectionList();
            this.setState({
                openSelectNetworkDialog: true,
                server,
                appName,
            });
            this.handleCloseLoadingDialog();
            this.handleSendAppFinish(appName);
        }).catch(() => {
            this.handleSnackOpen(`Failed to establish app sending. Please try again.`, Snack.ERROR);
            this.handleCloseLoadingDialog();
        });
    };

    handleSendAppFinish = (appName) => {
        appManager.sendAppSendListen(appName).then(() => {
            this.handleSnackOpen(`App successfully send.`, Snack.SUCCESS);
            appManager.sendAppEnd(this.state.appName).then(() => {
                this.handleCloseQrCodeDialog();
            }).catch(() => {
                this.handleSnackOpen(`Failed to finalize app sending.`, Snack.ERROR);
            });
        }).catch(() => { });
    };

    handleOnSelectNetworkInterface = connection => () => {
        const qrCode = encoder.encodeIpv4(connection.ip, this.state.server.port);
        this.setState({
            qrCode,
            openQrCodeDialog: true,
        });
        this.handleCloseSelectNetworkDialog();
    };

    handleSnackOpen = (msg, variant) => {
        this.props.snackOpen(msg, variant);
    };

    handleSnackClose = () => {
        this.props.snackClose();
    };

    handleClickSendApp = () => { };

    handleClickReceiveApp = () => {
        this.setState({ openReceiveAppDialog: true });
    };

    handleOpenLoadingDialog = () => {
        this.props.loadingOpen("Processing...");
    };

    handleCloseLoadingDialog = () => {
        this.props.loadingClose();
    };

    handleCloseReceiveAppDialog = () => {
        this.setState({ openReceiveAppDialog: false });
    };

    render() {
        const { classes, active, changeWindow, snackOpen, snackClose } = this.props;
        let display = active ? 'block' : 'none';
        return (
            <div style={{ display }} className={classes.root}>
                <div className={classes.container}>
                    <Fab
                        className={classes.fab}
                        onClick={this.handleClickSendApp}>
                        <div>
                            <SendIcon fontSize="large" />
                            <Typography align={'center'} color="inherit">
                                Send App
                            </Typography>
                        </div>
                    </Fab>
                    <Fab
                        className={classes.fab}
                        onClick={this.handleClickReceiveApp}>
                        <div>
                            <ReceiveIcon fontSize="large" />
                            <Typography align={'center'} color="inherit">
                                Receive App
                            </Typography>
                        </div>
                    </Fab>
                </div>
                <QrCodeDialog
                    open={this.state.openQrCodeDialog}
                    onClose={this.handleCloseQrCodeDialog}
                    title="Scan QR code"
                    qrCode={this.state.qrCode}
                />
                <SelectNetworkDialog
                    open={this.state.openSelectNetworkDialog}
                    onClose={this.handleCloseSelectNetworkDialog}
                    connections={this.state.connections}
                    onClickItem={this.handleOnSelectNetworkInterface}
                    updateConnectionList={this.updateConnectionList}
                />
                <ReceiveAppDialog
                    open={this.state.openReceiveAppDialog}
                    onClose={this.handleCloseReceiveAppDialog}
                    changeWindow={changeWindow}
                    snackOpen={snackOpen}
                    snackClose={snackClose}
                />
            </div>
        );
    }
}

Sharing.propTypes = {
    active: PropTypes.bool.isRequired,
    classes: PropTypes.object.isRequired,
    intent: PropTypes.object,
    changeWindow: PropTypes.func.isRequired,
    snackOpen: PropTypes.func.isRequired,
    snackClose: PropTypes.func.isRequired,
    loadingOpen: PropTypes.func.isRequired,
    loadingClose: PropTypes.func.isRequired,
};

export default withStyles(styles)(Sharing);
