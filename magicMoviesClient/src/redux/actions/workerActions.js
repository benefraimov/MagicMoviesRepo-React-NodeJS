import {
  WORKER_DELETE,
  WORKER_DELETE_FAIL,
  WORKER_LOG_IN,
  WORKER_LOG_IN_FAIL,
  WORKER_LOG_OUT,
  WORKER_LOG_OUT_FAIL,
  WORKER_UPDATE,
  WORKER_UPDATE_DONE,
  WORKER_UPDATE_FAIL,
  WORKER_UPDATE_FAILED_IS_ADMIN,
  WORKER_UPDATE_FAILED_IS_ADMIN_DONE,
} from "../constants/workerConstants";
import axios from "axios";
import { POPUP_IS_ON } from "../constants/popupConstants";
const apiAddress = process.env.REACT_APP_API_ADDRESS;

export const logInAction =
  ({ userName, password }) =>
    async (dispatch) => {
      try {
        const response = await axios.post(`${apiAddress}workers/loginWorker`, {
          userName,
          password,
        });

        if (response.status === 200 && response.data.message === "success") {
          const fullName = response.data.body.fullName;
          const isAdmin = response.data.body.isAdmin;
          const permission = response.data.body.permission;
          dispatch({
            type: WORKER_LOG_IN,
            payload: {
              fullName,
              userName,
              isAdmin,
              permission,
            },
          });
        } else {
          dispatch({
            type: WORKER_LOG_IN_FAIL,
            payload: "Username or Password is Incorrect",
          });
        }
      } catch (error) {
        dispatch({
          type: WORKER_LOG_IN_FAIL,
          payload:
            error.response && error.response.data.message
              ? error.response.data.message
              : error.message,
        });
      }
    };

export const logOutAction = () => (dispatch) => {
  try {
    dispatch({
      type: WORKER_LOG_OUT,
    });
  } catch (error) {
    dispatch({
      type: WORKER_LOG_OUT_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const deleteAction = (workerId) => async (dispatch) => {
  try {
    // fetch to somewhere just to delete the user and we will get response back, if the response will be confirmed, we will dispatch the payload(we need to send the workerId within the api url)

    let allUsers = await axios.post(`${apiAddress}workers/getWorkers`);

    if (allUsers.data.length < 2) {
      throw new Error(
        "This is a bad request, the system needs at least one user to exist!!"
      );
    }

    const { data } = await axios.delete(`${apiAddress}workers/${workerId}`);

    allUsers = await axios.post(`${apiAddress}workers/getWorkers`);

    if (allUsers.data.length === 1) {
      const fullName = allUsers.data[0].fullName;
      const userName = allUsers.data[0].userName;
      const isAdmin = true;
      const permission = {
        watchSubs: true,
        createSubs: true,
        updateSubs: true,
        deleteSubs: true,
        watchMovies: true,
        createMovies: true,
        updateMovies: true,
        deleteMovies: true,
      };
      await axios.put(`${apiAddress}workers/${allUsers.data[0]._id}`, {
        ...allUsers.data[0],
        permission,
      });
      dispatch({
        type: WORKER_LOG_IN,
        payload: {
          fullName,
          userName,
          isAdmin,
          permission,
        },
      });
    }

    dispatch({
      type: WORKER_DELETE,
      payload: data.message,
    });
  } catch (error) {
    dispatch({
      type: WORKER_DELETE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const updateAction = (value, workerId) => async (dispatch) => {
  try {
    // fetch to update the user and if everything is updated, we can procceed with dispatching the information next to the reducer...
    const response = await axios.post(`${apiAddress}workers/getWorkers`);
    if (response.data.length === 1 && !value.isAdmin) {
      dispatch({
        type: WORKER_UPDATE_FAILED_IS_ADMIN,
      });

      setTimeout(() => {
        dispatch({
          type: WORKER_UPDATE_FAILED_IS_ADMIN_DONE,
        });
      }, [2000]);
      throw new Error("Cannot change the only admin user!!");
    }
    if (
      value.isAdmin &&
      (!value.permission.watchSubs ||
        !value.permission.createSubs ||
        !value.permission.updateSubs ||
        !value.permission.deleteSubs ||
        !value.permission.watchMovies ||
        !value.permission.createMovies ||
        !value.permission.updateMovies ||
        !value.permission.deleteMovies)
    ) {
      value.permission = {
        watchSubs: true,
        createSubs: true,
        updateSubs: true,
        deleteSubs: true,
        watchMovies: true,
        createMovies: true,
        updateMovies: true,
        deleteMovies: true,
      };

      dispatch({
        type: POPUP_IS_ON,
        payload: "Admin user must have all permissions.",
      });
    }

    const res = await axios.put(`${apiAddress}workers/${workerId}`, value);

    if (res.status === 204) {
      dispatch({
        type: WORKER_UPDATE,
        payload: res.statusText ? res.statusText : res,
      });

      dispatch({
        type: POPUP_IS_ON,
        payload: "Worker updated successfully.",
      });

      setTimeout(() => {
        dispatch({
          type: WORKER_UPDATE_DONE,
        });
      }, [2000]);
    } else {
      throw new Error(res.data ? res.data : res);
    }
  } catch (error) {
    if (error.response.status === 405) {
      dispatch({
        type: POPUP_IS_ON,
        payload: "This username already exist.",
      });
    } else {
      dispatch({
        type: WORKER_UPDATE_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  }
};
