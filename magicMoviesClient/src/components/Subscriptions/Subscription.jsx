import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import styles from "./Subscriptions.module.css";
import { popupIsOn } from "../../redux/actions/popupActions";
import axios from "axios";
const apiAddress = process.env.REACT_APP_API_ADDRESS;

export default function Subscriber({ subscriber, subscriberId }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { updateSubs, deleteSubs } = useSelector(
    (store) => store.worker.permission
  );

  const openSubscriberPage = () => {
    navigate(`/subscriptions/subscription/${subscriberId}`);
  };

  const editSubscriber = () => {
    if (updateSubs) {
      // moving to edit subscriber page..
      navigate(`/subscriptions/editsubscription/${subscriberId}`);
    } else {
      dispatch(popupIsOn("You Have No Update Permission"));
    }
  };

  function refreshPage() {
    window.location.reload(false);
  }

  const deleteSubscriber = async () => {
    if (deleteSubs) {
      // deleting subscriber by ID..
      // can be via fetch or axios
      const data = await axios.delete(
        `${apiAddress}subscribers/${subscriberId}`
      );

      if (data.status === 204) {
        dispatch(popupIsOn("Subscriber deleted successfully."));
        refreshPage();
      }
    } else {
      dispatch(popupIsOn("You Have No Delete Permission."));
    }
  };

  return (
    <>
      <div className={styles.subscriptionMainContainer}>
        <div className={styles.subscriptionInnerContainer}>
          <div
            className={styles.subscriptionDetails}
            onClick={openSubscriberPage}>
            <ul className={styles.subscriptionDetailsList}>
              <li>
                <span>Name:</span> {subscriber.fullName}
              </li>
              <li>
                <span>Email:</span> {subscriber.email}
              </li>
              <li>
                <span>City:</span> {subscriber.city}
              </li>
              <li>
                <span>createdDate:</span>{" "}
                {subscriber.createdDate.substring(0, 10)}
              </li>
              <li>
                <span>Movies:</span>{" "}
                {subscriber.movies.map((movie) => movie.name + ", ")}
              </li>
            </ul>
          </div>
        </div>
        <div className={styles.subscriptionButtons}>
          <button onClick={editSubscriber}>Edit</button>
          <button onClick={deleteSubscriber}>Delete</button>
        </div>
      </div>
    </>
  );
}
