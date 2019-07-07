import createReducer from 'lib/createReducer';
import { parseCookies } from 'lib/tools';

const cookies = parseCookies();
export const initialState = {
  dialog: null,
  toast: null,
  dialogProcessing: false,
  token: cookies ? cookies.token : '',
};

const reducer = {
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

export default createReducer(initialState, reducer);
