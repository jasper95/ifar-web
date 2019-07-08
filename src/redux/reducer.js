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
};
