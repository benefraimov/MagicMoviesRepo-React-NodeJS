import React from "react";
import { Link } from "react-router-dom";
import styles from "./NoMatch.module.css";

const NoMatch = () => {
  return (
    <div className={styles["no-match"]}>
      <h1>404 - Page Not Found</h1>
      <Link to="/">Go to Homepage</Link>
    </div>
  );
};

export default NoMatch;
