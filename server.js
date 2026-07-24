// ========================================
// IMPORTS
// ========================================

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");


// ========================================
// SERVER SETUP
// ========================================

const app = express();

const server =
    http.createServer(app);

const io =
    new Server(server);


// ========================================
// SERVE WEBSITE
// ========================================

app.use(
    express.static(
        __dirname
    )
);


// ========================================
// LOBBIES
// ========================================

const lobbies =
    new Map();


// ========================================
// GAMES
// ========================================

const games =
    new Map();


// ========================================
// MAP SIZE
// ========================================

const MAP_WIDTH =
    1000;

const MAP_HEIGHT =
    650;


// ========================================
// FIRE RATE
// ========================================
// 100ms between shots
// = maximum 10 shots per second

const FIRE_RATE =
    100;


// ========================================
// MAPS
// ========================================

const maps = [

    // ========================================
    // MAP 1 - CLASSIC
    // ========================================

    {
        name:
            "CLASSIC",

        walls: [

            {
                x: 0,
                y: 0,
                width: 1000,
                height: 20
            },

            {
                x: 0,
                y: 630,
                width: 1000,
                height: 20
            },

            {
                x: 0,
                y: 0,
                width: 20,
                height: 650
            },

            {
                x: 980,
                y: 0,
                width: 20,
                height: 650
            },

            {
                x: 250,
                y: 150,
                width: 200,
                height: 30
            },

            {
                x: 550,
                y: 150,
                width: 200,
                height: 30
            },

            {
                x: 250,
                y: 470,
                width: 200,
                height: 30
            },

            {
                x: 550,
                y: 470,
                width: 200,
                height: 30
            },

            {
                x: 470,
                y: 250,
                width: 60,
                height: 150
            }

        ],

        spawns: [

            {
                x: 100,
                y: 325
            },

            {
                x: 900,
                y: 325
            }

        ]

    },


    // ========================================
    // MAP 2 - FOUR CORNERS
    // ========================================

    {
        name:
            "FOUR CORNERS",

        walls: [

            {
                x: 0,
                y: 0,
                width: 1000,
                height: 20
            },

            {
                x: 0,
                y: 630,
                width: 1000,
                height: 20
            },

            {
                x: 0,
                y: 0,
                width: 20,
                height: 650
            },

            {
                x: 980,
                y: 0,
                width: 20,
                height: 650
            },

            {
                x: 200,
                y: 120,
                width: 180,
                height: 35
            },

            {
                x: 620,
                y: 120,
                width: 180,
                height: 35
            },

            {
                x: 200,
                y: 495,
                width: 180,
                height: 35
            },

            {
                x: 620,
                y: 495,
                width: 180,
                height: 35
            },

            {
                x: 440,
                y: 250,
                width: 120,
                height: 35
            },

            {
                x: 440,
                y: 365,
                width: 120,
                height: 35
            }

        ],

        spawns: [

            {
                x: 100,
                y: 100
            },

            {
                x: 900,
                y: 550
            }

        ]

    },


    // ========================================
    // MAP 3 - CROSS
    // ========================================

    {
        name:
            "CROSS",

        walls: [

            {
                x: 0,
                y: 0,
                width: 1000,
                height: 20
            },

            {
                x: 0,
                y: 630,
                width: 1000,
                height: 20
            },

            {
                x: 0,
                y: 0,
                width: 20,
                height: 650
            },

            {
                x: 980,
                y: 0,
                width: 20,
                height: 650
            },

            {
                x: 420,
                y: 80,
                width: 160,
                height: 180
            },

            {
                x: 420,
                y: 390,
                width: 160,
                height: 180
            },

            {
                x: 180,
                y: 295,
                width: 220,
                height: 60
            },

            {
                x: 600,
                y: 295,
                width: 220,
                height: 60
            }

        ],

        spawns: [

            {
                x: 100,
                y: 100
            },

            {
                x: 900,
                y: 550
            }

        ]

    },


    // ========================================
    // MAP 4 - MAZE
    // ========================================

    {
        name:
            "MAZE",

        walls: [

            {
                x: 0,
                y: 0,
                width: 1000,
                height: 20
            },

            {
                x: 0,
                y: 630,
                width: 1000,
                height: 20
            },

            {
                x: 0,
                y: 0,
                width: 20,
                height: 650
            },

            {
                x: 980,
                y: 0,
                width: 20,
                height: 650
            },

            {
                x: 180,
                y: 80,
                width: 40,
                height: 300
            },

            {
                x: 180,
                y: 500,
                width: 300,
                height: 40
            },

            {
                x: 350,
                y: 150,
                width: 40,
                height: 300
            },

            {
                x: 500,
                y: 110,
                width: 40,
                height: 300
            },

            {
                x: 500,
                y: 500,
                width: 300,
                height: 40
            },

            {
                x: 780,
                y: 270,
                width: 40,
                height: 270
            }

        ],

        spawns: [

            {
                x: 80,
                y: 550
            },

            {
                x: 920,
                y: 100
            }

        ]

    }

];


