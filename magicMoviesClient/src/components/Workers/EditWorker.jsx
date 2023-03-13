import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { updateAction } from "../../redux/actions/workerActions";
import styles from "./Workers.module.css";
import { popupIsOn } from "../../redux/actions/popupActions";

import axios from "axios";
const apiAddress = process.env.REACT_APP_API_ADDRESS;

export default function EditWorker() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { workerId } = useParams();
  const { userLogin, userIsAdmin, userUpdate, userUpdateFailed } = useSelector(
    (store) => store.worker
  );
  const [values, setValues] = useState({
    _id: workerId,
    fullName: "",
    isAdmin: false,
    userName: "",
    password: "",
    changePass: false,
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

  const handleChange = (e) => {
    if (e.target.id === "password") {
      setValues((oldValues) => ({
        ...oldValues,
        changePass: true,
      }));
    }

    setValues((oldValues) => ({
      ...oldValues,
      [e.target.id]: e.target.value,
    }));
  };

  const handleIsAdminChange = (e) => {
    setValues((oldValues) => ({
      ...oldValues,
      [e.target.id]: e.target.checked,
    }));
  };

  const handleCheckChangePermission0 = (e) => {
    if (e.target.id !== "watchSubs") {
      const newState = { ...values };
      newState.permission[e.target.id] = !values.permission[e.target.id];
      setValues({ ...newState });
    } else {
      dispatch(popupIsOn("You can't unchecked Watch Subscribers"));
    }
  };

  const handleCheckChangePermission1 = (e) => {
    if (e.target.id !== "watchMovies") {
      const newState = { ...values };
      newState.permission[e.target.id] = !values.permission[e.target.id];
      setValues({ ...newState });
    } else {
      dispatch(popupIsOn("You can't unchecked Watch Movies"));
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    dispatch(updateAction(values, workerId));
  };

  const cancelForm = () => {
    navigate("/workers/allworkers");
  };

  const getWorkerData = useCallback(async () => {
    try {
      const { data } = await axios.post(
        `${apiAddress}workers/getWorker/${workerId}`
      );

      setValues(data);
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

  const checkForUpdate = useCallback(() => {
    if (userUpdate) {
      navigate(-1);
    }
  }, [userUpdate, navigate]);

  useEffect(() => {
    checkForUpdate();
  }, [checkForUpdate]);

  const checkUpdateFailed = useCallback(() => {
    if (userUpdateFailed) {
      dispatch(popupIsOn("At least one user must be an admin."));
    }
  }, [userUpdateFailed, dispatch]);

  useEffect(() => {
    checkUpdateFailed();
  }, [checkUpdateFailed]);

  return (
    <>
      <form className={styles.formContainer} onSubmit={handleSubmit}>
        <div className={styles.formInputGroup}>
          <input
            type="text"
            placeholder="Full Name"
            id="fullName"
            className={styles["form-input"]}
            required
            minLength="5"
            value={values.fullName}
            onChange={handleChange}
          />
          <label htmlFor="fullName" className={styles["form-label"]}>
            Full Name
          </label>
        </div>
        <div className={styles.formInputGroup}>
          <input
            type="text"
            placeholder="Username"
            id="userName"
            className={styles["form-input"]}
            required
            minLength="5"
            value={values.userName}
            onChange={handleChange}
          />
          <label htmlFor="userName" className={styles["form-label"]}>
            Username
          </label>
        </div>
        <div className={styles.formInputGroup}>
          <input
            type="password"
            placeholder="Password"
            id="password"
            className={styles["form-input"]}
            required
            minLength="5"
            value={values.password}
            onChange={handleChange}
          />
          <label htmlFor="password" className={styles["form-label"]}>
            Password
          </label>
        </div>
        <div className={styles.formInputGroup}>
          <input
            type="date"
            placeholder="Created Date"
            id="createdDate"
            className={styles["form-input"]}
            required
            value={values.createdDate.substring(0, 10)}
            onChange={handleChange}
          />
          <label htmlFor="createdDate" className={styles["form-label"]}>
            Created Date
          </label>
        </div>
        <h1 className={styles.editPermissionHeader}>Permissions</h1>

        <div className={styles.permissionsFlex}>
          <div className={styles.subscriptionPermission}>
            <div className={styles.formCheckBoxGroup}>
              <input
                type="checkbox"
                id="watchSubs"
                checked={values.permission.watchSubs}
                onChange={handleCheckChangePermission0}
              />
              <label
                htmlFor="watchSubs"
                className={styles["form-label-checkbox"]}>
                Watch Subscriptions
              </label>
            </div>
            <div className={styles.formCheckBoxGroup}>
              <input
                type="checkbox"
                id="createSubs"
                checked={values.permission.createSubs}
                onChange={handleCheckChangePermission0}
              />
              <label
                htmlFor="createSubs"
                className={styles["form-label-checkbox"]}>
                Created Subscriptions
              </label>
            </div>
            <div className={styles.formCheckBoxGroup}>
              <input
                type="checkbox"
                id="updateSubs"
                checked={values.permission.updateSubs}
                onChange={handleCheckChangePermission0}
              />
              <label
                htmlFor="updateSubs"
                className={styles["form-label-checkbox"]}>
                Update Subscriptions
              </label>
            </div>
            <div className={styles.formCheckBoxGroup}>
              <input
                type="checkbox"
                id="deleteSubs"
                checked={values.permission.deleteSubs}
                onChange={handleCheckChangePermission0}
              />
              <label
                htmlFor="deleteSubs"
                className={styles["form-label-checkbox"]}>
                Delete Subscriptions
              </label>
            </div>
          </div>
          <div className={styles.moviesPermission}>
            <div className={styles.formCheckBoxGroup}>
              <input
                type="checkbox"
                id="watchMovies"
                checked={values.permission.watchMovies}
                onChange={handleCheckChangePermission1}
              />
              <label
                htmlFor="watchMovies"
                className={styles["form-label-checkbox"]}>
                Watch Movies
              </label>
            </div>
            <div className={styles.formCheckBoxGroup}>
              <input
                type="checkbox"
                id="createMovies"
                checked={values.permission.createMovies}
                onChange={handleCheckChangePermission1}
              />
              <label
                htmlFor="createMovies"
                className={styles["form-label-checkbox"]}>
                Created Movies
              </label>
            </div>
            <div className={styles.formCheckBoxGroup}>
              <input
                type="checkbox"
                id="updateMovies"
                checked={values.permission.updateMovies}
                onChange={handleCheckChangePermission1}
              />
              <label
                htmlFor="updateMovies"
                className={styles["form-label-checkbox"]}>
                Update Movies
              </label>
            </div>
            <div className={styles.formCheckBoxGroup}>
              <input
                type="checkbox"
                id="deleteMovies"
                checked={values.permission.deleteMovies}
                onChange={handleCheckChangePermission1}
              />
              <label
                htmlFor="deleteMovies"
                className={styles["form-label-checkbox"]}>
                Delete Movies
              </label>
            </div>
          </div>
        </div>

        <div className={styles.lonelyCheckbox}>
          <div className={styles.formCheckBoxGroup}>
            <input
              type="checkbox"
              id="isAdmin"
              checked={values.isAdmin}
              onChange={handleIsAdminChange}
            />
            <label htmlFor="isAdmin" className={styles["form-label-checkbox"]}>
              Is Admin
            </label>
          </div>
        </div>

        <div className={styles.formBtnGroup}>
          <button type="submit">Update Worker</button>
          <button type="button" onClick={cancelForm}>
            Cancel
          </button>
        </div>
      </form>
    </>
  );
}
