
import { AnyAction } from "@reduxjs/toolkit";


interface Playlist {
    id: string
}
const initialState: Playlist = {
    id: "",
}
const playlistReducer = (state = initialState, action: AnyAction): Playlist => {
    switch (action.type) {
        case 'loadPlaylist':
            return state = action.payload
        default:
            return state
    }

}

export default playlistReducer;