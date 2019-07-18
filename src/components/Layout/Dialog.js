import React from 'react';
import PropTypes from 'prop-types';
import DialogContainer from 'react-md/lib/Dialogs/DialogContainer';
import Button from 'react-md/lib/Buttons/Button';
import pick from 'lodash/pick';
import cn from 'classnames';

function DefaultDialogTitle(props) {
  const { onCancel, title } = props;
  return (
    <>
      <span className="i_dialog_title-title">
        {title}
      </span>
      <Button
        icon
        children="close"
        onClick={onCancel}
        className="i_dialog_title-close"
      />
    </>
  );
}

DefaultDialogTitle.propTypes = {
  onCancel: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
};

function DefaultDialogActions(props) {
  const { onContinue, onCancel, isProcessing } = props;
  return (
    <>
      <Button
        className="iBttn iBttn-second-prio"
        flat
        secondary
        onClick={onCancel}
        children="Cancel"
      />

      <Button
        className={cn('iBttn iBttn-primary', { processing: isProcessing })}
        flat
        primary
        onClick={onContinue}
        children="Save"
      />
    </>
  );
}

DefaultDialogActions.propTypes = {
  onContinue: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  isProcessing: PropTypes.bool.isRequired,
};

function DialogLayout(props) {
  const {
    children,
    dialogTitleRenderer: DialogTitle,
    dialogActionsRenderer: DialogActions,
    dialogClassName,
    dialogClass,
    dialogId,
  } = props;

  return (
    <DialogContainer
      visible
      portal
      modal
      id={dialogId}
      renderNode={document.body}
      className={`i_dialog ${dialogId}_dialog ${dialogClass}`}
      title={(
        <DialogTitle {...pick(props, ['onCancel', 'title'])} />
      )}
      actions={(
        <DialogActions {...pick(props, ['onContinue', 'onCancel', 'isProcessing'])} />
      )}
      dialogClassName={`i_dialog_container ${dialogClassName}`}
      {...pick(props, 'footerClassName', 'titleClassName', 'contentClassName', 'onHide', 'height', 'width')}
    >
      {children}
    </DialogContainer>
  );
}

DialogLayout.propTypes = {
  dialogTitleRenderer: PropTypes.func,
  dialogActionsRenderer: PropTypes.func,
  dialogClassName: PropTypes.string,
  titleClassName: PropTypes.string,
  contentClassName: PropTypes.string,
  footerClassName: PropTypes.string,
  dialogClass: '',
  dialogId: PropTypes.string.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};

DialogLayout.defaultProps = {
  dialogTitleRenderer: DefaultDialogTitle,
  dialogActionsRenderer: DefaultDialogActions,
  dialogClassName: 'i_dialog_container--md',
  titleClassName: 'i_dialog_title',
  contentClassName: 'i_dialog_body',
  footerClassName: 'i_dialog_footer',
  dialogClass: '',
};

export default DialogLayout;
