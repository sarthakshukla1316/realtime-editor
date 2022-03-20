import React, { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast';
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom';
import ACTIONS from '../Actions';
import { initSocket } from '../socket';
import Client from '../components/Client';
import Editor from '../components/Editor';

const EditorPage = () => {
    const socketRef = useRef(null);
    const codeRef = useRef(null);
    const location = useLocation();
    const { roomId } = useParams();
    const reactNavigator = useNavigate();

    const [clients, setClients] = useState([]);

    useEffect(() => {
      const init = async () => {
        socketRef.current = await initSocket();
        socketRef.current.on('connect_error', (err) => handleErrors(err));
        socketRef.current.on('connect_failed', (err) => handleErrors(err));

        const handleErrors = (e) => {
            console.log('Socket err', e);
            toast.error('Socket connection failed, try again later.');
            reactNavigator('/');
        }

        // JOIN client
        socketRef.current.emit(ACTIONS.JOIN, {
            roomId,
            username: location.state?.username
        });

        // Listening for JOINED event
        socketRef.current.on(ACTIONS.JOINED, ({ clients, username, socketId }) => {
            if(username !== location.state?.username) {
                toast.success(`${username} joined the room.`);
                console.log(`${username} joined the room.`);
            }
            setClients(clients);
            socketRef.current.emit(ACTIONS.SYNC_CODE, {
                code: codeRef.current,
                socketId,
            });
        });

        // Listening for disconnected
        socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId, username }) => {
            toast.success(`${username} left the room`);
            setClients((prev) => {
                return prev.filter(client => client.socketId !== socketId);
            })
        })
      };
      init();
      return () => {
          socketRef.current.disconnect();
          socketRef.current.off(ACTIONS.JOINED);
          socketRef.current.off(ACTIONS.DISCONNECTED);
      }
    }, []);

    const copyRoomId = async () => {
        try {
            await navigator.clipboard.writeText(roomId);
            toast.success('Room Id copied to clipboard');
        } catch(err) {
            toast.error('Failed in copying Room Id');
            console.log(err);
        }
    }

    const leaveRoom = () => {
        reactNavigator('/');
    }

    if(!location.state) {
        <Navigate to='/' />
    }

    return (
        <div className='mainWrap'>
            <div className="aside">
                <div className="asideInner">
                    <div className="logo">
                        <img src="/codeLogo.png" className='logoImage' alt="logo" />
                    </div>
                    <h3>Connected</h3>
                    <div className="clientsList">
                        {
                            clients?.map(client => (
                                <Client key={client.socketId} username={client.username} />
                            ))
                        }
                    </div>
                </div>

                <button className='btn copyBtn' onClick={() => copyRoomId()}>Copy ROOM ID</button>
                <button className='btn leaveBtn' onClick={() => leaveRoom()}>Leave ROOM</button>
            </div>
            <div className="editorWrap">
                <Editor socketRef={socketRef} roomId={roomId} onCodeChange={(code) => {
                    codeRef.current=code;
                }} />
            </div>
        </div>
    )
}

export default EditorPage