
import { AnyAction } from "@reduxjs/toolkit";

const initialState: LoginState = {
    uid: "",
    name: "",
    email: "",
    photo: ""

}
interface LoginState {
    uid: string
    name: string
    email: string
    photo: string


}


const userReducer = (state: LoginState = initialState, action: AnyAction): LoginState => {
    switch (action.type) {
        case 'login': {
            return state = action.payload

        }
        case 'logout':
            return state = initialState

        default:
            return state;
    }

}




export default userReducer;