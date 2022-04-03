import React from "react";
import "./styles/App.css";
import Sidebar from "./Sidebar";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Home from "./Home";
import Navbar from "./Navbar";
import Search from "./Search";
import Playlist from "./Playlist";
import Playbar from "./Playbar";
import Login from "./Login";
import { useAppSelector } from "./app/hooks";
import { useEffect } from "react";
import { RootState } from "./app/store";
import { auth } from "./firebase";
import { useAppDispatch } from "./app/hooks";
import Library from "./Library";
function App() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state: RootState) => state.user);

  useEffect(() => {
    auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        dispatch({
          type: "login",
          payload: {
            uid: authUser.uid,
            photo: authUser.photoURL,
            email: authUser.email,
            name: authUser.displayName,
          },
        });
      } else {
        dispatch({
          type: "logout",
        });
      }
    });
  }, [dispatch]);

  return (
    <div className="app">
      <Router>
        {user.email !== "" ? (
          <>
            <Sidebar />
            <Navbar />
            <Playbar />
            <Switch>
              <Route exact path="/">
                <Home />
              </Route>
              <Route path="/search">
                <Search />
              </Route>
              <Route path="/library">
                <Library />
              </Route>
              <Route path="/liked_title">
                {" "}
                <Playlist isTheLikePage={true} />{" "}
              </Route>
              <Route path="/playlist">
                <Playlist isTheLikePage={false} />
              </Route>
            </Switch>
          </>
        ) : (
          <Login />
        )}
      </Router>
    </div>
  );
}

export default App;
