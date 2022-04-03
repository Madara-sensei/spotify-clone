import React from "react";
import "./styles/Sidebar.css";
import HomeIcon from "@material-ui/icons/Home";
import SearchIcon from "@material-ui/icons/Search";
import BookIcon from "@material-ui/icons/Book";
import AddBoxIcon from "@material-ui/icons/AddBox";
import db from "./firebase";
import { useAppSelector } from "./app/hooks";
import { RootState } from "./app/store";
import firebase from "firebase";
import { useState, useEffect } from "react";
import { useAppDispatch } from "./app/hooks";
import { Link } from "react-router-dom";
import MenuPlaylist from "./components/MenuPlaylist";
import { ContextMenuTrigger } from "react-contextmenu";
function Sidebar() {
  const userId = useAppSelector((state: RootState) => state.user.uid);
  const [playlists, setPlaylists] = useState<any>([]);
  const [playlistIndex, setplaylistIndex] = useState<number>(0);
  const dispatch = useAppDispatch();
  interface PlaylistProps {
    name: string;
    id: string;
  }
  const PlaylistItem: React.FC<PlaylistProps> = ({ id, name }) => {
    const loadPlaylist = () => {
      dispatch({
        type: "loadPlaylist",
        payload: {
          id: id,
        },
      });
    };
    return (
      <ContextMenuTrigger id={id}>
        <div className="playlistItem">
          <Link to="/playlist" onClick={loadPlaylist}>
            <h4>{name}</h4>
          </Link>
          <MenuPlaylist id={id} />
        </div>
      </ContextMenuTrigger>
    );
  };

  useEffect(() => {
    db.collection("users")
      .doc(userId)
      .collection("playlists")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        setPlaylists(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            playlist: doc.data(),
          }))
        );
        setplaylistIndex(snapshot.size);
      });
  }, [userId]);

  const createPlaylist = () => {
    db.collection("users")
      .doc(userId)
      .collection("playlists")
      .add({
        name: "Playlist n°" + playlistIndex,
        description: "",
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        img: "",
      })
      .then((docRef) => {
        dispatch({
          type: "loadPlaylist",
          payload: {
            id: docRef.id,
          },
        });
      });
  };
  return (
    <div className="sidebar">
      <img
        src="https://storage.googleapis.com/pr-newsroom-wp/1/2018/11/Spotify_Logo_RGB_White.png"
        alt=""
      />

      <div className="sidebar__navbar">
        <nav>
          <ul>
            <li>
              <Link to="/">
                <HomeIcon />
                <span>Home</span>
              </Link>
            </li>

            <li>
              <Link to="/search">
                <SearchIcon />
                <span>Search</span>
              </Link>
            </li>
            <li>
              <Link to="/library">
                <BookIcon />
                <span>Library</span>
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      <div className="sidebar__actions">
        <Link to="/playlist" onClick={createPlaylist}>
          <AddBoxIcon />
          <h4>Create a playlist</h4>
        </Link>
        <Link to="/liked_title">
          <img
            src="https://t.scdn.co/images/3099b3803ad9496896c43f22fe9be8c4.png"
            alt=""
          />
          <h4>Liked Title</h4>
        </Link>
      </div>

      <div className="sidebar__playlists">
        {playlists.map(({ id, playlist }) => {
          return <PlaylistItem key={id} name={playlist.name} id={id} />;
        })}
      </div>
    </div>
  );
}

export default Sidebar;
