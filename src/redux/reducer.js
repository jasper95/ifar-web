export default {
  SET_STATE(state, { payload }) {
    return { ...state, ...payload };
  },
  SHOW_DIALOG(state, { payload }) {
    const { dialog } = state;
    let { temporaryClosedDialogs } = state;
    if (dialog) {
      temporaryClosedDialogs = [...temporaryClosedDialogs, dialog];
    }
    return {
      ...state,
      dialog: payload,
      temporaryClosedDialogs,
    };
  },
  HIDE_DIALOG(state) {
    let dialog = null;
    let { temporaryClosedDialogs } = state;
    if (temporaryClosedDialogs.length) {
      [dialog] = [...temporaryClosedDialogs].reverse();
      temporaryClosedDialogs = temporaryClosedDialogs.slice(0, temporaryClosedDialogs.length - 1);
    }
    return {
      ...state,
      dialog,
      dialogProcessing: false,
      temporaryClosedDialogs,
    };
  },
  HIDE_NOTIFICATION(state) {
    return { ...state, toast: null };
  },
  ERROR(state, { payload }) {
    return {
      ...state,
      toast: {
        type: 'error',
        ...payload,
      },
      dialogProcessing: false,
    };
  },
  SUCCESS(state, { payload }) {
    return {
      ...this.HIDE_DIALOG(state),
      toast: {
        type: 'success',
        ...payload,
      },
    };
  },
};
