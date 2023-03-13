import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logInAction } from "../../redux/actions/workerActions";
import styles from "./SignIn.module.css";

const apiAddress = process.env.REACT_APP_API_ADDRESS;

export default function SignIn() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userLogin, message } = useSelector((store) => store.worker);
  const [logMessage, setLogMessage] = useState("");
  const [values, setValues] = useState({
    userName: "",
    password: "",
  });

  const handleChange = (e) => {
    setValues({
      ...values,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    dispatch(logInAction(values));
  };

  const checkLogin = useCallback(() => {
    if (userLogin) {
      navigate("/movies/allmovies");
    }
  }, [userLogin, navigate]);

  useEffect(() => {
    checkLogin();
  }, [checkLogin]);

  const updateMessage = useCallback(() => {
    setLogMessage(message);
  }, [message]);

  useEffect(() => {
    updateMessage();
  }, [updateMessage]);

  return (
    <>
      {/* Login container */}
      <form className={styles.formContainer} onSubmit={handleSubmit}>
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
        <div className={styles.formBtnGroup}>
          <button type="submit">Log In</button>
          <p>{logMessage}</p>
        </div>
      </form>
    </>
  );
}
