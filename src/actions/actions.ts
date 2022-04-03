



import { useAppSelector } from '../app/hooks';
import { RootState } from '../app/store';
import db from '../firebase';
import firebase from 'firebase'
import { useAppDispatch } from '../app/hooks';

const userId = useAppSelector((state: RootState) => state.user.uid);
const playlistId = useAppSelector((state: RootState) => state.playlist.id);
const dispatch = useAppDispatch();

export const addPlaylist = (playlistId, id) => {
    db.collection("users").doc(userId).collection("playlists").doc(playlistId).collection("playlist_songs").doc(id).set({
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    })

}

export const updatePlaylist = (name, description, img) => {
    db.collection("users").doc(userId).collection("playlists").doc(playlistId).update({
        name: name,
        description: description,
        img: img

    })
}

export const delFromPlaylist = (id) => {
    db.collection("users").doc(userId).collection("playlists").doc(playlistId).collection("playlist_songs").doc(id).delete()

}


export const addLikedSong = (id) => {

    db.collection("users").doc(userId).collection("liked_songs").doc(id).set({
        timestamp: firebase.firestore.FieldValue.serverTimestamp()

    })
}
export const delLikedSong = (id) => {

    db.collection("users").doc(userId).collection("liked_songs").doc(id).delete()
}

export const isLiked = (id) => {
    db.collection("users").doc(userId).collection("liked_songs").doc(id).get().then((result) => {
        if (result) {
            return true
        }
        return false
    })
}

export const playSong = (id) => {
    dispatch({
        type: 'playSong',
        payload: {
            id: id,


        }
    })
}