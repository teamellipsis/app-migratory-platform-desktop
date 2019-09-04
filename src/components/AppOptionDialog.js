import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import Dialog from '@material-ui/core/Dialog';
import Divider from '@material-ui/core/Divider';

const options = ['Open', 'Package', 'Send', 'Reset', 'Delete'];
const styles = {};

class AppOptionDialog extends React.Component {
    handleClose = () => {
        this.props.onClose();
    };

    handleListItemClick = (option) => () => {
        let func = `handle${option}`;
        this.props[func]();
        this.props.onClose();
    };

    render() {
        const { open, title } = this.props;

        return (
            <Dialog
                fullWidth={true}
                maxWidth={'xs'}
                onClose={this.handleClose}
                open={open}
            >
                <DialogTitle id="dialog-title">{title}</DialogTitle>
                <Divider />
                <DialogContent>
                    <div>
                        <List>
                            {options.map((option, index) => (
                                <ListItem
                                    button
                                    key={option}
                                    onClick={this.handleListItemClick(option)}
                                >
                                    <ListItemText primary={option} />
                                </ListItem>
                            ))}
                        </List>
                    </div>
                </DialogContent>
            </Dialog>
        );
    }
}

AppOptionDialog.propTypes = {
    classes: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    title: PropTypes.string.isRequired,
    handleOpen: PropTypes.func.isRequired,
    handlePackage: PropTypes.func.isRequired,
    handleSend: PropTypes.func.isRequired,
    handleReset: PropTypes.func.isRequired,
    handleDelete: PropTypes.func.isRequired,
};

export default withStyles(styles)(AppOptionDialog);
