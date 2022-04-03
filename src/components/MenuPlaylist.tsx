import React from "react";
import { ContextMenu } from "react-contextmenu";
import "../styles/MenuSong.css";
import { Divider } from "@material-ui/core";
import ArrowRightIcon from "@material-ui/icons/ArrowRight";
import { useAppSelector } from "../app/hooks";
import { RootState } from "../app/store";
import db from "../firebase";

function MenuSong({ id }) {
  const userId = useAppSelector((state: RootState) => state.user.uid);
  const deletePlaylist = () => {
    db.collection("users").doc(userId).collection("playlists").doc(id).delete();
  };
  return (
    <ContextMenu id={id}>
      <div className="menuSong__contextMenu">
        <ul>
          <li>
            <button>Add the listening queue</button>
          </li>
          <li>
            <button>Play the radio related to the playlist </button>
          </li>
          <li>
            <button>Add to the profile</button>
          </li>
          <Divider light />
          <li>
            <button>Edit detail</button>
          </li>

          <li>
            <button onClick={deletePlaylist}>Delete</button>
          </li>
          <Divider light />
          <li className="playlist__menu">
            <button>Create playlist</button>
          </li>
          <li>
            <button>Create Folder</button>
          </li>
          <Divider light />
          <li>
            <button> Share </button>
            <ArrowRightIcon />
          </li>
        </ul>
      </div>
    </ContextMenu>
  );
}

export default MenuSong;
