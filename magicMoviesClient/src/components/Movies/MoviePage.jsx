import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./Movies.module.css";
import { useDispatch, useSelector } from "react-redux";
import { popupIsOn } from "../../redux/actions/popupActions";

import axios from "axios";
const apiAddress = process.env.REACT_APP_API_ADDRESS;

export default function MoviePage() {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userLogin } = useSelector((store) => store.worker);

  const [values, setValues] = useState({
    name: "",
    premiered: "",
    image: "",
    genres: "",
    subscribers: [],
  });

  const getMovieData = useCallback(async () => {
    try {
      const { data } = await axios.post(
        `${apiAddress}movies/getMovie/${movieId}`
      );

      setValues(data);
    } catch (error) {
      dispatch(popupIsOn("Please check your internet connection."));
    }
  }, [movieId, dispatch]);

  useEffect(() => {
    getMovieData();
  }, [getMovieData]);

  const checkLogin = useCallback(() => {
    if (!userLogin) {
      navigate("/");
    }
  }, [userLogin, navigate]);

  useEffect(() => {
    checkLogin();
  }, [checkLogin]);

  return (
    <>
      <div className={styles.moviePageContainer}>
        <div className={styles.moviePageImageAndName}>
          <h1 className={styles.moviePageName}>{values.name}</h1>
          <img
            className={styles.moviePageImage}
            src={values.image}
            alt={values.name}
          />
        </div>
        <div className={styles.moviePageDetails}>
          <ul>
            <li>
              <span>Release Date: </span>
              {values.premiered.substring(0, 10)}
            </li>
            <li>
              <span>Genres: </span>
              {values.genres}
            </li>
            <li>
              <span>Subscribers:</span>{" "}
              <ul>
                {values.subscribers.map((sub) => {
                  return <li key={sub._id}>{sub.fullName}</li>;
                })}
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
