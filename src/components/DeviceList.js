import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import Divider from '@material-ui/core/Divider';
import AddDeviceDialog from './AddDeviceDialog';
import RefreshIcon from '@material-ui/icons/Refresh';
import AddIcon from '@material-ui/icons/Add';
import TrustedDeviceIcon from '@material-ui/icons/ImportantDevices'
import DeviceIcon from '@material-ui/icons/PermDeviceInformation'
import ConnectionIcon from '@material-ui/icons/SwapHoriz'

import db from '../config/Database';

const styles = theme => ({
    root: {
        flexGrow: 1,
    },
    content: {
        backgroundColor: theme.palette.background.paper,
    },
    title: {
        margin: `${theme.spacing.unit * 4}px 0 ${theme.spacing.unit * 2}px`,
    },
    refresh: {
        textAlign: "right",
    },
    subTitle: {
        paddingTop: theme.spacing.unit * 2,
    },
});

class DeviceList extends React.Component {
    state = {
        openAddDeviceDialog: false,
        titleAddDeviceDialog: '',
        selectedDeviceId: null,
        selectedDevice: null,
    };

    componentDidMount() {
        this.props.updateTrustedDeviceList();
    }

    handleDelete = id => () => {
        db.deleteDeviceById(id);
        this.props.updateTrustedDeviceList();
    };

    handleEdit = id => () => {
        this.setState({
            selectedDeviceId: id,
            titleAddDeviceDialog: 'Update trusted device',
        });
        this.handleOpenAddDeviceDialog();
    };

    handleOpenAddDeviceDialog = () => {
        this.setState({ openAddDeviceDialog: true });
    };

    handleCloseAddDeviceDialog = () => {
        this.setState({
            openAddDeviceDialog: false,
            selectedDeviceId: null,
            selectedDevice: null,
        });
        this.props.updateTrustedDeviceList();
    };

    handleAddToTrusted = device => () => {
        this.setState({
            selectedDevice: device,
            titleAddDeviceDialog: 'Add trusted device',
        });
        this.handleOpenAddDeviceDialog();
    };

    isAlreadyInTrustedDevices = device => {
        return this.props.trustedDevices.find((trustedDevice) => {
            return trustedDevice.mac === device.mac;
        }) === undefined ? false : true;
    };

    getTrustedDeviceName = device => {
        let trustedDevice = this.props.trustedDevices.find((trustedDevice) => {
            return trustedDevice.mac === device.mac;
        });
        return trustedDevice.name;
    };

