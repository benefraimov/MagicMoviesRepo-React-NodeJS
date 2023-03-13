import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./Subscriptions.module.css";
import Movie from "../Movies/Movie";
import { useDispatch, useSelector } from "react-redux";
import { popupIsOn } from "../../redux/actions/popupActions";
import axios from "axios";
const apiAddress = process.env.REACT_APP_API_ADDRESS;

const ChildMemo = React.memo(Movie);

export default function SubscriberPage() {
  const { subscriberId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userLogin } = useSelector((store) => store.worker);
  const [values, setValues] = useState({
    fullName: "",
    email: "",
    city: "",
    createdDate: "",
    movies: [],
  });
  const [movies, setMovies] = useState([]);
  const [movieToAddName, setMovieToAddName] = useState("");
  const [movieToDeleteName, setMovieToDeleteName] = useState("");

  const getSubscriberData = useCallback(async () => {
    try {
      const subsData = await axios.post(
        `${apiAddress}subscribers/getSubscriber/${subscriberId}`
      );

      if (subsData.status === 200) {
        let newObjData = {
          fullName: subsData.data.fullName,
          email: subsData.data.email,
          city: subsData.data.city,
          createdDate: subsData.data.createdDate.substring(0, 10),
          movies: subsData.data.movies,
        };

        setValues(newObjData);
      }

      const response = await axios.post(`${apiAddress}movies/getMovies`);

      if (response.status === 200) setMovies(response.data);
    } catch (error) {
      dispatch(popupIsOn("Please check your internet connection."));
    }
  }, [subscriberId, dispatch]);

  useEffect(() => {
    getSubscriberData();
  }, [getSubscriberData]);

  const checkLogin = useCallback(() => {
    if (!userLogin) {
      navigate("/");
    }
  }, [userLogin, navigate]);

  useEffect(() => {
    checkLogin();
  }, [checkLogin]);

  const addMovie = async () => {
    const movie = movies.filter((movie) => movie.name === movieToAddName)[0];

    const responseSubs = await axios.put(
      `${apiAddress}subscribers/addMovie/${subscriberId}/${movie._id}`
    );

    const responseMovie = await axios.put(
      `${apiAddress}movies/addSubscriber/${movie._id}/${subscriberId}`
    );

    if (responseSubs.status === 204 && responseMovie.status === 204) {
      dispatch(popupIsOn("Movie add to subscriber seccessfully."));
      navigate(-1);
    }
  };

  const deleteMovie = async () => {
    const movie = movies.filter((movie) => movie.name === movieToDeleteName)[0];

    const responseSubs = await axios.put(
      `${apiAddress}subscribers/deleteMovie/${subscriberId}/${movie._id}`
    );

    const responseMovie = await axios.put(
      `${apiAddress}movies/deleteSubscriber/${movie._id}/${subscriberId}`
    );

    if (responseSubs.status === 204 && responseMovie.status === 204) {
      dispatch(popupIsOn("Movie deleted from subscriber seccessfully."));
      navigate(-1);
    }
  };

  const handleAddMovieChange = (e) => {
    setMovieToAddName(e.target.value);
  };

  const handleDeleteMovieChange = (e) => {
    setMovieToDeleteName(e.target.value);
  };

  return (
    <>
      <div className={styles.subscriptionPageContainer}>
        <div className={styles.subscriptionPageDetails}>
          <ul>
            <li>
              <span>Full Name: </span>
              {values.fullName}
            </li>
            <li>
              <span>Email: </span>
              {values.email}
            </li>
            <li>
              <span>City: </span> {values.city}
            </li>
            <li>
              <span>Created Date: </span>{" "}
              {values.createdDate && values.createdDate.substring(0, 10)}
            </li>
            <li>
              <span>Add Movie From The List: </span>
              <select value={movieToAddName} onChange={handleAddMovieChange}>
                <option key={-1} value={""}>
                  Please choose a movie
                </option>
                {movies.length > 0 &&
                  movies.map((movie) => {
                    return (
                      <option key={movie._id} value={movie.name}>
                        {movie.name}
                      </option>
                    );
                  })}
              </select>
              <button onClick={addMovie}>Add</button>
            </li>
            <li>
              <span>Delete Movie From The List: </span>
              <select
                value={movieToDeleteName}
                onChange={handleDeleteMovieChange}>
                <option key={-1} value={""}>
                  Please choose a movie
                </option>
                {values.movies.length > 0 &&
                  values.movies.map((movie) => {
                    return (
                      <option key={movie._id} value={movie.name}>
                        {movie.name}
                      </option>
                    );
                  })}
              </select>
              <button onClick={deleteMovie}>Delete</button>
            </li>
          </ul>
        </div>
        {values.movies.length > 0 &&
          values.movies.map((movie) => {
            return <ChildMemo key={movie._id} movieId={movie._id} />;
          })}
      </div>
    </>
  );
}
