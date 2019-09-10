import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import db from '../config/Database';

class AddDeviceDialog extends React.Component {
    state = {
        deviceName: "",
        deviceMac: "",
        prevDeviceId: null,
    };

    static getDerivedStateFromProps(props, state) {
        if (props.deviceId !== undefined && props.deviceId !== state.prevDeviceId) {
            const { name, mac } = db.getDeviceById(props.deviceId).value
            return {
                deviceName: name,
                deviceMac: mac,
                prevDeviceId: props.deviceId,
            };
        }
        return null;
    }

    handleClose = () => {
        this.props.onClose();
        this.setState({
            deviceName: "",
            deviceMac: "",
        });
    };

    handleSave = () => {
        if (this.props.deviceId) {
            db.updateDeviceById(this.props.deviceId, this.state.deviceName, this.state.deviceMac);
        } else {
            db.addNewDevice(this.state.deviceName, this.state.deviceMac);
        }
        this.handleClose();
    };

    handleChange = name => event => {
        this.setState({
            [name]: event.target.value,
        });
    };

    render() {
        return (
            <Dialog
                open={this.props.open}
                onClose={this.handleClose}
                aria-labelledby="dialog-title"
            >
                <DialogTitle id="dialog-title">{this.props.title}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Use device name as your preference.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Device name"
                        type="email"
                        fullWidth
                        value={this.state.deviceName}
                        onChange={this.handleChange('deviceName')}
                    />
                    <TextField
                        margin="dense"
                        id="name"
                        label="MAC address"
                        type="email"
                        fullWidth
                        value={this.state.deviceMac}
                        onChange={this.handleChange('deviceMac')}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={this.handleSave} color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

AddDeviceDialog.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    title: PropTypes.string.isRequired,
    deviceId: PropTypes.number,
};

export default AddDeviceDialog;
