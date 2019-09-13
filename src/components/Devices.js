import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AddDeviceDialog from './AddDeviceDialog';
import DeviceList from './DeviceList';

import db from '../config/Database';

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
                this.setState((state) => {
                    let connections = state.connections;
                    connections.push(connection)
                    return { connections }
                });
            }
        });
    };

    updateConnectedDeviceList = () => {
        this.setState({ connectedDevices: [] });
        find().then(devices => {
            this.setState({ connectedDevices: devices });
        });
    };

    handleOpenAddDeviceDialog = () => {
        this.setState({ openAddDeviceDialog: true });
    };

    handleCloseAddDeviceDialog = () => {
        this.setState({ openAddDeviceDialog: false });
        this.updateTrustedDeviceList();
    };

    render() {
        const { classes, active } = this.props;
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
