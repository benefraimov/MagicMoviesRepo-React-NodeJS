import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./Workers.module.css";
import { useDispatch, useSelector } from "react-redux";
import { popupIsOn } from "../../redux/actions/popupActions";
import axios from "axios";
const apiAddress = process.env.REACT_APP_API_ADDRESS;

export default function WorkerPage() {
  const { workerId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userLogin, userIsAdmin } = useSelector((store) => store.worker);
  const [values, setValues] = useState({
    fullName: "",
    userName: "",
    createdDate: "",
    permission: {
      watchSubs: true,
      createSubs: false,
      updateSubs: false,
      deleteSubs: false,
      watchMovies: true,
      createMovies: false,
      updateMovies: false,
      deleteMovies: false,
    },
  });

  const getWorkerData = useCallback(async () => {
    try {
      const { data } = await axios.post(
        `${apiAddress}workers/getWorker/${workerId}`
      );
      if (data) setValues(data);
    } catch (error) {
      dispatch(popupIsOn("Please check your internet connection."));
    }
  }, [workerId, dispatch]);

  useEffect(() => {
    getWorkerData();
  }, [getWorkerData]);

  const checkLogin = useCallback(() => {
    if (!userLogin) {
      navigate("/");
    }
  }, [userLogin, navigate]);

  useEffect(() => {
    checkLogin();
  }, [checkLogin]);

  const checkIsAdmin = useCallback(() => {
    if (!userIsAdmin) {
      navigate("/movies/allmovies");
    }
  }, [userIsAdmin, navigate]);

  useEffect(() => {
    checkIsAdmin();
  }, [checkIsAdmin]);

  return (
    <>
      <div className={styles.workerPageContainer}>
        <div className={styles.workerPageDetails}>
          <ul>
            <li>
              <span>Full Name: </span>
              {values.fullName}
            </li>
            <li>
              <span>Username: </span>
              {values.userName}
            </li>
            <li>
              <span>Password: </span>
              *******
            </li>
            <li>
              <span>Created Date: </span> {values.createdDate.substring(0, 10)}
            </li>
          </ul>
          <h1 className={styles.permissionHeader}>Permissions</h1>
          <div className={styles.permissionsLists}>
            <ul className={styles.workerDetailsList}>
              <li>
                <span>watchSubs:</span>{" "}
                {values.permission && values.permission.watchSubs.toString()}
              </li>
              <li>
                <span>createSubs:</span>{" "}
                {values.permission && values.permission.createSubs.toString()}
              </li>
              <li>
                <span>updateSubs:</span>{" "}
                {values.permission && values.permission.updateSubs.toString()}
              </li>
              <li>
                <span>deleteSubs:</span>{" "}
                {values.permission && values.permission.deleteSubs.toString()}
              </li>
            </ul>
            <ul className={styles.workerDetailsList}>
              <li>
                <span>watchMovies:</span>{" "}
                {values.permission && values.permission.watchMovies.toString()}
              </li>
              <li>
                <span>createSubs:</span>{" "}
                {values.permission && values.permission.createMovies.toString()}
              </li>
              <li>
                <span>updateSubs:</span>{" "}
                {values.permission && values.permission.updateMovies.toString()}
              </li>
              <li>
                <span>deleteSubs:</span>{" "}
                {values.permission && values.permission.deleteMovies.toString()}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