// ========================================
// CREATE LOBBY CODE
// ========================================

function createLobbyCode() {

    const characters =
        "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

    let code =
        "";

    for (
        let i = 0;
        i < 6;
        i++
    ) {

        code +=
            characters.charAt(
                Math.floor(
                    Math.random() *
                    characters.length
                )
            );

    }

    return code;

}


// ========================================
// CREATE DEFAULT USERNAME
// ========================================

function createUsername() {

    const number =
        Math.floor(
            1000 +
            Math.random() *
            9000
        );

    return (
        "Player_" +
        number
    );

}


// ========================================
// CLEAN USERNAME
// ========================================

function cleanUsername(
    username
) {

    if (
        typeof username !==
        "string"
    ) {

        return "Player";

    }

    username =
        username.trim();

    if (
        username.length ===
        0
    ) {

        return "Player";

    }

    if (
        username.length >
        20
    ) {

        username =
            username.substring(
                0,
                20
            );

    }

    return username;

}


// ========================================
// GET PLAYERS
// ========================================

function getPlayers(
    lobby
) {

    return lobby.players.map(
        player => {

            return {

                id:
                    player.id,

                username:
                    player.username,

                isHost:
                    player.isHost

            };

        }
    );

}


// ========================================
// CONNECTION
// ========================================

