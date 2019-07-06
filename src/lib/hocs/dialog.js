import React from 'react';
import DialogLayout from 'components/Layout/Dialog';
import pick from 'lodash/pick';
import omit from 'lodash/omit';
import { useAppData } from 'apollo/query';
import useForm from 'lib/hooks/useForm';

const dialogProps = ['dialogId', 'dialogActionsRenderer', 'dialogTitleRenderer', 'title', 'dialogClass'];
const formProps = ['initialFields', 'validator', 'customChangeHandler', 'onValid'];
export default () => (WrappedComponent) => {
  function Dialog(props) {
    const [{ appData }, setAppData] = useAppData();
    console.log('dialog appData: ', appData);
    const [formState, formHandlers] = useForm(pick({ ...props, onValid }, formProps));
    return (
      <DialogLayout
        onContinue={() => formHandlers.onValidate(formState.fields)}
        onCancel={() => {
          setAppData({
            dialog: null,
          });
        }}
        isProcessing={appData.dialogProcessing}
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
      setAppData({
        dialogProcessing: true,
      });
      props.onValid(...args);
    }
  }
  Dialog.displayName = `withDialog(${WrappedComponent.displayName
      || WrappedComponent.name
      || 'Component'})`;
  return Dialog;
};
