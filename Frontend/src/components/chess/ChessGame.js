import React, {useState, useRef, useEffect} from 'react'
import {useLocation, useNavigate} from 'react-router-dom'
import qs from 'query-string';
import Chessboard from 'chessboardjsx';
import { Chess } from 'chess.js'
import './ChessGame.css'

function ChessGame ({socket}) {
    const [fen, setFen] = useState('start')
    const [color, setColor] = useState('')
    
    const navigate = useNavigate()
    const location = useLocation()
   
    const playerName = useRef()
    const gameID = useRef()
    let playerColor = useRef(null)
    let game = useRef(null)
    
    const joinedGame = () => {
        socket.emit('join', { name: playerName.current, gameID: gameID.current},
            ({ error, color }) => {
                if (error) {
                    navigate(`/`, { replace: true })
                }
                playerColor.current = color
                setColor(color)
                console.log(color)
        });
       socket.on('welcome', ({ message, opponent }) => {
            // console.log({ message, opponent });
        });
    }
    useEffect (() => {
        game.current = new Chess()
        joinedGame()
    },[]) //eslint-disable-line

    useEffect(()=> {
        const {id, name} = qs.parse(location.search)
        playerName.current = name
        gameID.current = id
    }, [location.search])

    useEffect(() => {
        socket.on('opponentMove', ({ sourceSquare, targetSquare }) => {
            let move = game.current.move({
                from: sourceSquare,
                to: targetSquare
            })            
            setFen(game.current.fen())
            console.log(move)
           });
    }, [game]) // eslint-disable-line
        
    const makeMove = ({sourceSquare, targetSquare}) => {
        let move = game.current.move({
            from: sourceSquare,
            to: targetSquare
        })
        
        if (move === null) return null;
        
        if(game.current.turn() !== playerColor.current){
            console.log('illegal move please wait your turn')
            return
        }
        
        setFen(game.current.fen())
        
        socket.emit('move', { gameID:gameID.current, sourceSquare, targetSquare });
    }
    
    const reset = () => {
        game.current.clear();
        game.current.reset();
        setFen('start')
    }
    
    return ( 
    <>
        {game.current && game.current.game_over() ? 
            <div className="game-over">
                <h1> Game Over</h1>
                <button onClick={reset}>Play Again</button>
            </div> : null }
            <div className='game-wrapper'>
                {color === 'b' ? <Chessboard position={fen} onDrop={makeMove} showNotation={true} orientation={'white'}/> : <Chessboard position={fen} onDrop={makeMove} showNotation={true} orientation={'black'}/>}
            </div>
    </>
     )

};

export default ChessGame