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
import SwapVertIcon from '@material-ui/icons/SwapVert';
import IconButton from '@material-ui/core/IconButton';
import RefreshIcon from '@material-ui/icons/Refresh';

const styles = theme => ({
    content: {
        textAlign: 'center',
    },
    refresh: {
        position: 'absolute',
        right: theme.spacing.unit,
        top: theme.spacing.unit,
    },
});

class SelectNetworkDialog extends React.Component {
    handleClose = () => {
        this.props.onClose();
    };

    render() {
        const { classes, open, connections, onClickItem, updateConnectionList } = this.props;

        return (
            <Dialog
                fullWidth={true}
                maxWidth={'xs'}
                onClose={this.handleClose}
                open={open}
            >
                <DialogTitle id="dialog-title">
                    <Typography color="inherit">
                        Select network interface
                    </Typography>
                    <IconButton className={classes.refresh} onClick={updateConnectionList}>
                        <RefreshIcon />
                    </IconButton>
                </DialogTitle>
                <Divider />
                <DialogContent className={classes.content}>
                    {connections === undefined || connections.length === 0 ?
                        <Typography align={'center'} color="inherit" className={classes.title}>
                            No connections. Please establish connection and refresh.
                        </Typography>
                        :
                        <List dense={true}>
                            {connections.map((connection, index) => (
                                <ListItem button key={index} onClick={onClickItem(connection)}>
                                    <ListItemAvatar>
                                        <Avatar>
                                            <SwapVertIcon />
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
                </DialogContent>
            </Dialog>
        );
    }
}

SelectNetworkDialog.propTypes = {
    classes: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    connections: PropTypes.array.isRequired,
    onClickItem: PropTypes.func.isRequired,
    updateConnectionList: PropTypes.func.isRequired,
};

export default withStyles(styles)(SelectNetworkDialog);
