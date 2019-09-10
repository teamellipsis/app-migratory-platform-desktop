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
import FolderIcon from '@material-ui/icons/Folder';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import Divider from '@material-ui/core/Divider';
import AddDeviceDialog from './AddDeviceDialog';

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
});

class DeviceList extends React.Component {
    state = {
        openAddDeviceDialog: false,
        selectedDeviceId: null,
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
        });
        this.handleOpenAddDeviceDialog();
    };

    handleOpenAddDeviceDialog = () => {
        this.setState({ openAddDeviceDialog: true });
    };

    handleCloseAddDeviceDialog = () => {
        this.setState({ openAddDeviceDialog: false });
        this.props.updateTrustedDeviceList();
    };

    render() {
        const { classes, trustedDevices, connectedDevices } = this.props;

        return (
            <div className={classes.root}>
                <AddDeviceDialog
                    title="Update trusted device"
                    deviceId={this.state.selectedDeviceId}
                    open={this.state.openAddDeviceDialog}
                    onClose={this.handleCloseAddDeviceDialog}
                />
                <Grid container spacing={16}>
                    <Grid item xs={12}>
                        <div className={classes.content}>
                            <Typography color="inherit" noWrap>
                                Trusted devices
                            </Typography>
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
                                                    <FolderIcon />
                                                </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={device.name}
                                                secondary={device.mac}
                                            />
                                            <ListItemSecondaryAction>
                                                <IconButton aria-label="Delete" onClick={this.handleEdit(device.id)}>
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
                            <Typography color="inherit" noWrap>
                                Connections
                            </Typography>
                            <Divider />
                            {connectedDevices === undefined || connectedDevices.length === 0 ?
                                <Typography align={'center'} color="inherit" noWrap className={classes.title}>
                                    No connections.
                                </Typography>
                                :
                                <List dense={true}>
                                    {connectedDevices.map((device, index) => (
                                        <ListItem button key={index}>
                                            <ListItemAvatar>
                                                <Avatar>
                                                    <FolderIcon />
                                                </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={device.name + " (" + device.ip + ")"}
                                                secondary={device.mac}
                                            />
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
    updateTrustedDeviceList: PropTypes.func.isRequired,
};

export default withStyles(styles)(DeviceList);
