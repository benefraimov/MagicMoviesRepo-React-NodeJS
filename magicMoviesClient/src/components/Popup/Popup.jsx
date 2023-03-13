import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { popupIsOff } from "../../redux/actions/popupActions";

import styles from "./Popup.module.css";

function Popup() {
  const dispatch = useDispatch();
  const popup = useSelector((store) => store.popup);

  useEffect(() => {
    if (popup.popupIsOn) {
      const timer = setTimeout(() => {
        dispatch(popupIsOff());
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [popup.popupIsOn]);

  return (
    <div
      className={
        popup.popupIsOn ? `${styles.popup} ${styles.show}` : styles.popup
      }>
      {popup.popupIsOn && (
        <div className={styles["popup-content"]}>
          <div>{popup.message}</div>
        </div>
      )}
    </div>
  );
}

export default Popup;