io.on(
    "connection",
    (socket) => {

        console.log(
            "Player connected:",
            socket.id
        );


        socket.username =
            createUsername();


        // ========================================
        // FIRE RATE TRACKING
        // ========================================

        socket.lastShotTime =
            0;


        // ========================================
        // CREATE LOBBY
        // ========================================

        socket.on(
            "createLobby",
            (data) => {

                let username =
                    "Player";


                if (
                    data &&
                    typeof data.username ===
                    "string"
                ) {

                    username =
                        data.username;

                }


                socket.username =
                    cleanUsername(
                        username
                    );


                let code;


                do {

                    code =
                        createLobbyCode();

                } while (
                    lobbies.has(
                        code
                    )
                );


                const host = {

                    id:
                        socket.id,

                    username:
                        socket.username,

                    isHost:
                        true

                };


                const lobby = {

                    hostId:
                        socket.id,

                    players:
                        [
                            host
                        ]

                };


                lobbies.set(
                    code,
                    lobby
                );


                socket.join(
                    code
                );


                socket.lobbyCode =
                    code;


                socket.emit(
                    "lobbyCreated",
                    {

                        code:
                            code,

                        players:
                            getPlayers(
                                lobby
                            )

                    }
                );

            }
        );


        // ========================================
        // JOIN LOBBY
        // ========================================

        socket.on(
            "joinLobby",
            (data) => {

                let code =
                    "";

                let username =
                    "Player";


                if (
                    data &&
                    typeof data ===
                    "object"
                ) {

                    code =
                        data.code;

                    username =
                        data.username;

                } else {

                    code =
                        data;

                }


                code =
                    String(
                        code || ""
                    )
                    .trim()
                    .toUpperCase();


                socket.username =
                    cleanUsername(
                        username
                    );


                const lobby =
                    lobbies.get(
                        code
                    );


                if (
                    !lobby
                ) {

                    socket.emit(
                        "joinLobbyError",
                        "Lobby not found."
                    );

                    return;

                }


                if (
                    lobby.players.length >=
                    2
                ) {

                    socket.emit(
                        "joinLobbyError",
                        "Lobby is full."
                    );

                    return;

                }


                const player = {

                    id:
                        socket.id,

                    username:
                        socket.username,

                    isHost:
                        false

                };


                lobby.players.push(
                    player
                );


                socket.join(
                    code
                );


                socket.lobbyCode =
                    code;


                socket.emit(
                    "lobbyJoined",
                    {

                        code:
                            code,

                        players:
                            getPlayers(
                                lobby
                            )

                    }
                );


                io.to(
                    code
                ).emit(
                    "playersUpdated",
                    getPlayers(
                        lobby
                    )
                );

            }
        );


        // ========================================
        // LEAVE LOBBY
        // ========================================

        socket.on(
            "leaveLobby",
            () => {

                leaveLobby(
                    socket
                );

            }
        );


        // ========================================
        // START MATCH
        // ========================================

        socket.on(
            "startMatch",
            () => {

                const code =
                    socket.lobbyCode;


                const lobby =
                    lobbies.get(
                        code
                    );


                if (
                    !lobby
                ) {

                    return;

                }


                if (
                    lobby.hostId !==
                    socket.id
                ) {

                    return;

                }


                if (
                    lobby.players.length !==
                    2
                ) {

                    return;

                }


                createGame(
                    code,
                    lobby
                );

            }
        );


        // ========================================
        // PLAYER MOVEMENT
        // ========================================

        socket.on(
            "playerMove",
            (data) => {

                const gameCode =
                    socket.gameCode;


                if (
                    !gameCode
                ) {

                    return;

                }


                const game =
                    games.get(
                        gameCode
                    );


                if (
                    !game
                ) {

                    return;

                }


                if (
                    !game.roundActive
                ) {

                    return;

                }


                const player =
                    game.players[
                        socket.id
                    ];


                if (
                    !player
                ) {

                    return;

                }


                let dx =
                    Number(
                        data.dx
                    ) || 0;


                let dy =
                    Number(
                        data.dy
                    ) || 0;


                const length =
                    Math.sqrt(
                        dx * dx +
                        dy * dy
                    );


                if (
                    length > 0
                ) {

                    dx /=
                        length;

                    dy /=
                        length;

                }


                const speed =
                    5;


                const newX =
                    player.x +
                    dx *
                    speed;


                const newY =
                    player.y +
                    dy *
                    speed;


                const currentMap =
                    maps[
                        game.mapIndex
                    ];


                if (
                    !collidesWithWall(
                        newX,
                        player.y,
                        18,
                        currentMap.walls
                    )
                ) {

                    player.x =
                        newX;

                }


                if (
                    !collidesWithWall(
                        player.x,
                        newY,
                        18,
                        currentMap.walls
                    )
                ) {

                    player.y =
                        newY;

                }

            }
        );


        // ========================================
        // SHOOT
        // ========================================

        socket.on(
            "shoot",
            (data) => {

                const gameCode =
                    socket.gameCode;


                const game =
                    games.get(
                        gameCode
                    );


                if (
                    !game ||
                    !game.roundActive
                ) {

                    return;

                }


                const player =
                    game.players[
                        socket.id
                    ];


                if (
                    !player
                ) {

                    return;

                }


                // ========================================
                // FIRE RATE LIMIT
                // ========================================

                const now =
                    Date.now();


                if (
                    now -
                    socket.lastShotTime <
                    FIRE_RATE
                ) {

                    return;

                }


                socket.lastShotTime =
                    now;


                // ========================================
                // GET AIM ANGLE
                // ========================================

                const angle =
                    Number(
                        data.angle
                    );


                if (
                    !Number.isFinite(
                        angle
                    )
                ) {

                    return;

                }


                // ========================================
                // BULLET SPEED
                // ========================================

                const speed =
                    12;


                // ========================================
                // CREATE BULLET
                // ========================================

                game.bullets.push({

                    x:
                        player.x,

                    y:
                        player.y,

                    vx:
                        Math.cos(
                            angle
                        ) *
                        speed,

                    vy:
                        Math.sin(
                            angle
                        ) *
                        speed,

                    owner:
                        socket.id,

                    bounces:
                        0

                });

            }
        );


        // ========================================
        // DISCONNECT
        // ========================================

        socket.on(
            "disconnect",
            () => {

                if (
                    socket.gameCode
                ) {

                    const game =
                        games.get(
                            socket.gameCode
                        );


                    if (
                        game
                    ) {

                        io.to(
                            socket.gameCode
                        ).emit(
                            "playerLeftGame"
                        );


                        games.delete(
                            socket.gameCode
                        );

                    }


                    socket.gameCode =
                        null;

                }


                leaveLobby(
                    socket
                );

            }
        );

    }
);


