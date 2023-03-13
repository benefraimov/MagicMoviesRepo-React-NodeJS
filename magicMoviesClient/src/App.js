import { BrowserRouter, Routes, Route } from "react-router-dom";

// Imported Components For Routers

// Movies
import AllMovies from "./components/Movies/AllMovies";
import MoviePage from "./components/Movies/MoviePage";
import EditMovie from "./components/Movies/EditMovie";
import AddMovie from "./components/Movies/AddMovie";

// Subscriptions
import AllSubscriptions from "./components/Subscriptions/AllSubscriptions";
import SubscriberPage from "./components/Subscriptions/SubscriberPage";
import EditSubscription from "./components/Subscriptions/EditSubscription";
import CreateSubscription from "./components/Subscriptions/CreateSubscription";

// Workers
import AllWorkers from "./components/Workers/AllWorkers";
import WorkerPage from "./components/Workers/WorkerPage";
import EditWorker from "./components/Workers/EditWorker";
import CreateWorker from "./components/Workers/CreateWorker";

// Sign In
import SignIn from "./components/SignIn/SignIn";

// Menu
import Menu from "./components/Menu/Menu";

// No Match Comp
import NoMatch from "./components/No Match/NoMatch";
import Popup from "./components/Popup/Popup";

function App() {
  return (
    <>
      <BrowserRouter>
        <Popup />
        {/* Main Menu for movies, subscriptions, workers, logout */}
        <Menu />
        <Routes>
          {/* First loading page: SignIn */}
          <Route index element={<SignIn />} />
          {/* movies routers */}
          {/* AllMovies, Movie, EditMovie, AddMovie */}
          <Route path="movies/allmovies" element={<AllMovies />} />
          <Route path="movies/movie/:movieId" element={<MoviePage />} />
          <Route path="movies/editmovie/:movieId" element={<EditMovie />} />
          <Route path="movies/addmovie" element={<AddMovie />} />
          {/* subscriptions routers */}
          {/* AllSubscriptions, Subscription, EditSubscription, CreateSubscription */}
          <Route
            path="subscriptions/allsubscriptions"
            element={<AllSubscriptions />}
          />
          <Route
            path="subscriptions/subscription/:subscriberId"
            element={<SubscriberPage />}
          />
          <Route
            path="subscriptions/editsubscription/:subscriberId"
            element={<EditSubscription />}
          />
          <Route
            path="subscriptions/createsubscription"
            element={<CreateSubscription />}
          />
          {/* workers routers */}
          {/* AllWorkers, Worker, EditWorker, CreateWorker */}
          <Route path="workers/allworkers" element={<AllWorkers />} />
          <Route path="workers/worker/:workerId" element={<WorkerPage />} />
          <Route path="workers/editworker/:workerId" element={<EditWorker />} />
          <Route path="workers/createworker" element={<CreateWorker />} />
          {/* undefined router: redirect to NoMatch Comp */}
          <Route path="*" element={<NoMatch />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
