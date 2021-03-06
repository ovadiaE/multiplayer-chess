import React, {useState, useEffect} from 'react'
import { useNavigate, useLocation } from "react-router-dom";
import qs from 'query-string'
import './HomePage.css'

const HomePage = () => {
    const [name, setName] = useState('')
    const [gameID, setGameID] = useState('')
    
    const navigate = useNavigate()
    const location = useLocation()
    const { id: inviteID } = qs.parse(location.search)


    useEffect(() => {
        if (inviteID) return setGameID(inviteID)
        const id = Math.random().toString().replace('0.', '');
        setGameID(id)
    },[inviteID])

    const handleSubmit = (event) => {
        event.preventDefault();
        if(!(name && gameID)){
            return;
        }
        navigate(`/display?name=${name}&id=${gameID}`, { replace: true })
    };

    return (
        <div className='form-wrapper'>
            <h2> Play Chess online</h2>
            <form onSubmit={handleSubmit}>
                <input 
                    type="text"
                    className="input"
                    value={name}
                    onChange={({target}) => setName(target.value)}
                    placeholder="Display Name">
                </input>
                <button className="submit-button" type="submit">Create Room</button>
            </form>
        </div>
    )
};

export default HomePage;