// ========================================
// CIRCLE / RECTANGLE COLLISION
// ========================================

function circleRectCollision(
    x,
    y,
    radius,
    wall
) {

    const closestX =
        Math.max(
            wall.x,
            Math.min(
                x,
                wall.x +
                wall.width
            )
        );


    const closestY =
        Math.max(
            wall.y,
            Math.min(
                y,
                wall.y +
                wall.height
            )
        );


    const dx =
        x -
        closestX;


    const dy =
        y -
        closestY;


    return (
        dx * dx +
        dy * dy
        <
        radius * radius
    );

}


// ========================================
// WALL COLLISION
// ========================================

function collidesWithWall(
    x,
    y,
    radius,
    wallList
) {

    return wallList.some(
        wall =>
            circleRectCollision(
                x,
                y,
                radius,
                wall
            )
    );

}


// ========================================
// POINT INSIDE WALL
// ========================================

function pointInsideWall(
    x,
    y,
    wallList
) {

    return wallList.some(
        wall =>

            x >= wall.x &&

            x <=
                wall.x +
                wall.width &&

            y >= wall.y &&

            y <=
                wall.y +
                wall.height

    );

}


// ========================================
// CREATE GAME
// ========================================

function createGame(
    code,
    lobby
) {

    const game = {

        players:
            {},

        bullets:
            [],

        roundActive:
            false,

        roundStarting:
            false,

        roundNumber:
            0,

        mapIndex:
            0

    };


    lobby.players.forEach(
        (
            player,
            index
        ) => {

            const spawn =
                maps[0].spawns[index];


            game.players[
                player.id
            ] = {

                id:
                    player.id,

                username:
                    player.username,

                x:
                    spawn.x,

                y:
                    spawn.y,

                spawnX:
                    spawn.x,

                spawnY:
                    spawn.y,

                health:
                    100,

                color:
                    index === 0
                    ?
                    "#ff4757"
                    :
                    "#3478f6"

            };

        }
    );


    games.set(
        code,
        game
    );


    lobby.players.forEach(
        player => {

            const playerSocket =
                io.sockets.sockets.get(
                    player.id
                );


            if (
                playerSocket
            ) {

                playerSocket.gameCode =
                    code;

                playerSocket.lastShotTime =
                    0;

            }

        }
    );


    io.to(
        code
    ).emit(
        "matchStarted"
    );


    startRoundCountdown(
        code
    );

}


// ========================================
// ROUND COUNTDOWN
// ========================================

function startRoundCountdown(
    code
) {

    const game =
        games.get(
            code
        );


    if (
        !game
    ) {

        return;

    }


    if (
        game.roundStarting
    ) {

        return;

    }


    game.roundStarting =
        true;


    game.roundActive =
        false;


    // ========================================
    // CHANGE MAP
    // ========================================

    game.mapIndex =
        game.roundNumber %
        maps.length;


    const currentMap =
        maps[
            game.mapIndex
        ];


    game.roundNumber++;


    // ========================================
    // CLEAR BULLETS
    // ========================================

    game.bullets =
        [];


    // ========================================
    // RESET PLAYERS
    // ========================================

    const playerIds =
        Object.keys(
            game.players
        );


    playerIds.forEach(
        (
            id,
            index
        ) => {

            const player =
                game.players[
                    id
                ];


            const spawn =
                currentMap.spawns[
                    index
                ];


            player.health =
                100;


            player.x =
                spawn.x;


            player.y =
                spawn.y;


            player.spawnX =
                spawn.x;


            player.spawnY =
                spawn.y;

        }
    );


    // ========================================
    // RESET FIRE RATE
    // ========================================

    playerIds.forEach(
        id => {

            const playerSocket =
                io.sockets.sockets.get(
                    id
                );


            if (
                playerSocket
            ) {

                playerSocket.lastShotTime =
                    0;

            }

        }
    );


    // ========================================
    // SEND MAP TO CLIENTS
    // ========================================

    io.to(
        code
    ).emit(
        "mapChanged",
        {

            mapIndex:
                game.mapIndex,

            mapName:
                currentMap.name

        }
    );


    // ========================================
    // COUNTDOWN 3
    // ========================================

    io.to(
        code
    ).emit(
        "roundCountdown",
        "3"
    );


    setTimeout(
        () => {

            if (
                !games.has(
                    code
                )
            ) {

                return;

            }


            io.to(
                code
            ).emit(
                "roundCountdown",
                "2"
            );

        },
        1000
    );


    // ========================================
    // COUNTDOWN 1
    // ========================================

    setTimeout(
        () => {

            if (
                !games.has(
                    code
                )
            ) {

                return;

            }


            io.to(
                code
            ).emit(
                "roundCountdown",
                "1"
            );

        },
        2000
    );


    // ========================================
    // FIGHT
    // ========================================

    setTimeout(
        () => {

            const currentGame =
                games.get(
                    code
                );


            if (
                !currentGame
            ) {

                return;

            }


            currentGame.roundStarting =
                false;


            currentGame.roundActive =
                true;


            io.to(
                code
            ).emit(
                "roundCountdown",
                "FIGHT!"
            );

        },
        3000
    );

}


