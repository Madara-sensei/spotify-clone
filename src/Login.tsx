import React from 'react'
import { Button } from '@material-ui/core'
import './styles/Login.css'
import { useAppDispatch } from './app/hooks'
import {auth,googleProvider} from './firebase'
import db from './firebase'


function Login() {
    const dispatch = useAppDispatch();
 
    const signIn= (e  :React.FormEvent<HTMLButtonElement>)=>{
        e.preventDefault();
            auth.signInWithPopup(googleProvider).then(
                (result)=>{
                   const user = result?.user
                   db.collection("users").doc(user?.uid).set({
                     
                       name : user?.displayName,
                       email : user?.email,
                       photo : user?.photoURL

                   })
                dispatch(
                    {
                        type :"login",
                        payload : {
                            uid : user?.uid,
                            name : user?.displayName,
                            email : user?.email,
                            photo : user?.photoURL
                        }
                    }
                )
                }
              
            )
    
                
        }
    return (
        <div className="login">
            <img src="https://logos-marques.com/wp-content/uploads/2021/03/Spotify-Logo.png" alt="" />

            <Button onClick={signIn}>  Connect with Google </Button>
        </div>
    )
}

export default Login