    render() {
        const { classes, trustedDevices, connectedDevices, connections, updateConnectedDeviceList, updateConnectionList, onAddDevice } = this.props;

        return (
            <div className={classes.root}>
                <AddDeviceDialog
                    title={this.state.titleAddDeviceDialog}
                    device={this.state.selectedDevice}
                    deviceId={this.state.selectedDeviceId}
                    open={this.state.openAddDeviceDialog}
                    onClose={this.handleCloseAddDeviceDialog}
                />
                <Grid container spacing={16}>
                    <Grid item xs={12}>
                        <div className={classes.content}>
                            <Grid container spacing={0}>
                                <Grid item xs={10}>
                                    <Typography color="inherit" noWrap className={classes.subTitle}>
                                        Trusted devices
                                    </Typography>
                                </Grid>
                                <Grid item xs={2} className={classes.refresh}>
                                    <IconButton onClick={onAddDevice}>
                                        <AddIcon />
                                    </IconButton>
                                </Grid>
                            </Grid>
                            <Divider />
                            {trustedDevices === undefined || trustedDevices.length === 0 ?
                                <Typography align={'center'} color="inherit" noWrap className={classes.title}>
                                    No trusted devices. Add new device.
                                </Typography>
                                :
                                <List dense={true}>
                                    {trustedDevices.map((device, index) => (
                                        <ListItem button key={index}>
                                            <ListItemAvatar>
                                                <Avatar>
                                                    <TrustedDeviceIcon />
                                                </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={device.name}
                                                secondary={device.mac}
                                            />
                                            <ListItemSecondaryAction>
                                                <IconButton aria-label="Edit" onClick={this.handleEdit(device.id)}>
                                                    <EditIcon />
                                                </IconButton>
                                                <IconButton aria-label="Delete" onClick={this.handleDelete(device.id)}>
                                                    <DeleteIcon />
                                                </IconButton>
                                            </ListItemSecondaryAction>
                                        </ListItem>
                                    ))}
                                </List>
                            }
                        </div>
                    </Grid>
                    <Grid item xs={12}>
                        <div className={classes.content}>
                            <Grid container spacing={0}>
                                <Grid item xs={10}>
                                    <Typography color="inherit" noWrap className={classes.subTitle}>
                                        Connections
                                    </Typography>
                                </Grid>
                                <Grid item xs={2} className={classes.refresh}>
                                    <IconButton onClick={updateConnectionList}>
                                        <RefreshIcon />
                                    </IconButton>
                                </Grid>
                            </Grid>
                            <Divider />
                            {connections === undefined || connections.length === 0 ?
                                <Typography align={'center'} color="inherit" noWrap className={classes.title}>
                                    No connections.
                                </Typography>
                                :
                                <List dense={true}>
                                    {connections.map((connection, index) => (
                                        <ListItem button key={index}>
                                            <ListItemAvatar>
                                                <Avatar>
                                                    <ConnectionIcon />
                                                </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={connection.name + " (" + connection.ip + ")"}
                                                secondary={connection.mac}
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                            }
                        </div>
                    </Grid>
                    <Grid item xs={12}>
                        <div className={classes.content}>
                            <Grid container spacing={0}>
                                <Grid item xs={10}>
                                    <Typography color="inherit" noWrap className={classes.subTitle}>
                                        Connected devices
                                    </Typography>
                                </Grid>
                                <Grid item xs={2} className={classes.refresh}>
                                    <IconButton onClick={updateConnectedDeviceList}>
                                        <RefreshIcon />
                                    </IconButton>
                                </Grid>
                            </Grid>
                            <Divider />
                            {connectedDevices === undefined || connectedDevices.length === 0 ?
                                <Typography align={'center'} color="inherit" noWrap className={classes.title}>
                                    No connected devices.
                                </Typography>
                                :
                                <List dense={true}>
                                    {connectedDevices.map((device, index) => (
                                        <ListItem button key={index}>
                                            {this.isAlreadyInTrustedDevices(device) ?
                                                <React.Fragment>
                                                    <ListItemAvatar>
                                                        <Avatar>
                                                            <TrustedDeviceIcon />
                                                        </Avatar>
                                                    </ListItemAvatar>
                                                    <ListItemText
                                                        primary={this.getTrustedDeviceName(device) + " '" + device.name + "' (" + device.ip + ")"}
                                                        secondary={device.mac}
                                                    />
                                                </React.Fragment>
                                                :
                                                <React.Fragment>
                                                    <ListItemAvatar>
                                                        <Avatar>
                                                            <DeviceIcon />
                                                        </Avatar>
                                                    </ListItemAvatar>
                                                    <ListItemText
                                                        primary={device.name + " (" + device.ip + ")"}
                                                        secondary={device.mac}
                                                    />
                                                    <ListItemSecondaryAction>
                                                        <IconButton aria-label="Add-to-trusted" onClick={this.handleAddToTrusted(device)}>
                                                            <TrustedDeviceIcon />
                                                        </IconButton>
                                                    </ListItemSecondaryAction>
                                                </React.Fragment>
                                            }
                                        </ListItem>
                                    ))}
                                </List>
                            }
                        </div>
                    </Grid>
                </Grid>
            </div>
        );
    }
}

DeviceList.propTypes = {
    classes: PropTypes.object.isRequired,
    trustedDevices: PropTypes.array.isRequired,
    connectedDevices: PropTypes.array.isRequired,
    connections: PropTypes.array.isRequired,
    updateTrustedDeviceList: PropTypes.func.isRequired,
    updateConnectedDeviceList: PropTypes.func.isRequired,
    updateConnectionList: PropTypes.func.isRequired,
    onAddDevice: PropTypes.func.isRequired,
};

export default withStyles(styles)(DeviceList);
