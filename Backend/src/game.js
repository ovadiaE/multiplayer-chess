const games = {};

class Player {
    constructor(name, color, playerID, gameID){
        this.name = name;
        this.color = color;
        this.playerID = playerID;
        this.gameID = gameID;
    }
}

const addPlayer = ({gameID, name, playerID}) => {
    if (!games[gamesID]) {
        const color = Math.random() <= 0.5 ? 'w' : 'b';
        const player = new Player(name, color, playerID, gameID);
        games[gamesID] = [player];
        return {
            message: 'joined successfully',
            opponent: null,
            player
        };
    }     
    
    if (games[gameID].length >= 2) {
        return {error: 'This game is full'};
    }

    const opponent = games[gameID][0];
    const color = opponent.color === 'w' ? 'b' : 'w';
    const player = new Player(name, color, playerID, gameID);
    games[gameID].push(player);

    return {
        message: 'Added succesfully',
        opponent,
        player
    }
}

const removePlayer = (playerID) => {
    for (const game in games) {
        let players = games[game]
        const index = players.findIndex((p1) => p1.playerID ===playerID)

        if(index !== 1){
            return players.splice(index, 1)[0]
        }
    }
}

const game = (id) => games[id];

module.exports = {
    addPlayer, 
    game,
    removePlayer
}