import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import Dialog from '@material-ui/core/Dialog';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import TrustedDeviceIcon from '@material-ui/icons/ImportantDevices'

import db from '../config/Database';

const styles = theme => ({
    content: {
        textAlign: 'center',
    },
    title: {
        margin: `${theme.spacing.unit * 2}px 0 0`,
    },
});

class TrustedDeviceDialog extends React.Component {
    state = {
        trustedDevices: [],
    }
    done = false;

    componentDidUpdate() {
        if (this.props.open === true && !this.done) {
            this.done = true;
            this.updateTrustedDeviceList();
        }
    }

    handleClose = () => {
        this.done = false;
        this.props.onClose();
    };

    updateTrustedDeviceList = () => {
        let devices = db.getAllDevices().value;
        this.setState({ trustedDevices: devices });
    };

    handleOnClickDevice = (device) => () => {
        this.props.onDeviceClick(device);
    };

    render() {
        const { classes, open } = this.props;
        const { trustedDevices } = this.state;
        return (
            <Dialog
                fullWidth={true}
                maxWidth={'xs'}
                onClose={this.handleClose}
                open={open}
            >
                <DialogTitle id="dialog-title">
                    <Typography color="inherit">
                        Select a trusted device
                    </Typography>
                </DialogTitle>
                <Divider />
                <DialogContent className={classes.content}>
                    {trustedDevices === undefined || trustedDevices.length === 0 ?
                        <Typography align={'center'} color="inherit" noWrap className={classes.title}>
                            No trusted devices. Add new device.
                        </Typography>
                        :
                        <List dense={true}>
                            {trustedDevices.map((device, index) => (
                                <ListItem button key={index} onClick={this.handleOnClickDevice(device)}>
                                    <ListItemAvatar>
                                        <Avatar>
                                            <TrustedDeviceIcon />
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={device.name}
                                        secondary={device.mac}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    }
                </DialogContent>
            </Dialog>
        );
    }
}

TrustedDeviceDialog.propTypes = {
    classes: PropTypes.object.isRequired,
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onDeviceClick: PropTypes.func.isRequired,
};

export default withStyles(styles)(TrustedDeviceDialog);
