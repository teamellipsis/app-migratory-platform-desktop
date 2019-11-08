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
import FolderIcon from '@material-ui/icons/Folder';

import db from '../config/Database';
import key from '../const/Key';

import fs from 'fs';
import path from 'path';

const styles = theme => ({
    content: {
        textAlign: 'center',
    },
    title: {
        margin: `${theme.spacing.unit * 2}px 0 0`,
    },
});

class AppListDialog extends React.Component {
    state = {
        apps: null,
    };

    componentDidMount() {
        let appsDir = db.get(key.APPS_DIR).value;
        if (appsDir) {
            this.updateAppList(appsDir);
            fs.watch(appsDir, (event, filename) => {
                this.updateAppList(appsDir);
            });
        }
    }

    updateAppList = (appsDir) => {
        const isDir = (file) => fs.lstatSync(path.join(appsDir, file)).isDirectory();
        fs.readdir(appsDir, (err, files) => {
            if (err === null) {
                this.setState({
                    apps: files.filter(isDir),
                });
            }
        });
    }

    handleOnClick = (app) => () => {
        this.props.onAppClick(app);
        this.props.onClose();
    };

    render() {
        const { classes, open, onClose, title } = this.props;
        const { apps } = this.state;
        return (
            <Dialog
                fullWidth={true}
                maxWidth={'xs'}
                onClose={onClose}
                open={open}
            >
                <DialogTitle id="dialog-title">
                    <Typography color="inherit">
                        {title === undefined ? "Apps" : title}
                    </Typography>
                </DialogTitle>
                <Divider />
                <DialogContent className={classes.content}>
                    {apps === null ?
                        <Typography align={'center'} color="inherit" noWrap className={classes.title}>
                            {'No apps found'}
                        </Typography>
                        :
                        <List dense={true}>
                            {apps.map((app, index) => (
                                <ListItem button key={index} onClick={this.handleOnClick(app)}>
                                    <ListItemAvatar>
                                        <Avatar>
                                            <FolderIcon />
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={app}
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

AppListDialog.propTypes = {
    classes: PropTypes.object.isRequired,
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onAppClick: PropTypes.func.isRequired,
    title: PropTypes.string,
};

export default withStyles(styles)(AppListDialog);
