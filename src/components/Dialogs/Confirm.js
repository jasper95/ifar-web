import React from 'react';
import Button from 'react-md/lib/Buttons/Button';
import cn from 'classnames';
import flowRight from 'lodash/flowRight';
import withDialog from 'lib/hocs/dialog';

function ConfirmDialog(props) {
  const { message } = props;
  return message;
}

const Dialog = flowRight(
  withDialog(),
)(ConfirmDialog);

export function DialogActions(props) {
  const { onContinue, isProcessing } = props;
  return (
    <>
      <Button
        className={cn('iBttn iBttn-primary', { processing: isProcessing })}
        flat
        primary
        onClick={onContinue}
        children="Continue"
      />
    </>
  );
}

Dialog.defaultProps = {
  dialogActionsRenderer: DialogActions,
  dialogClass: 'messageDialog',
};

export default Dialog;
