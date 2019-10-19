import React from 'react';
import PropTypes from 'prop-types';
import DialogContent from '@material-ui/core/DialogContent';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import TextField from '@material-ui/core/TextField';

class TypeQrCodeDialog extends React.Component {
    state = {
        code: '',
    };

    handleChange = event => {
        this.setState({ code: event.target.value });
    };

    handleOnOkClick = () => {
        this.props.onClick(this.state.code);
        this.props.onClose();
        this.setState({ code: '' });
    };

    render() {
        const { open, onClose } = this.props;

        return (
            <React.Fragment>
                <Dialog
                    fullWidth={true}
                    maxWidth={'xs'}
                    onClose={onClose}
                    open={open}
                >
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="code"
                            label="Enter code here"
                            fullWidth
                            value={this.state.code}
                            onChange={this.handleChange}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={onClose} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={this.handleOnOkClick} color="primary">
                            Ok
                        </Button>
                    </DialogActions>
                </Dialog>
            </React.Fragment>
        );
    }
}

TypeQrCodeDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onClick: PropTypes.func.isRequired,
};

export default TypeQrCodeDialog;
