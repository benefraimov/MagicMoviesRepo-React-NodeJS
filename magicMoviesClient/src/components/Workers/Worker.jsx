import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { deleteAction } from "../../redux/actions/workerActions";
import styles from "./Workers.module.css";
import { popupIsOn } from "../../redux/actions/popupActions";

import axios from "axios";
const apiAddress = process.env.REACT_APP_API_ADDRESS;

export default function Worker({ worker, workerId }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const openWorkerPage = () => {
    navigate(`/workers/worker/${workerId}`);
  };

  const editWorker = () => {
    // moving to edit Worker page..
    navigate(`/workers/editworker/${workerId}`);
  };

  const deleteWorker = async () => {
    const { data } = await axios.post(
      `${apiAddress}workers/getWorker/${workerId}`
    );

    if (!data.isAdmin) {
      // deleting Worker by ID..
      dispatch(deleteAction(workerId));
    } else {
      dispatch(popupIsOn("Admin users cannot be erased"));
    }
  };

  return (
    <>
      <div className={styles.workerMainContainer}>
        <div className={styles.workerInnerContainer}>
          <div className={styles.workerDetails} onClick={openWorkerPage}>
            <ul className={styles.workerDetailsList}>
              <li>
                <span>Full Name:</span> {worker.fullName}
              </li>
              <li>
                <span>Is Admin:</span> {worker.isAdmin.toString()}
              </li>
              <li>
                <span>Username:</span> {worker.userName}
              </li>
              <li>
                <span>Password:</span> {worker.password}
              </li>
              <li>
                <span>Created Date:</span> {worker.createdDate.substring(0, 10)}
              </li>
            </ul>
            <h1 className={styles.permissionHeader}>Permissions</h1>
            <div className={styles.permissionsLists}>
              <ul className={styles.workerDetailsList}>
                <li>
                  <span>watchSubs:</span>{" "}
                  {worker.permission.watchSubs.toString()}
                </li>
                <li>
                  <span>createSubs:</span>{" "}
                  {worker.permission.createSubs.toString()}
                </li>
                <li>
                  <span>updateSubs:</span>{" "}
                  {worker.permission.updateSubs.toString()}
                </li>
                <li>
                  <span>deleteSubs:</span>{" "}
                  {worker.permission.deleteSubs.toString()}
                </li>
              </ul>
              <ul className={styles.workerDetailsList}>
                <li>
                  <span>watchMovies:</span>{" "}
                  {worker.permission.watchMovies.toString()}
                </li>
                <li>
                  <span>createMovies:</span>{" "}
                  {worker.permission.createMovies.toString()}
                </li>
                <li>
                  <span>updateMovies:</span>{" "}
                  {worker.permission.updateMovies.toString()}
                </li>
                <li>
                  <span>deleteMovies:</span>{" "}
                  {worker.permission.deleteMovies.toString()}
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className={styles.workerButtons}>
          <button onClick={editWorker}>Edit</button>
          <button onClick={deleteWorker}>Delete</button>
        </div>
      </div>
    </>
  );
}
