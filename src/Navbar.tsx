import React from 'react'
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import SearchIcon from '@material-ui/icons/Search';
import { Avatar } from '@material-ui/core';
import ClearIcon from '@material-ui/icons/Clear';
import './styles/Navbar.css'
import { useAppDispatch, useAppSelector } from './app/hooks';
import { RootState } from './app/store';
function Navbar() {
    const user = useAppSelector((state: RootState) => state.user);
    const input = useAppSelector((state: RootState) => state.search.input);
    const dispatch = useAppDispatch();


    return (
        <div className="navbar">
                <div className="navbar__left">
                <div className="navbar__arrows">
                 
                        <NavigateBeforeIcon/>
                        <NavigateNextIcon />
                   
                </div>
                <div className="navbar__search">
                    
                    <SearchIcon/>
                    <input  value={input} onChange={ (e)=> dispatch({
                        type:"setInput",
                        payload:{
                            input : e.target.value
                        }

                    })} type="text" placeholder="Search a song , an artist or a podcast" />
                    {
                        input.length > 0 &&
                        <ClearIcon onClick={()=> dispatch({
                            type:"clearInput"
                        })} />
                    }
                   
                   
             
                </div>
                </div>
                <div className="navbar__subscribe">
                    <button>
                        Subscribe
                    </button>
                </div>
                <div className="navbar__profile">
                    <button onClick={()=>dispatch({type:"logout"})}>   
                        <Avatar src={user.photo}/> 
                        <span>{user.name}</span>
                        <ArrowDropDownIcon/>
                    </button>
                </div>
        </div>
    )
}

export default Navbar
