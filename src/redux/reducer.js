export default {
  SET_STATE(state, { payload }) {
    return { ...state, ...payload };
  },
  SHOW_DIALOG(state, { payload }) {
    return { ...state, dialog: payload };
  },
  HIDE_DIALOG(state) {
    return {
      ...state,
      dialog: null,
      dialogProcessing: false,
    };
  },
  DIALOG_PROCESSING(state, { payload }) {
    const { dialog } = state;
    if (dialog && payload) {
      return { ...state, dialogProcessing: payload };
    }
    return state;
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
      ...state,
      dialog: null,
      dialogProcessing: false,
      toast: {
        type: 'success',
        ...payload,
      },
    };
  },
  CLEAR_LOADING_STATES(state) {
    return {
      ...state,
      dialogProcessing: false,
    };
  },
};
