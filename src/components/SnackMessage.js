import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import InfoIcon from '@material-ui/icons/Info';
import CloseIcon from '@material-ui/icons/Close';
import green from '@material-ui/core/colors/green';
import amber from '@material-ui/core/colors/amber';
import IconButton from '@material-ui/core/IconButton';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import WarningIcon from '@material-ui/icons/Warning';
import { withStyles } from '@material-ui/core/styles';

import snack from '../const/Snack';

const variantIcon = {
    success: CheckCircleIcon,
    warning: WarningIcon,
    error: ErrorIcon,
    info: InfoIcon,
};

const styles = theme => ({
    success: {
        backgroundColor: green[600],
    },
    error: {
        backgroundColor: theme.palette.error.dark,
    },
    info: {
        backgroundColor: theme.palette.primary.dark,
    },
    warning: {
        backgroundColor: amber[700],
    },
    icon: {
        fontSize: 20,
    },
    iconVariant: {
        opacity: 0.9,
        marginRight: theme.spacing.unit,
    },
    message: {
        display: 'flex',
        alignItems: 'center',
    },
});

class SnackMessage extends React.Component {
    render() {
        const { classes, message, onClose, variant, open, autoHideDuration } = this.props;
        const Icon = variantIcon[variant];

        return (
            <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                open={open}
                autoHideDuration={autoHideDuration === undefined ? 6000 : autoHideDuration}
                onClose={onClose}
            >
                <SnackbarContent
                    className={classes[variant]}
                    aria-describedby="snackbar-content"
                    message={
                        <span id="snackbar-content" className={classes.message}>
                            <Icon className={classNames(classes.icon, classes.iconVariant)} />
                            {message}
                        </span>
                    }
                    action={[
                        <IconButton
                            key="close"
                            aria-label="Close"
                            color="inherit"
                            className={classes.close}
                            onClick={onClose}
                        >
                            <CloseIcon className={classes.icon} />
                        </IconButton>,
                    ]}
                />
            </Snackbar>
        );
    }
}

SnackMessage.propTypes = {
    classes: PropTypes.object.isRequired,
    message: PropTypes.node.isRequired,
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    variant: PropTypes.oneOf([snack.ERROR, snack.WARN, snack.INFO, snack.SUCCESS]).isRequired,
    autoHideDuration:PropTypes.number,
};

export default withStyles(styles)(SnackMessage);
