import { AnyAction } from "@reduxjs/toolkit";

interface Song {
    id: string
    isLiked: boolean
}
interface Queue {
    songs: Song[]
    playingSong: Song
    index: number
}

const initialState: Queue = {
    songs: [],
    playingSong: {
        id: "",
        isLiked: false
    },
    index: 0
}

const queueReducer = (state = initialState, action: AnyAction): Queue => {

    switch (action.type) {
        case 'loadQueue':
            return { ...state, songs: action.payload, playingSong: action.payload[0] }
        case 'playSong':
            return { ...state, playingSong: action.payload }
        case 'nextSong':
            if (state.index + 1 < state.songs.length) {
                return { ...state, index: state.index + 1, playingSong: state.songs[state.index + 1] }
            } else return state
        case 'previousSong':
            if (state.index - 1 > -1) {
                return { ...state, index: state.index - 1, playingSong: state.songs[state.index - 1] }
            } else return state


        case 'suffleQueue':
            var shuffledQueue = state.songs.sort(() => Math.random() - 0.5)
            return { ...state, songs: shuffledQueue }
        default:
            return state
    }

}

export default queueReducer;