import React, { useCallback, useEffect, useState } from "react";
import styles from "./Movies.module.css";
import Movie from "./Movie";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { popupIsOn } from "../../redux/actions/popupActions";

import axios from "axios";
const apiAddress = process.env.REACT_APP_API_ADDRESS;

const ChildMemo = React.memo(Movie);

export default function AllMovies() {
  const [movies, setMovies] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userLogin } = useSelector((store) => store.worker);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [search, setSearch] = useState("");

  const getMovies = useCallback(async () => {
    try {
      const { data } = await axios.post(`${apiAddress}movies/getMovies`);

      setMovies(data);
    } catch (error) {
      dispatch(popupIsOn("Please check your internet connection."));
    }
  }, [dispatch]);

  useEffect(() => {
    getMovies();
  }, [getMovies]);

  const searchShow = useCallback(() => {
    if (search) {
      const moviesFound = movies.filter((movie) =>
        movie.name.toLowerCase().includes(search)
      );
      moviesFound.length > 0
        ? setFilteredMovies(moviesFound)
        : setFilteredMovies([]);
    } else {
      setFilteredMovies([]);
    }
  }, [search, movies]);

  useEffect(() => {
    searchShow();
  }, [searchShow]);

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
      <div className={styles.movieGeneralContainer}>
        <div className={styles.searchFilter}>
          <h1>Search for a Show</h1>
          <div className={styles.formInputGroup}>
            <input
              type="text"
              placeholder="Show Name"
              className={styles.searchInput}
              required
              minLength="3"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        {/* Later Adding search filter method */}
        {filteredMovies.length > 0 ? (
          filteredMovies.map((movie) => {
            return (
              <ChildMemo key={movie._id} movieId={movie._id} movie={movie} />
            );
          })
        ) : movies.length > 0 ? (
          movies.map((movie) => {
            return (
              <ChildMemo key={movie._id} movieId={movie._id} movie={movie} />
            );
          })
        ) : (
          <button onClick={getMovies}>Click to refresh</button>
        )}
      </div>
    </>
  );
}

//watchMovie={openMoviePage}
