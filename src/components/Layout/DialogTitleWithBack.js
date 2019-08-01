import React from 'react'
import Button from 'react-md/lib/Buttons/Button'

function DialogTitleWithBack(props) {
  const { onCancel, title } = props;
  return (
    <>
      <Button
        icon
        children="arrow_back"
        onClick={onCancel}
        className="i_dialog_title-close"
      />
      <span className="i_dialog_title-title">
        {title}
      </span>
    </>
  );
}

export default DialogTitleWithBack