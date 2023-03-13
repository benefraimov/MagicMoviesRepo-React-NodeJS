import { POPUP_IS_OFF, POPUP_IS_ON } from "../constants/popupConstants";

const initialPopupState = {
  message: "",
  popupIsOn: false,
};

export default function popupReducer(state = initialPopupState, action) {
  switch (action.type) {
    case POPUP_IS_ON: {
      const newState = { ...state };
      newState.message = action.payload;
      newState.popupIsOn = true;
      return newState;
    }

    case POPUP_IS_OFF: {
      const newState = { ...state };
      newState.message = "";
      newState.popupIsOn = false;
      return newState;
    }

    default:
      return state;
  }
}
