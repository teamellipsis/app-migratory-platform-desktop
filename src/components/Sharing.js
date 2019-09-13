import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import Typography from '@material-ui/core/Typography';
import SendIcon from '@material-ui/icons/Send';
import ReceiveIcon from '@material-ui/icons/GetApp';
import QrCodeDialog from './QrCodeDialog';
import SelectNetworkDialog from './SelectNetworkDialog';
import SnackMessage from './SnackMessage';
import _ from 'lodash';

import Intent from '../const/Intent';
import appManager from '../config/AppManager';
import Snack from '../const/Snack';

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
        openSnack: false,
        snackMsg: '',
        snackVariant: Snack.SUCCESS,
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
        appManager.sendAppInit(appName).then((server) => {
            this.updateConnectionList();
            this.setState({
                openSelectNetworkDialog: true,
                server,
                appName,
            });
        }).catch(() => {
            this.handleSnackOpen(`Failed to establish app sending. Please try again.`, Snack.ERROR);
        });
    };

    handleOnSelectNetworkInterface = connection => () => {
        this.setState((state) => {
            return {
                qrCode: `${connection.ip}:${state.server.port}`,
                openQrCodeDialog: true,
            };
        });
        this.handleCloseSelectNetworkDialog();
    };

    handleSnackOpen = (msg, variant) => {
        this.setState({
            openSnack: true,
            snackMsg: msg,
            snackVariant: variant,
        });
    };

    handleSnackClose = () => {
        this.setState({ openSnack: false });
    };

    handleClickSendApp = () => { };

    handleClickReceiveApp = () => { };

    render() {
        const { classes, active } = this.props;
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
                <SnackMessage
                    open={this.state.openSnack}
                    onClose={this.handleSnackClose}
                    variant={this.state.snackVariant}
                    message={this.state.snackMsg}
                />
            </div>
        );
    }
}

Sharing.propTypes = {
    active: PropTypes.bool.isRequired,
    classes: PropTypes.object.isRequired,
    intent: PropTypes.object,
};

export default withStyles(styles)(Sharing);
