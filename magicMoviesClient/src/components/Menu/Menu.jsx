import React, { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { logOutAction } from "../../redux/actions/workerActions";
import styles from "./Menu.module.css";

export default function Menu() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { fullName, userLogin, userIsAdmin, permission } = useSelector(
    (store) => store.worker
  );
  const location = useLocation();
  const pathname = location.pathname;

  const logOut = () => {
    dispatch(logOutAction());
  };

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
      <div className={styles.container}>
        {pathname === "/" ? (
          <div className={styles.MainNavBar}>
            <h1 className={styles.MainNavBtn}>Welcom to Magic Movies</h1>
          </div>
        ) : (
          <>
            <div className={styles.MainNavBar}>
              <div className={styles.userOnMenu}>Log As: {fullName}</div>
              <Link to="/movies/allmovies">
                <button className={styles.MainNavBtn}>All Shows</button>
              </Link>
              <Link to="/subscriptions/allsubscriptions">
                <button className={styles.MainNavBtn}>Subscriptions</button>
              </Link>
              {userIsAdmin && (
                <Link to="/workers/allworkers">
                  <button className={styles.MainNavBtn}>Workers</button>
                </Link>
              )}
              <Link to="/">
                <button onClick={logOut} className={styles.MainNavBtn}>
                  Exit
                </button>
              </Link>
            </div>
            {pathname.indexOf("movies") > 0 && (
              <div className={styles.NestedNavBar}>
                <Link to="/movies/allmovies">
                  <button className={styles.NestedNavBtn}>All Shows</button>
                </Link>
                {permission.createMovies && (
                  <Link to="/movies/addmovie">
                    <button className={styles.NestedNavBtn}>Add Show</button>
                  </Link>
                )}
              </div>
            )}
            {pathname.indexOf("subscriptions") > 0 && (
              <div className={styles.NestedNavBar}>
                <Link to="/subscriptions/allsubscriptions">
                  <button className={styles.NestedNavBtn}>
                    All Subscriptions
                  </button>
                </Link>
                {permission.createSubs && (
                  <Link to="/subscriptions/createsubscription">
                    <button className={styles.NestedNavBtn}>
                      Create Subscription
                    </button>
                  </Link>
                )}
              </div>
            )}
            {pathname.indexOf("workers") > 0 && (
              <div className={styles.NestedNavBar}>
                <Link to="/workers/allworkers">
                  <button className={styles.NestedNavBtn}>All Workers</button>
                </Link>
                <Link to="/workers/createworker">
                  <button className={styles.NestedNavBtn}>Create Worker</button>
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
