import React, { useState } from 'react'
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import {v4 as uuidV4} from 'uuid';

const Home = () => {
    const [roomId, setRoomId] = useState('');
    const [username, setUsername] = useState('');
    const navigate = useNavigate();

    const createNewRoom = (e) => {
        e.preventDefault();
        const id = uuidV4();
        setRoomId(id);
        toast.success('Created a new room');
    }

    const joinRoom = () => {
        if(!roomId || !username) {
            toast.error('Room Id & Username are required');
            return;
        }

        navigate(`/editor/${roomId}`, {
            state: {
                username,
            }
        });
    }

    const handleInputEnter = (e) => {
        if(e.code === 'Enter') {
            joinRoom();
        }
    }
    return (
        <div className='homePageWrapper'>
            <div className="formWrapper">
                <img className='homePageLogo' src="/codeLogo.png" alt="" />
                <h4 className="mainLabel">Paste Invitation Room Id</h4>

                <div className="inputGroup">
                    <input type="text" onChange={(e) => setRoomId(e.target.value)} onKeyUp={(e) => handleInputEnter(e)} value={roomId} className='inputBox' placeholder='ROOM ID' />
                    <input type="text" onChange={(e) => setUsername(e.target.value)} onKeyUp={(e) => handleInputEnter(e)} value={username} className='inputBox' placeholder='USERNAME' />
                    <button onClick={() => joinRoom()} className='btn joinBtn'>Join</button>
                    <span className='createInfo'>
                        If you don't have an invite then create &nbsp;
                        <a onClick={(e) => createNewRoom(e)} href="" className='createNewBtn'>new room</a>
                    </span>
                </div>

            </div>

            <footer>
                <h4>Built with ❤️ by &nbsp; <a href="https://linkedin.com/in/sarthakshukla1316" target="_blank">Sarthak Shukla</a></h4>
            </footer>
        </div>
    )
}

export default Home