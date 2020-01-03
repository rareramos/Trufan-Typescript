import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
// import Slide from '@material-ui/core/Slide';
import TextField from '@material-ui/core/TextField';

import s from './Popup.css';

class Popup extends React.Component {
  static propTypes = {
    title: PropTypes.string,
    description: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired,
    onClick: PropTypes.func.isRequired,
    // showPopup: PropTypes.bool,
    cancelText: PropTypes.string,
    acceptText: PropTypes.string,
    textInput: PropTypes.bool,
    textInputMaxLength: PropTypes.number,
    hideTextInputDescription: PropTypes.bool,
  };

  static defaultProps = {
    title: null,
    // showPopup: false,
    acceptText: 'Accept',
    cancelText: 'Cancel',
    textInput: false,
    textInputMaxLength: 10000,
    hideTextInputDescription: false,
  };

  constructor(props) {
    super(props);

    this.state = {
      title: props.title,
      message: '',
      showTextInput: props.textInput,
      textInputField: 'message',
      hideTextInputDescription: props.hideTextInputDescription,
    };
  }

  showInput() {
    const { textInputMaxLength } = this.props;
    const { message, textInputField, hideTextInputDescription } = this.state;
    return (
      <DialogContent>
        <TextField
          autoFocus
          multiline
          required
          // rowsMax="4"
          // margin="dense"
          id={textInputField}
          name={textInputField}
          type="text"
          fullWidth
          value={message}
          onChange={this.handleChange}
        />
        {!hideTextInputDescription && (
          <DialogContentText variant="subtitle2">
            {textInputMaxLength - message.length}/{textInputMaxLength}{' '}
            characters left
          </DialogContentText>
        )}
      </DialogContent>
    );
  }

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  render() {
    const {
      onClose,
      onClick,
      description,
      // showPopup,
      acceptText,
      cancelText,
    } = this.props;
    const { showTextInput, title } = this.state;
    return (
      <Dialog
        onClose={onClose}
        open
        // transitionComponent={props => <Slide direction="down" {...props} />}
      >
        {title && <DialogTitle className={s.title}>{title}</DialogTitle>}
        <DialogContent>
          <DialogContentText variant="subtitle1">
            {description}
          </DialogContentText>
        </DialogContent>
        {showTextInput && this.showInput()}
        <DialogActions>
          <Button onClick={onClose} color="secondary">
            {cancelText}
          </Button>
          <Button onClick={() => onClick(this.state)} color="primary">
            {acceptText}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default withStyles(s)(Popup);
