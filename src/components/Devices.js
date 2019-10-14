import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AddDeviceDialog from './AddDeviceDialog';
import DeviceList from './DeviceList';
import SnackMessage from './SnackMessage';

import db from '../config/Database';
import Snack from '../const/Snack';

import os from 'os';
import find from 'local-devices';

const styles = theme => ({
    root: {
        backgroundColor: theme.palette.background.paper,
    },
    fab: {
        position: 'fixed',
        bottom: theme.spacing.unit * 4,
        right: theme.spacing.unit * 4,
    },
    toolbar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: theme.spacing.unit * 5,
        ...theme.mixins.toolbar,
    },
});

class Devices extends React.Component {
    state = {
        openAddDeviceDialog: false,
        trustedDevices: [],
        connectedDevices: [],
        connections: [],
        openSnack: false,
        snackMsg: '',
        snackVariant: Snack.SUCCESS,
    }

    componentDidMount() {
        this.updateConnectedDeviceList();
        this.updateConnectionList();
    }

    updateTrustedDeviceList = () => {
        let devices = db.getAllDevices().value;
        this.setState({ trustedDevices: devices });
    };

    updateConnectionList = () => {
        this.setState({ connections: [] });
        let networkInterfaces = os.networkInterfaces();

        let connections = [];

        Object.keys(networkInterfaces).forEach((ifaceName, index, array) => {
            let connection = {};
            let alias = 0;
            networkInterfaces[ifaceName].forEach((iface, index, array) => {

                if (iface.internal !== false) {
                    return;
                }

                if (alias === 0) {
                    connection.ip = iface.address;
                    connection.name = ifaceName;
                    connection.mac = iface.mac;
                } else {
                    connection.ip = connection.ip + ", " + iface.address
                }
                alias++;
            });
            if (!(Object.keys(connection).length === 0 && connection.constructor === Object)) {
                connections.push(connection)
            }
        });

        if (connections.length === 0) {
            this.handleSnackOpen('No connections.', Snack.INFO);
        } else {
            this.setState({ connections }, () => {
                this.handleSnackOpen('Succesfully refreshed.', Snack.SUCCESS);
            });
        }
    };

    updateConnectedDeviceList = () => {
        this.setState({ connectedDevices: [] });
        find().then(devices => {
            this.setState({ connectedDevices: devices });
            if (devices.length === 0) {
                this.handleSnackOpen('No connected devices.', Snack.INFO);
            } else {
                this.handleSnackOpen('Succesfully refreshed.', Snack.SUCCESS);
            }
        }).catch((err) => {
            this.handleSnackOpen('Something went wrong.', Snack.ERROR);
        });
    };

    handleOpenAddDeviceDialog = () => {
        this.setState({ openAddDeviceDialog: true });
    };

    handleCloseAddDeviceDialog = () => {
        this.setState({ openAddDeviceDialog: false });
        this.updateTrustedDeviceList();
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

    render() {
        const { classes, active } = this.props;
        const { openSnack, snackVariant, snackMsg } = this.state;
        let display = active ? 'block' : 'none';
        return (
            <div style={{ display }} className={classes.root}>
                <DeviceList
                    trustedDevices={this.state.trustedDevices}
                    connectedDevices={this.state.connectedDevices}
                    connections={this.state.connections}
                    updateTrustedDeviceList={this.updateTrustedDeviceList}
                    updateConnectedDeviceList={this.updateConnectedDeviceList}
                    updateConnectionList={this.updateConnectionList}
                    onAddDevice={this.handleOpenAddDeviceDialog}
                />
                <AddDeviceDialog
                    title="Add trusted device"
                    open={this.state.openAddDeviceDialog}
                    onClose={this.handleCloseAddDeviceDialog}
                />
                <SnackMessage
                    open={openSnack}
                    onClose={this.handleSnackClose}
                    variant={snackVariant}
                    message={snackMsg}
                />
                <div className={classes.toolbar} />
            </div>
        );
    }
}

Devices.propTypes = {
    active: PropTypes.bool.isRequired,
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Devices);
