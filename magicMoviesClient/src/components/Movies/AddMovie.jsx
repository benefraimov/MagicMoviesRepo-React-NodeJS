import React, { useCallback, useEffect, useState } from "react";
import styles from "./Movies.module.css";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { popupIsOn } from "../../redux/actions/popupActions";

import axios from "axios";
const apiAddress = process.env.REACT_APP_API_ADDRESS;

export default function AddMovie() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userLogin } = useSelector((store) => store.worker);
  const { createMovies } = useSelector((store) => store.worker.permission);

  const [values, setValues] = useState({
    name: "",
    premiered: "",
    image: "",
    genres: "",
    subscribers: [],
  });

  const handleChange = (e) => {
    setValues((oldValues) => ({
      ...oldValues,
      [e.target.id]: e.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    try {
      event.preventDefault();
      const response = await axios.post(`${apiAddress}movies/newMovie`, values);

      if (response.status === 201) {
        dispatch(popupIsOn("Movie added successfully."));
        navigate(-1);
      } else {
        dispatch(
          popupIsOn("Problem in adding a new Movie, try again later please.")
        );
      }
    } catch (error) {
      dispatch(popupIsOn("Please check your internet connection."));
    }
  };

  const cancelForm = () => {
    navigate("/movies/allmovies");
  };

  const checkLogin = useCallback(() => {
    if (!userLogin) {
      navigate("/");
    }
  }, [userLogin, navigate]);

  useEffect(() => {
    checkLogin();
  }, [checkLogin]);

  const checkPermission = useCallback(() => {
    if (!createMovies) {
      navigate(-1);
    }
  }, [createMovies, navigate]);

  useEffect(() => {
    checkPermission();
  }, [checkPermission]);

  return (
    <>
      <form className={styles.formContainer} onSubmit={handleSubmit}>
        <div className={styles.formInputGroup}>
          <input
            type="text"
            placeholder="Name"
            id="name"
            className={styles["form-input"]}
            required
            minLength="3"
            value={values.name}
            onChange={handleChange}
          />
          <label htmlFor="name" className={styles["form-label"]}>
            Name
          </label>
        </div>
        <div className={styles.formInputGroup}>
          <input
            type="text"
            placeholder="Genres"
            id="genres"
            className={styles["form-input"]}
            required
            minLength="4"
            value={values.genres}
            onChange={handleChange}
          />
          <label htmlFor="genres" className={styles["form-label"]}>
            Genres
          </label>
        </div>
        <div className={styles.formInputGroup}>
          <input
            type="url"
            placeholder="Image Url"
            id="image"
            className={styles["form-input"]}
            required
            value={values.image}
            onChange={handleChange}
          />
          <label htmlFor="image" className={styles["form-label"]}>
            Image Url
          </label>
        </div>
        <div className={styles.formInputGroup}>
          <input
            type="date"
            placeholder="Premiered"
            id="premiered"
            className={styles["form-input"]}
            required
            value={values.premiered}
            onChange={handleChange}
          />
          <label htmlFor="premiered" className={styles["form-label"]}>
            Premiered
          </label>
        </div>
        <div className={styles.formBtnGroup}>
          <button type="submit">Add Movie</button>
          <button type="button" onClick={cancelForm}>
            Cancel
          </button>
        </div>
      </form>
    </>
  );
}
