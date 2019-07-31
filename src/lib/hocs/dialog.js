import React from 'react';
import DialogLayout from 'components/Layout/Dialog';
import pick from 'lodash/pick';
import omit from 'lodash/omit';
import useForm from 'lib/hooks/useForm';
import { useSelector, useDispatch } from 'react-redux';

const dialogProps = ['dialogId', 'dialogActionsRenderer', 'dialogTitleRenderer', 'title', 'dialogClass', 'dialogClassName'];
const formProps = ['initialFields', 'validator', 'customChangeHandler', 'onValid'];

export default () => (WrappedComponent) => {
  function Dialog(props) {
    const dispatch = useDispatch();
    const dialogProcessing = useSelector(state => state.dialogProcessing);
    const [formState, formHandlers] = useForm({ ...pick(props, formProps), onValid });
    return (
      <DialogLayout
        onContinue={() => formHandlers.onValidate(formState.fields)}
        onCancel={() => dispatch({ type: 'HIDE_DIALOG' })}
        isProcessing={dialogProcessing}
        {...pick(props, dialogProps)}
      >
        <WrappedComponent
          formState={formState}
          formHandlers={formHandlers}
          {...omit(props, dialogProps.concat(formProps))}
        />
      </DialogLayout>
    );
    function onValid(...args) {
      dispatch({ type: 'SET_STATE', payload: { dialogProcessing: true } });
      props.onValid(...args);
    }
  }
  Dialog.displayName = `withDialog(${WrappedComponent.displayName
      || WrappedComponent.name
      || 'Component'})`;
  return Dialog;
};
