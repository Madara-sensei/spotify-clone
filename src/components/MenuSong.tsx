import React from "react";
import { ContextMenu } from "react-contextmenu";
import "../styles/MenuSong.css";
import { Divider } from "@material-ui/core";
import ArrowRightIcon from "@material-ui/icons/ArrowRight";
import { useState, useEffect } from "react";
import { useAppSelector } from "../app/hooks";
import { RootState } from "../app/store";
import db from "../firebase";
import firebase from "firebase";
function MenuSong({ id, inAPlaylist ,update}) {
  const userId = useAppSelector((state: RootState) => state.user.uid);
  const [playlists, setPlaylists] = useState<any>([]);
  const playlistId = useAppSelector((state: RootState) => state.playlist.id);

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
      });
  }, [userId]);
  const addPlaylist = (playlistId) => {
    db.collection("users")
      .doc(userId)
      .collection("playlists")
      .doc(playlistId)
      .collection("playlist_songs")
      .doc(id)
      .set({
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      });
  };
  const delFromPlaylist = () => {
    db.collection("users")
      .doc(userId)
      .collection("playlists")
      .doc(playlistId)
      .collection("playlist_songs")
      .doc(id)
      .delete();

    update(true)
  };
  return (
    <ContextMenu id={id}>
      <div className="menuSong">
        <div className="menuSong__contextMenu">
          <ul>
            <li>
              <button>Add the listening queue</button>
            </li>
            <Divider light />
            <li>
              <button> Radio related to the song </button>
            </li>
            <li>
              <button> See the album </button>
            </li>
            <li>
              <button> See the artist </button>
            </li>

            <li>
              <button> Show credit</button>
            </li>
            <Divider light />
            <li>
              <button> Delete from liked songs </button>
            </li>

            <li className="playlist__menu">
              <button> Add to the playlist</button>
              <ArrowRightIcon />
            </li>

            <li>
              <button onClick={delFromPlaylist}>
                {" "}
                Remove from this playlist
              </button>
            </li>

            <li>
              <button> Share </button>
              <ArrowRightIcon />
            </li>
            <Divider light />
            <li>
              <button>Open the PC App</button>
            </li>
          </ul>
        </div>

        <div className="playlist__items">
          {playlists.map(({ id, playlist }) => {
            return (
              <div key={id} className="playlist__name">
                <button onClick={() => addPlaylist(id)}>
                  {" "}
                  {playlist.name}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </ContextMenu>
  );
}

export default MenuSong;
