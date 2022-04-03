import { useState, useEffect } from "react";
import "./styles/Playlist.css";
import "./styles/EditPopup.css";
import { Avatar } from "@material-ui/core";
import ScheduleIcon from "@material-ui/icons/Schedule";
import SongItem from "./components/SongItem";
import { Divider } from "@material-ui/core";
import { useAppSelector, useAppDispatch } from "./app/hooks";
import { RootState } from "./app/store";
import db from "./firebase";
import MusicNoteIcon from "@material-ui/icons/MusicNote";
import Dialog from "@material-ui/core/Dialog";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import CloseIcon from "@material-ui/icons/Close";

interface Props {
  isTheLikePage: boolean;
}

const Playlist: React.FC<Props> = ({ isTheLikePage }) => {
  const dispatch = useAppDispatch();
  const [songs, setSongs] = useState<any>([]);
  const [songsNumber, setsongsNumber] = useState<number>(0);
  const user = useAppSelector((state: RootState) => state.user);
  const [popup, setPopup] = useState<boolean>(false);
  const playlistId = useAppSelector((state: RootState) => state.playlist.id);
  const [playlist, setPlaylist] = useState<any>([]);
  const [playlistImg, setplaylistImg] = useState<string>("");
  const [update, setUpdate] = useState<boolean>(false);
  const handlePopup = () => {
    setPopup(false);
  };

  function EditPopup({ open, playlist, handlePopup, playlistId, userId }) {
    const [name, setName] = useState<string>(playlist.name);
    const [description, setDescription] = useState<string>(
      playlist?.description
    );

    const updatePlaylist = () => {
      db.collection("users")
        .doc(userId)
        .collection("playlists")
        .doc(playlistId)
        .update({
          name: name,
          description: description,
        });
      handlePopup();
    };

    return (
      <Dialog open={open} onClose={handlePopup}>
        <div className="editPopup">
          <div className="editPopup__title">
            <h2>Edit Details</h2>
            <CloseIcon onClick={handlePopup} />
          </div>
          {console.log(playlist)}
          <div className="editPopup__form">
            <div className="editPopup__img">
              {playlist.img ? (
                <img src={playlist.img} alt="" />
              ) : (
                <MusicNoteIcon fontSize="large" />
              )}
            </div>
            <div className="editPopup__inputs">
              <div className="editPopup__inputName">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="editPopup__inputDescription">
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="editPopup__save">
            <button type="submit" onClick={updatePlaylist}>
              {" "}
              Save{" "}
            </button>
          </div>
          <div className="editPopup__options">
            <p>
              By continuing, you grant Spotify the rights to the image you
              decide to upload. Make sure you have the right to upload this
              image.
            </p>
          </div>
        </div>
      </Dialog>
    );
  }

  useEffect(() => {
   
    if (playlistId && playlistImg !== "") {
      db.collection("users")
        .doc(user.uid)
        .collection("playlists")
        .doc(playlistId)
        .update({
          img: playlistImg,
        });
    }
    if (isTheLikePage) {
      setSongs([]);
      db.collection("users")
        .doc(user.uid)
        .collection("liked_songs")
        .orderBy("timestamp", "desc")
        .onSnapshot((snapshot) => {
          setsongsNumber(snapshot.size);
          snapshot.docs.forEach((doc) => {
            db.collection("songs")
              .doc(doc.id)
              .get()
              .then((result) => {

                setSongs((songs) => [
                  ...songs,
                  {
                    id: doc.id,
                    data: result.data(),
                    timestamp: new Date(
                      doc.data().timestamp?.toDate()
                    ).toDateString(),
                  },
                ]);
              });
          });
        });
    } else if (playlistId) {
      setSongs([]);
      setplaylistImg("");
      db.collection("users")
        .doc(user.uid)
        .collection("playlists")
        .doc(playlistId)
        .get()
        .then((doc) => {
           setPlaylist(doc.data());
        });
      db.collection("users")
        .doc(user.uid)
        .collection("playlists")
        .doc(playlistId)
        .collection("playlist_songs")
        .orderBy("timestamp", "desc")
        .onSnapshot((snapshot) => {
          setsongsNumber(snapshot.size);

          snapshot.docs.forEach((doc, index) => {
            db.collection("songs")
              .doc(doc.id)
              .get()
              .then((result) => {
                if (index === 0) {
                  setplaylistImg(result?.data()?.img);
                }
                setSongs((songs) => [
                  ...songs,
                  {
                    id: doc.id,
                    data: result.data(),
                    timestamp: new Date(
                      doc.data().timestamp?.toDate()
                    ).toDateString(),
                  },
                ]);
              });
          });
        });
    }

  }, [user, playlistId, isTheLikePage,update]);



  const loadPlaylist = () => {
    if (songs) {
      var songsQueue = songs.map(({ id }) => {
        return { id: id, isLiked: true };
      });
      console.log(songsQueue);

      dispatch({
        type: "loadQueue",
        payload: songsQueue,
      });
    }
  };

  return (
    <div className="playlist">
      <div
        className={isTheLikePage ? "likedTitles__header" : "playlist__header"}
      >
        {isTheLikePage ? (
          <img
            src="https://t.scdn.co/images/3099b3803ad9496896c43f22fe9be8c4.png"
            alt=""
          />
        ) : (
          <div className="playlist__img">
            {" "}
            {playlistImg ? (
              <img src={playlistImg} alt="" />
            ) : (
              <MusicNoteIcon fontSize="large" />
            )}
          </div>
        )}
        <div className="likedTitles__headerText">
          <p>Playlist</p>
          {isTheLikePage ? (
            <h1>Liked Titles</h1>
          ) : (
            <>
              <h1 onClick={() => setPopup(true)}> {playlist.name}</h1>
              <EditPopup
                handlePopup={handlePopup}
                open={popup}
                playlist={playlist}
                playlistId={playlistId}
                userId={user.uid}
              />
            </>
          )}
          <div className="likedTitles__profile">
            <span>
              {isTheLikePage && <Avatar src={user.photo} />}
              {user.name}
            </span>

            <p>.{songsNumber} titles</p>
          </div>
        </div>
      </div>

      <div className="likedTitles__songsPlaylist">
        <div className="likedTitles__playButton">
          <button onClick={loadPlaylist}>
            <PlayArrowIcon fontSize="large" />
          </button>
        </div>
        <div className="likedTitles__columnsHeader">
          <p># Title</p>
          <p>Album</p>
          <p>Added the</p>
          <ScheduleIcon />
        </div>

        <Divider />
        <div className="likedTitles__songs">
          {songs &&
            songs.map(({ id, data, timestamp }, index) => {
              return (
                <SongItem
                  key={id}
                  setSongs={setSongs}
                  isInTheLikedSongs={true}
                  order={index + 1}
                  id={id}
                  name={data.name}
                  album={data.album}
                  added={timestamp}
                  artist={data.artist}
                  img={data.img}
                  duration={data.duration}
                  update={(val)=>setUpdate(val)}
                />
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default Playlist;
