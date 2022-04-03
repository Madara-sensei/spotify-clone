import React from "react";
import "./styles/Playbar.css";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import AirplayIcon from "@material-ui/icons/Airplay";
import VolumeUpOutlinedIcon from "@material-ui/icons/VolumeUpOutlined";
import DesktopMacOutlinedIcon from "@material-ui/icons/DesktopMacOutlined";
import QueueMusicOutlinedIcon from "@material-ui/icons/QueueMusicOutlined";
import PlayCircleFilledIcon from "@material-ui/icons/PlayCircleFilled";
import SkipNextIcon from "@material-ui/icons/SkipNext";
import SkipPreviousIcon from "@material-ui/icons/SkipPrevious";
import LoopIcon from "@material-ui/icons/Loop";
import ShuffleIcon from "@material-ui/icons/Shuffle";
import { useAppSelector } from "./app/hooks";
import { RootState } from "./app/store";
import { useState, useEffect } from "react";
import { Slider } from "@material-ui/core";
import db from "./firebase";
import { useAppDispatch } from "./app/hooks";
import PauseCircleFilledIcon from "@material-ui/icons/PauseCircleFilled";
function Playbar() {
  const dispatch = useAppDispatch();
  const [songTime, setsongTime] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isShuffled, setIsShuffled] = useState<boolean>(false);
  const [song, setSong] = useState<any>({
    id: "",
    data: {
      img: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOAAAADhCAMAAADmr0l2AAAAA1BMVEUBAQHIpFY6AAAASElEQVR4nO3BMQEAAADCoPVPbQdvoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABOA8XBAAGwGMP0AAAAAElFTkSuQmCC",
      name: "",
      duration: "",
      artist: "",
      album: "",
    },
  });

  const songId = useAppSelector(
    (state: RootState) => state.queue.playingSong.id
  );
  const isLiked = useAppSelector(
    (state: RootState) => state.queue.playingSong.isLiked
  );
  const handleSongTime = (event, value) => {
    setsongTime(value);
  };

  useEffect(() => {
    if (songId) {
      db.collection("songs")
        .doc(songId)
        .get()
        .then((doc) => {
          setSong({
            id: doc.id,
            data: doc.data(),
          });
        });
    }
  }, [songId]);

  const previousSong = () => {
    dispatch({ type: "previousSong" });
  };
  const nextSong = () => {
    dispatch({ type: "nextSong" });
  };
  const shuffleQueue = () => {
    dispatch({ type: "shuffleQueue" });
  };
  return (
    <div className="playbar">
      <div className="playbar__info">
        <img src={song.data.img} alt="" />
        <div className="playbar__title">
          <h4>{song.data.name}</h4>
          <p>{song.data.artist}</p>
        </div>
        <div className="playbar__infoButtons">
          {isLiked ? <FavoriteBorderIcon fontSize="small" /> : null}

          <AirplayIcon fontSize="small" />
        </div>
      </div>
      <div className="playbar__actions">
        <div className="playbar__actionsButtons">
          <button onClick={() => setIsShuffled(!isShuffled)}>
            <ShuffleIcon
              onClick={shuffleQueue}
              className={isShuffled ? "playbar__actionsButtons__Shuffle" : ""}
            />
          </button>
          <SkipPreviousIcon onClick={previousSong} fontSize="large" />
          {isPlaying ? (
            <button onClick={() => setIsPlaying(false)}>
              <PauseCircleFilledIcon fontSize="large" />
            </button>
          ) : (
            <button onClick={() => setIsPlaying(true)}>
              <PlayCircleFilledIcon fontSize="large" />
            </button>
          )}

          <SkipNextIcon onClick={nextSong} fontSize="large" />
          <LoopIcon />
        </div>
        <div className="playbar__time">
          <p>{songTime.toString()}</p>
          <Slider value={songTime} onChange={handleSongTime} />
          <p>{song.data.duration}</p>
        </div>
      </div>
      <div className="playbar__options">
        <QueueMusicOutlinedIcon fontSize="small" />
        <DesktopMacOutlinedIcon fontSize="small" />
        <VolumeUpOutlinedIcon fontSize="small" />
        <Slider />
      </div>
    </div>
  );
}

export default Playbar;
