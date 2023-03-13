import { POPUP_IS_OFF, POPUP_IS_ON } from "../constants/popupConstants";

export const popupIsOn = (message) => (dispatch) => {
  dispatch({
    type: POPUP_IS_ON,
    payload: message
  });
};

export const popupIsOff = () => (dispatch) => {
  dispatch({
    type: POPUP_IS_OFF
  });
};
