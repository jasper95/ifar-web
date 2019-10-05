import withDialog from 'lib/hocs/dialog';
import Comments from 'components/Comments';
import flowRight from 'lodash/flowRight';

const Dialog = flowRight(
  withDialog(),
)(Comments);

Dialog.defaultProps = {
  dialogActionsRenderer: () => null,
  dialogClassName: 'i_dialog_container--l',
};

export default Dialog;
