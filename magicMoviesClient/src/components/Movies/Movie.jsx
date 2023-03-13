import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Movies.module.css";
import { useDispatch, useSelector } from "react-redux";
import { popupIsOn } from "../../redux/actions/popupActions";

import axios from "axios";
const apiAddress = process.env.REACT_APP_API_ADDRESS;

export default function Movie({ movieId }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { updateMovies, deleteMovies } = useSelector(
    (store) => store.worker.permission
  );
  const [subscribers, setSubscribers] = useState([]);
  const [values, setValues] = useState({
    name: "",
    premiered: "",
    image: "",
    genres: "",
  });

  const openMoviePage = () => {
    navigate(`/movies/movie/${movieId}`);
  };

  const editMovie = () => {
    if (updateMovies) {
      // moving to edit movie page..
      navigate(`/movies/editmovie/${movieId}`);
    } else {
      dispatch(popupIsOn("You have no editing permission."));
    }
  };

  function refreshPage() {
    window.location.reload(false);
  }

  const deleteMovie = async () => {
    try {
      if (deleteMovies) {
        // deleting movie by ID..
        // can be via fetch or axios
        const response = await axios.delete(`${apiAddress}movies/${movieId}`);

        if (response.status === 204) {
          dispatch(popupIsOn(`deleting movie ${movieId} done successfully.`));
          refreshPage();
        }
      } else {
        dispatch(popupIsOn("You have no deleting permission"));
      }
    } catch (error) {
      dispatch(popupIsOn("Something went wrong, Please try again later."));
    }
  };

  const getMovieData = useCallback(async () => {
    try {
      const { data } = await axios.post(
        `${apiAddress}movies/getMovie/${movieId}`
      );

      const resp = await axios.post(`${apiAddress}subscribers/getSubscribers`);

      let arrSubs = [];
      resp.data.forEach((element) => {
        element.movies.forEach((movie) => {
          if (movie._id.toString() === movieId.toString()) {
            arrSubs.push(element);
          }
        });
      });
      setSubscribers([...arrSubs]);
      setValues(data);
    } catch (error) {
      dispatch(popupIsOn("Please check your internet connection."));
    }
  }, [movieId, dispatch]);

  useEffect(() => {
    getMovieData();
  }, [getMovieData]);

  return (
    <>
      <div className={styles.movieMainContainer}>
        <div className={styles.movieInnerContainer}>
          <div className={styles.movieImgContainer} onClick={openMoviePage}>
            <img
              className={styles.movieImg}
              src={values.image}
              alt={values.name}
            />
          </div>
          <div className={styles.movieDetails}>
            <ul className={styles.movieDetailsList}>
              <li>
                <span>Name:</span> {values.name}
              </li>
              <li>
                <span>Release Date:</span> {values.premiered.substring(0, 10)}
              </li>
              <li>
                <span>Genres:</span> {values.genres}
              </li>
              <li>
                <span>Subscribers:</span>{" "}
                <ul>
                  {subscribers.map((sub) => {
                    return <li key={sub._id}>{sub.fullName}</li>;
                  })}
                </ul>
              </li>
            </ul>
          </div>
        </div>
        <div className={styles.movieButtons}>
          <button onClick={editMovie}>Edit</button>
          <button onClick={deleteMovie}>Delete</button>
        </div>
      </div>
    </>
  );
}
