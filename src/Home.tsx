import React from "react";
import "./styles/Home.css";
import { useAppDispatch } from "./app/hooks";
import { useState, useEffect } from "react";
import { useAppSelector } from "./app/hooks";
import { RootState } from "./app/store";
import { Link } from "react-router-dom";
import db from "./firebase";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import MusicNoteIcon from "@material-ui/icons/MusicNote";
function Home() {
  const dispatch = useAppDispatch();
  const userId = useAppSelector((state: RootState) => state.user.uid);
  const [playlists, setPlaylists] = useState<any>([]);
  const PlaylistItem = ({ likedTitles, id, name, img }) => {
    return (
      <Link
        to={likedTitles ? "/liked_title" : "/playlist"}
        style={{ textDecoration: "none" }}
        onClick={() =>
          dispatch({
            type: "loadPlaylist",
            payload: {
              id: id,
            },
          })
        }
      >
        <div className="home__playlistItem">
          {img ? (
            <img src={img} alt="" />
          ) : (
            <div className="home__playlistItemIcon">
              <MusicNoteIcon fontSize="small" />
            </div>
          )}
          <h3>{name}</h3>
          <button className="home__bestResultItem__play">
            <PlayArrowIcon />
          </button>
        </div>
      </Link>
    );
  };
  useEffect(() => {
    db.collection("users")
      .doc(userId)
      .collection("playlists")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        setPlaylists(
          snapshot.docs.map((doc) => {
            return {
              id: doc.id,
              data: doc.data(),
            };
          })
        );
      });
  }, [userId]);

  return (
    <div className="home">
      <h1>Welcome</h1>
      <div className="home__playlists">
        <PlaylistItem
          likedTitles={true}
          id=""
          name="Liked titles"
          img="https://t.scdn.co/images/3099b3803ad9496896c43f22fe9be8c4.png"
        />
        {playlists.map(({ id, data }) => {
          return (
            <PlaylistItem
              key={id}
              likedTitles={false}
              id={id}
              name={data.name}
              img={data.img}
            />
          );
        })}
      </div>
    </div>
  );
}

export default Home;