// ========================================
// GAME LOOP
// ========================================

setInterval(
    () => {

        games.forEach(
            (
                game,
                code
            ) => {

                updateBullets(
                    game,
                    code
                );


                io.to(
                    code
                ).emit(
                    "gameState",
                    {

                        players:
                            game.players,

                        bullets:
                            game.bullets,

                        mapIndex:
                            game.mapIndex

                    }
                );

            }
        );

    },
    1000 / 60
);


// ========================================
// UPDATE BULLETS
// ========================================

function updateBullets(
    game,
    code
) {

    if (
        !game.roundActive
    ) {

        return;

    }


    const currentMap =
        maps[
            game.mapIndex
        ];


    game.bullets =
        game.bullets.filter(
            bullet => {

                // ========================================
                // CALCULATE NEXT POSITION
                // ========================================

                const newX =
                    bullet.x +
                    bullet.vx;


                const newY =
                    bullet.y +
                    bullet.vy;


                // ========================================
                // CHECK X COLLISION
                // ========================================

                const hitX =
                    pointInsideWall(
                        newX,
                        bullet.y,
                        currentMap.walls
                    );


                // ========================================
                // CHECK Y COLLISION
                // ========================================

                const hitY =
                    pointInsideWall(
                        bullet.x,
                        newY,
                        currentMap.walls
                    );


                // ========================================
                // WALL HIT
                // ========================================

                if (
                    hitX ||
                    hitY
                ) {

                    bullet.bounces++;


                    console.log(
                        "BULLET WALL HIT:",
                        bullet.bounces
                    );


                    // ========================================
                    // DISAPPEAR ON 4TH WALL HIT
                    // ========================================

                    if (
                        bullet.bounces >=
                        4
                    ) {

                        console.log(
                            "BULLET DISAPPEARED AFTER 4 WALL HITS"
                        );


                        return false;

                    }


                    // ========================================
                    // VERTICAL WALL BOUNCE
                    // ========================================

                    if (
                        hitX
                    ) {

                        bullet.vx *=
                            -1;

                    }


                    // ========================================
                    // HORIZONTAL WALL BOUNCE
                    // ========================================

                    if (
                        hitY
                    ) {

                        bullet.vy *=
                            -1;

                    }


                    // ========================================
                    // MOVE BULLET AWAY FROM WALL
                    // ========================================

                    bullet.x +=
                        bullet.vx;


                    bullet.y +=
                        bullet.vy;


                    // ========================================
                    // KEEP BULLET INSIDE MAP
                    // ========================================

                    bullet.x =
                        Math.max(
                            21,
                            Math.min(
                                MAP_WIDTH - 21,
                                bullet.x
                            )
                        );


                    bullet.y =
                        Math.max(
                            21,
                            Math.min(
                                MAP_HEIGHT - 21,
                                bullet.y
                            )
                        );


                    return true;

                }


                // ========================================
                // MOVE BULLET
                // ========================================

                bullet.x =
                    newX;


                bullet.y =
                    newY;


                // ========================================
                // OUTSIDE MAP
                // ========================================

                if (
                    bullet.x < 0 ||
                    bullet.x >
                        MAP_WIDTH ||
                    bullet.y < 0 ||
                    bullet.y >
                        MAP_HEIGHT
                ) {

                    return false;

                }


                // ========================================
                // PLAYER HIT
                // ========================================

                for (
                    const id in
                    game.players
                ) {

                    const player =
                        game.players[
                            id
                        ];


                    // ========================================
                    // DON'T HIT SHOOTER
                    // ========================================

                    if (
                        id ===
                        bullet.owner
                    ) {

                        continue;

                    }


                    const dx =
                        bullet.x -
                        player.x;


                    const dy =
                        bullet.y -
                        player.y;


                    const distance =
                        Math.sqrt(
                            dx * dx +
                            dy * dy
                        );


                    // ========================================
                    // PLAYER HIT
                    // ========================================

                    if (
                        distance <
                        23
                    ) {

                        player.health -=
                            10;


                        // ========================================
                        // PLAYER KILLED
                        // ========================================

                        if (
                            player.health <=
                            0
                        ) {

                            const killer =
                                game.players[
                                    bullet.owner
                                ];


                            // ========================================
                            // CLEAR ALL BULLETS
                            // ========================================

                            game.bullets =
                                [];


                            // ========================================
                            // STOP ROUND
                            // ========================================

                            game.roundActive =
                                false;


                            game.roundStarting =
                                false;


                            // ========================================
                            // KILL EVENT
                            // ========================================

                            io.to(
                                code
                            ).emit(
                                "playerKilled",
                                {

                                    killerId:
                                        bullet.owner,

                                    victimId:
                                        id

                                }
                            );


                            // ========================================
                            // ROUND WON
                            // ========================================

                            io.to(
                                code
                            ).emit(
                                "roundWon",
                                {

                                    winnerUsername:
                                        killer
                                        ?
                                        killer.username
                                        :
                                        "Player"

                                }
                            );


                            // ========================================
                            // RESET PLAYERS
                            // ========================================

                            Object.keys(
                                game.players
                            ).forEach(
                                (
                                    playerId
                                ) => {

                                    const p =
                                        game.players[
                                            playerId
                                        ];


                                    p.health =
                                        100;

                                }
                            );


                            // ========================================
                            // START NEXT ROUND
                            // ========================================

                            setTimeout(
                                () => {

                                    if (
                                        games.has(
                                            code
                                        )
                                    ) {

                                        startRoundCountdown(
                                            code
                                        );

                                    }

                                },
                                1500
                            );


                            return false;

                        }


                        // ========================================
                        // BULLET DISAPPEARS AFTER PLAYER HIT
                        // ========================================

                        return false;

                    }

                }


                // ========================================
                // KEEP BULLET
                // ========================================

                return true;

            }
        );

}


