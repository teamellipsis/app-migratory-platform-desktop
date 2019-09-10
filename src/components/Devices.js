import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import AddDeviceDialog from './AddDeviceDialog';
import DeviceList from './DeviceList';

import db from '../config/Database';

import os from 'os';

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
    }

    componentDidMount() {
        this.updateConnectedDeviceList();
    }

    updateTrustedDeviceList = () => {
        let devices = db.getAllDevices().value;
        this.setState({ trustedDevices: devices });
    };

    updateConnectedDeviceList = () => {
        this.setState({ connectedDevices: [] });
        let networkInterfaces = os.networkInterfaces();
        Object.keys(networkInterfaces).forEach((ifaceName, index, array) => {
            let device = {};
            let alias = 0;
            networkInterfaces[ifaceName].forEach((iface, index, array) => {
                
                if (iface.internal !== false) {
                    return;
                }

                if (alias === 0) {
                    device.ip = iface.address;
                    device.name = ifaceName;
                    device.mac = iface.mac;
                } else {
                    device.ip = device.ip + ", " + iface.address
                }
                alias++;
            });
            if (!(Object.keys(device).length === 0 && device.constructor === Object)) {
                this.setState((state) => {
                    let connectedDevices = state.connectedDevices;
                    connectedDevices.push(device)
                    return { connectedDevices }
                });
            }
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
                    updateTrustedDeviceList={this.updateTrustedDeviceList}
                />
                <Fab
                    color="secondary"
                    className={classes.fab}
                    onClick={this.handleOpenAddDeviceDialog}>
                    <AddIcon />
                </Fab>
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
