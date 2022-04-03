import React from "react";
import FavoriteIcon from "@material-ui/icons/Favorite";
import "../styles/LikedSongItem.css";
import "../styles/SongItem.css";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import db from "../firebase";
import { useAppSelector } from "../app/hooks";
import { RootState } from "../app/store";
import firebase from "firebase";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import { useAppDispatch } from "../app/hooks";
import { useState, useEffect } from "react";
import MenuSong from "./MenuSong";
import { ContextMenuTrigger } from "react-contextmenu";

interface Props {
  setSongs?: any;
  isInTheLikedSongs: boolean;
  order?: number;
  img: string;
  artist: string;
  name: string;
  album?: string;
  added?: string;
  duration: string;
  id: string;
  update?:(val:any)=>void;
}

const SongItem: React.FC<Props> = ({
  setSongs,
  isInTheLikedSongs,
  id,
  order,
  img,
  artist,
  album,
  added,
  name,
  duration,
  update
}) => {
  const dispatch = useAppDispatch();
  const userId = useAppSelector((state: RootState) => state.user.uid);
  const [isLiked, setisLiked] = useState<boolean>(false);
  const addSong = () => {
    setisLiked(true);
    db.collection("users").doc(userId).collection("liked_songs").doc(id).set({
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });
  };
  const delSong = () => {
    setisLiked(false);
    db.collection("users")
      .doc(userId)
      .collection("liked_songs")
      .doc(id)
      .delete();
    if (isInTheLikedSongs) {
      setSongs([]);
    }
  };
  const playSong = () => {
    dispatch({
      type: "playSong",
      payload: {
        id: id,
        isLiked: isInTheLikedSongs,
      },
    });
  };
  useEffect(() => {
    db.collection("users")
      .doc(userId)
      .collection("liked_songs")
      .doc(id)
      .get()
      .then((docSnapshot) => {
        if (docSnapshot.exists) {
          setisLiked(true);
        } else setisLiked(false);
      });
  }, [isLiked, id, userId]);

  if (isInTheLikedSongs) {
    return (
      <ContextMenuTrigger id={id}>
        <div className="likedSongItem">
          <div className="likedSongItem__info">
            <PlayArrowIcon onClick={playSong} />
            <p>{order}</p>
            <img src={img} alt="" />
            <div className="likedSongItem__title">
              <h4>{name}</h4>
              <p>{artist}</p>
            </div>
          </div>
          <p>{album}</p>
          <p>{added}</p>
          <div className="likedSongItem__options">
            {isLiked ? (
              <div className="songItem__like">
                <FavoriteIcon fontSize="small" onClick={delSong} />
              </div>
            ) : (
              <div className="songItem__unlike">
                <FavoriteBorderIcon fontSize="small" onClick={addSong} />
              </div>
            )}
            <p>{duration}</p>
            <div className="likedSongItem__moreOptions">
              <MoreHorizIcon />
            </div>
          </div>
          <MenuSong id={id} inAPlaylist={false} update={update}/>
        </div>
      </ContextMenuTrigger>
    );
  } else {
    return (
      <ContextMenuTrigger id={id}>
        <div className="songItem">
          <div className="songItem__info">
            <img src={img} alt="" />
            <div className="songItem__title">
              <h4>{name}</h4>
              <p>{artist}</p>
            </div>
          </div>

          <div className="songItem__options">
            {isLiked ? (
              <div className="songItem__like">
                <FavoriteIcon fontSize="small" onClick={delSong} />
              </div>
            ) : (
              <div className="songItem__unlike">
                <FavoriteBorderIcon fontSize="small" onClick={addSong} />
              </div>
            )}

            <p>{duration}</p>
            <MoreHorizIcon fontSize="small" />
          </div>
          <MenuSong id={id} inAPlaylist={false} update={update} />
        </div>
      </ContextMenuTrigger>
    );
  }
};

export default SongItem;
