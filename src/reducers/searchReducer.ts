
import { AnyAction } from "@reduxjs/toolkit";


interface Input {
    input: string
}
const initialState: Input = {
    input: "",
}


const searchReducer = (state = initialState, action: AnyAction): Input => {
    switch (action.type) {
        case 'setInput':
            return state = action.payload
        case 'clearInput':
            return state = initialState
        default:
            return state
    }

}

export default searchReducer;