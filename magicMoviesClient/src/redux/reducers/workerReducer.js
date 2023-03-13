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

const initialWorkerState = {
  fullName: "",
  userName: "",
  userIsAdmin: false,
  userLogin: false,
  userLogout: true,
  userUpdate: false,
  userUpdateFailed: false,
  userDelete: 0,
  updateSomething: 0,
  message: "",
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
};

export default function workerReducer(state = initialWorkerState, action) {
  switch (action.type) {
    case WORKER_LOG_IN: {
      const newState = { ...state };
      newState.userLogin = true;
      newState.userLogout = false;
      newState.message = "";
      newState.userIsAdmin = action.payload.isAdmin;
      newState.userName = action.payload.userName;
      newState.fullName = action.payload.fullName;
      newState.permission = action.payload.permission;
      newState.userUpdate = false;
      localStorage.setItem("workerInfo", JSON.stringify({ ...newState }));
      return newState;
    }

    case WORKER_LOG_IN_FAIL: {
      const newState = { ...state };
      newState.message = action.payload;
      return newState;
    }

    case WORKER_LOG_OUT: {
      const newState = { ...state };
      newState.userLogin = false;
      newState.userLogout = true;
      localStorage.removeItem("workerInfo");
      return newState;
    }

    case WORKER_LOG_OUT_FAIL: {
      console.log("Reducer says: log out failed");
      return state;
    }

    case WORKER_DELETE: {
      const newState = { ...state };
      newState.userDelete += 1;
      return newState;
    }

    case WORKER_DELETE_FAIL: {
      console.log(
        "Reducer says: worker deletion failed, The Error: ",
        action.payload
      );
      return state;
    }

    case WORKER_UPDATE: {
      const newState = { ...state };
      newState.userUpdate = true;
      localStorage.setItem("workerInfo", JSON.stringify({ ...newState }));
      return newState;
    }

    case WORKER_UPDATE_DONE: {
      const newState = { ...state };
      newState.userUpdate = false;
      localStorage.setItem("workerInfo", JSON.stringify({ ...newState }));
      return newState;
    }

    case WORKER_UPDATE_FAIL: {
      console.log("Reducer says: worker updating failed..");
      console.log("Error: ", action.payload);
      return state;
    }

    case WORKER_UPDATE_FAILED_IS_ADMIN: {
      const newState = { ...state };
      newState.userUpdateFailed = true;
      return newState;
    }

    case WORKER_UPDATE_FAILED_IS_ADMIN_DONE: {
      const newState = { ...state };
      newState.userUpdateFailed = false;
      return newState;
    }

    default:
      return state;
  }
}