// ========================================
// LEAVE LOBBY
// ========================================

function leaveLobby(
    socket
) {

    const code =
        socket.lobbyCode;


    if (
        !code
    ) {

        return;

    }


    const lobby =
        lobbies.get(
            code
        );


    if (
        !lobby
    ) {

        socket.lobbyCode =
            null;

        return;

    }


    // ========================================
    // HOST LEAVES
    // ========================================

    if (
        lobby.hostId ===
        socket.id
    ) {

        if (
            games.has(
                code
            )
        ) {

            games.delete(
                code
            );

        }


        socket.to(
            code
        ).emit(
            "hostLeft"
        );


        lobbies.delete(
            code
        );


        io.in(
            code
        ).socketsLeave(
            code
        );


        socket.lobbyCode =
            null;


        return;

    }


    // ========================================
    // NORMAL PLAYER LEAVES
    // ========================================

    lobby.players =
        lobby.players.filter(
            player =>
                player.id !==
                socket.id
        );


    socket.leave(
        code
    );


    socket.lobbyCode =
        null;


    io.to(
        code
    ).emit(
        "playerLeft",
        {

            players:
                getPlayers(
                    lobby
                )

        }
    );

}


// ========================================
// START SERVER
// ========================================

const PORT =
    process.env.PORT ||
    3000;


server.listen(
    PORT,
    () => {

        console.log(
            "================================"
        );


        console.log(
            "1V1 GAME SERVER ONLINE"
        );


        console.log(
            "PORT:",
            PORT
        );


        console.log(
            "================================"
        );

    }
);
