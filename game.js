// ========================================
// CONNECT TO SERVER
// ========================================

const socket = io();


// ========================================
// MENUS
// ========================================

const mainMenu =
    document.getElementById("mainMenu");

const lobbyMenu =
    document.getElementById("lobbyMenu");

const joinLobbyMenu =
    document.getElementById("joinLobbyMenu");

const gameScreen =
    document.getElementById("gameScreen");


// ========================================
// MAIN MENU USERNAME
// ========================================

const usernameInput =
    document.getElementById("usernameInput");

const saveUsernameButton =
    document.getElementById("saveUsernameButton");

const usernameMessage =
    document.getElementById("usernameMessage");


// ========================================
// BUTTONS
// ========================================

const createLobbyButton =
    document.getElementById("createLobbyButton");

const joinLobbyButton =
    document.getElementById("joinLobbyButton");

const copyCodeButton =
    document.getElementById("copyCodeButton");

const startMatchButton =
    document.getElementById("startMatchButton");

const backButton =
    document.getElementById("backButton");

const joinBackButton =
    document.getElementById("joinBackButton");

const joinButton =
    document.getElementById("joinButton");


// ========================================
// LOBBY ELEMENTS
// ========================================

const lobbyCodeDisplay =
    document.getElementById("lobbyCode");

const lobbyCodeInput =
    document.getElementById("lobbyCodeInput");

const joinMessage =
    document.getElementById("joinMessage");

const playersList =
    document.getElementById("playersList");

const waitingText =
    document.getElementById("waitingText");


// ========================================
// GAME ELEMENTS
// ========================================

const canvas =
    document.getElementById("gameCanvas");

const ctx =
    canvas.getContext("2d");

const gameStatus =
    document.getElementById("gameStatus");

const playerOneHealth =
    document.getElementById("playerOneHealth");

const playerTwoHealth =
    document.getElementById("playerTwoHealth");

const playerOneScore =
    document.getElementById("playerOneScore");

const playerTwoScore =
    document.getElementById("playerTwoScore");


// ========================================
// MAP DISPLAY
// ========================================

let currentMapIndex =
    0;

let currentMapName =
    "CLASSIC";


// ========================================
// GAME STATE
// ========================================

let gamePlayers = {};

let gameBullets = [];

let keys = {};

let mouseX =
    canvas.width / 2;

let mouseY =
    canvas.height / 2;

let mouseDown =
    false;

let gameRunning =
    false;

let isHost =
    false;


// ========================================
// SCORE
// ========================================

let playerOneKills =
    0;

let playerTwoKills =
    0;


// ========================================
// USERNAME
// ========================================

let currentUsername =
    "";


// ========================================
// LOAD SAVED USERNAME
// ========================================

const savedUsername =
    localStorage.getItem(
        "playerUsername"
    );


if (
    savedUsername
) {

    currentUsername =
        savedUsername;

    usernameInput.value =
        savedUsername;

}


// ========================================
// SAVE USERNAME
// ========================================

saveUsernameButton.addEventListener(
    "click",
    function() {

        let username =
            usernameInput.value
                .trim();


        if (
            username.length <
            1
        ) {

            usernameMessage.textContent =
                "❌ Enter a username.";

            return;

        }


        if (
            username.length >
            20
        ) {

            usernameMessage.textContent =
                "❌ Username is too long.";

            return;

        }


        currentUsername =
            username;


        localStorage.setItem(
            "playerUsername",
            username
        );


        usernameMessage.textContent =
            "✅ Username saved!";

    }
);


// ========================================
// ENTER TO SAVE USERNAME
// ========================================

usernameInput.addEventListener(
    "keydown",
    function(event) {

        if (
            event.key ===
            "Enter"
        ) {

            saveUsernameButton.click();

        }

    }
);


// ========================================
// CREATE LOBBY
// ========================================

createLobbyButton.addEventListener(
    "click",
    function() {

        if (
            !currentUsername
        ) {

            usernameMessage.textContent =
                "❌ Please enter a username first.";

            usernameInput.focus();

            return;

        }


        socket.emit(
            "createLobby",
            {

                username:
                    currentUsername

            }
        );

    }
);


// ========================================
// LOBBY CREATED
// ========================================

socket.on(
    "lobbyCreated",
    function(data) {

        isHost =
            true;


        mainMenu.classList.add(
            "hidden"
        );


        joinLobbyMenu.classList.add(
            "hidden"
        );


        lobbyMenu.classList.remove(
            "hidden"
        );


        lobbyCodeDisplay.textContent =
            data.code;


        updatePlayers(
            data.players
        );


        startMatchButton.classList.remove(
            "hidden"
        );


        startMatchButton.disabled =
            true;


        waitingText.textContent =
            "⏳ Waiting for opponent...";

    }
);


// ========================================
// UPDATE PLAYER LIST
// ========================================

function updatePlayers(
    players
) {

    playersList.innerHTML =
        "";


    players.forEach(
        function(player) {

            const playerElement =
                document.createElement(
                    "div"
                );


            playerElement.className =
                "playerEntry";


            playerElement.innerHTML =

                `
                <span>
                    👤 ${player.username}
                </span>

                ${
                    player.isHost
                    ?
                    `
                    <span class="hostBadge">
                        👑 HOST
                    </span>
                    `
                    :
                    ""
                }
                `;


            playersList.appendChild(
                playerElement
            );

        }
    );


    if (
        isHost
    ) {

        startMatchButton.classList.remove(
            "hidden"
        );


        if (
            players.length >=
            2
        ) {

            startMatchButton.disabled =
                false;


            waitingText.textContent =
                "✅ Opponent joined!";

        } else {

            startMatchButton.disabled =
                true;


            waitingText.textContent =
                "⏳ Waiting for opponent...";

        }

    }

}


// ========================================
// OPEN JOIN MENU
// ========================================

joinLobbyButton.addEventListener(
    "click",
    function() {

        mainMenu.classList.add(
            "hidden"
        );


        lobbyMenu.classList.add(
            "hidden"
        );


        joinLobbyMenu.classList.remove(
            "hidden"
        );


        lobbyCodeInput.value =
            "";


        joinMessage.textContent =
            "";


        lobbyCodeInput.focus();

    }
);


// ========================================
// JOIN LOBBY
// ========================================

joinButton.addEventListener(
    "click",
    function() {

        if (
            !currentUsername
        ) {

            joinMessage.textContent =
                "❌ Please enter a username first.";

            return;

        }


        const code =
            lobbyCodeInput.value
                .trim()
                .toUpperCase();


        if (
            code.length !==
            6
        ) {

            joinMessage.textContent =
                "❌ Enter a 6-character code.";

            return;

        }


        joinMessage.textContent =
            "⏳ Joining lobby...";


        socket.emit(
            "joinLobby",
            {

                code:
                    code,

                username:
                    currentUsername

            }
        );

    }
);


// ========================================
// ENTER TO JOIN
// ========================================

lobbyCodeInput.addEventListener(
    "keydown",
    function(event) {

        if (
            event.key ===
            "Enter"
        ) {

            joinButton.click();

        }

    }
);


// ========================================
// LOBBY JOINED
// ========================================

socket.on(
    "lobbyJoined",
    function(data) {

        isHost =
            false;


        joinLobbyMenu.classList.add(
            "hidden"
        );


        mainMenu.classList.add(
            "hidden"
        );


        lobbyMenu.classList.remove(
            "hidden"
        );


        lobbyCodeDisplay.textContent =
            data.code;


        updatePlayers(
            data.players
        );


        startMatchButton.classList.add(
            "hidden"
        );


        waitingText.textContent =
            "⏳ Waiting for host to start the match...";

    }
);


// ========================================
// JOIN ERROR
// ========================================

socket.on(
    "joinLobbyError",
    function(message) {

        joinMessage.textContent =
            "❌ " + message;

    }
);


// ========================================
// PLAYERS UPDATED
// ========================================

socket.on(
    "playersUpdated",
    function(players) {

        updatePlayers(
            players
        );

    }
);


// ========================================
// COPY CODE
// ========================================

copyCodeButton.addEventListener(
    "click",
    async function() {

        const code =
            lobbyCodeDisplay.textContent;


        if (
            code ===
            "------"
        ) {

            return;

        }


        try {

            await navigator.clipboard.writeText(
                code
            );


            copyCodeButton.textContent =
                "✅ COPIED!";


            setTimeout(
                function() {

                    copyCodeButton.textContent =
                        "📋 COPY CODE";

                },
                2000
            );

        } catch (
            error
        ) {

            console.error(
                error
            );

        }

    }
);


// ========================================
// START MATCH
// ========================================

startMatchButton.addEventListener(
    "click",
    function() {

        if (
            !isHost ||
            startMatchButton.disabled
        ) {

            return;

        }


        startMatchButton.disabled =
            true;


        waitingText.textContent =
            "🎮 Starting match...";


        socket.emit(
            "startMatch"
        );

    }
);


// ========================================
// MATCH STARTED
// ========================================

socket.on(
    "matchStarted",
    function() {

        mainMenu.classList.add(
            "hidden"
        );


        lobbyMenu.classList.add(
            "hidden"
        );


        joinLobbyMenu.classList.add(
            "hidden"
        );


        gameScreen.classList.remove(
            "hidden"
        );


        gameRunning =
            false;


        mouseDown =
            false;


        keys =
            {};


        gameBullets =
            [];


        playerOneKills =
            0;


        playerTwoKills =
            0;


        playerOneScore.textContent =
            "0";


        playerTwoScore.textContent =
            "0";


        gameStatus.textContent =
            "GET READY!";

    }
);


// ========================================
// MAP CHANGED
// ========================================

socket.on(
    "mapChanged",
    function(data) {

        if (
            !data
        ) {

            return;

        }


        currentMapIndex =
            data.mapIndex;


        currentMapName =
            data.mapName ||
            "MAP";


        updateMapDisplay();

    }
);


// ========================================
// UPDATE MAP DISPLAY
// ========================================

function updateMapDisplay() {

    let mapDisplay =
        document.getElementById(
            "mapDisplay"
        );


    if (
        !mapDisplay
    ) {

        mapDisplay =
            document.createElement(
                "div"
            );


        mapDisplay.id =
            "mapDisplay";


        mapDisplay.style.position =
            "absolute";


        mapDisplay.style.top =
            "15px";


        mapDisplay.style.left =
            "50%";


        mapDisplay.style.transform =
            "translateX(-50%)";


        mapDisplay.style.color =
            "#ffffff";


        mapDisplay.style.fontFamily =
            "Arial, sans-serif";


        mapDisplay.style.fontWeight =
            "bold";


        mapDisplay.style.fontSize =
            "14px";


        mapDisplay.style.textShadow =
            "0 2px 5px rgba(0,0,0,0.8)";


        gameScreen.appendChild(
            mapDisplay
        );

    }


    mapDisplay.textContent =
        "🗺️ " +
        currentMapName;

}


// ========================================
// ROUND COUNTDOWN
// ========================================

socket.on(
    "roundCountdown",
    function(value) {

        if (
            value ===
            "FIGHT!"
        ) {

            gameStatus.textContent =
                "FIGHT!";


            gameRunning =
                true;


            return;

        }


        gameRunning =
            false;


        mouseDown =
            false;


        gameStatus.textContent =
            value;

    }
);


// ========================================
// PLAYER KILLED
// ========================================

socket.on(
    "playerKilled",
    function(data) {

        const playerIds =
            Object.keys(
                gamePlayers
            );


        const playerOneId =
            playerIds[0];


        if (
            data.killerId ===
            playerOneId
        ) {

            playerOneKills++;

        } else {

            playerTwoKills++;

        }


        playerOneScore.textContent =
            playerOneKills;


        playerTwoScore.textContent =
            playerTwoKills;


        const killer =
            gamePlayers[
                data.killerId
            ];


        if (
            killer
        ) {

            gameStatus.textContent =
                killer.username +
                " GOT THE KILL!";

        }

    }
);


// ========================================
// ROUND WON
// ========================================

socket.on(
    "roundWon",
    function(data) {

        gameRunning =
            false;


        mouseDown =
            false;


        gameBullets =
            [];


        if (
            data &&
            data.winnerUsername
        ) {

            gameStatus.textContent =
                data.winnerUsername +
                " WON!";

        }

    }
);


// ========================================
// GAME STATE
// ========================================

socket.on(
    "gameState",
    function(state) {

        gamePlayers =
            state.players ||
            {};


        gameBullets =
            state.bullets ||
            [];


        if (
            typeof state.mapIndex ===
            "number"
        ) {

            currentMapIndex =
                state.mapIndex;

        }


        updateGamePlayerNames();

    }
);


// ========================================
// UPDATE PLAYER NAMES
// ========================================

function updateGamePlayerNames() {

    const players =
        Object.values(
            gamePlayers
        );


    if (
        players.length <
        2
    ) {

        return;

    }


    const playerOne =
        players[0];


    const playerTwo =
        players[1];


    if (
        playerOne
    ) {

        playerOneHealth.textContent =
            playerOne.username ||
            "Player";

    }


    if (
        playerTwo
    ) {

        playerTwoHealth.textContent =
            playerTwo.username ||
            "Player";

    }

}


// ========================================
// KEYBOARD
// ========================================

window.addEventListener(
    "keydown",
    function(event) {

        const key =
            event.key.toLowerCase();


        keys[key] =
            true;


        if (
            key === "arrowup" ||
            key === "arrowdown" ||
            key === "arrowleft" ||
            key === "arrowright"
        ) {

            event.preventDefault();

        }

    }
);


window.addEventListener(
    "keyup",
    function(event) {

        const key =
            event.key.toLowerCase();


        keys[key] =
            false;

    }
);


// ========================================
// SEND MOVEMENT
// ========================================

setInterval(
    function() {

        if (
            !gameRunning
        ) {

            return;

        }


        let dx =
            0;

        let dy =
            0;


        if (
            keys["w"] ||
            keys["arrowup"]
        ) {

            dy--;

        }


        if (
            keys["s"] ||
            keys["arrowdown"]
        ) {

            dy++;

        }


        if (
            keys["a"] ||
            keys["arrowleft"]
        ) {

            dx--;

        }


        if (
            keys["d"] ||
            keys["arrowright"]
        ) {

            dx++;

        }


        socket.emit(
            "playerMove",
            {

                dx:
                    dx,

                dy:
                    dy

            }
        );

    },
    1000 / 60
);


// ========================================
// MOUSE AIM
// ========================================

canvas.addEventListener(
    "mousemove",
    function(event) {

        const rect =
            canvas.getBoundingClientRect();


        mouseX =
            (
                event.clientX -
                rect.left
            )
            *
            (
                canvas.width /
                rect.width
            );


        mouseY =
            (
                event.clientY -
                rect.top
            )
            *
            (
                canvas.height /
                rect.height
            );

    }
);


// ========================================
// SHOOT
// ========================================

canvas.addEventListener(
    "mousedown",
    function(event) {

        if (
            event.button !==
            0
        ) {

            return;

        }


        if (
            !gameRunning
        ) {

            return;

        }


        // ========================================
        // START HOLDING FIRE
        // ========================================

        mouseDown =
            true;


        // ========================================
        // FIRE IMMEDIATELY
        // ========================================

        shoot();

    }
);


// ========================================
// STOP SHOOTING
// ========================================

window.addEventListener(
    "mouseup",
    function(event) {

        if (
            event.button ===
            0
        ) {

            mouseDown =
                false;

        }

    }
);


// ========================================
// SHOOT FUNCTION
// ========================================

function shoot() {

    if (
        !gameRunning
    ) {

        return;

    }


    const player =
        gamePlayers[
            socket.id
        ];


    if (
        !player
    ) {

        return;

    }


    const angle =
        Math.atan2(
            mouseY -
            player.y,

            mouseX -
            player.x
        );


    socket.emit(
        "shoot",
        {

            angle:
                angle

        }
    );

}


// ========================================
// CONTINUOUS SHOOTING
// ========================================

setInterval(
    function() {

        // ========================================
        // ONLY FIRE WHILE MOUSE IS HELD
        // ========================================

        if (
            !mouseDown
        ) {

            return;

        }


        // ========================================
        // STOP FIRING IF ROUND IS NOT ACTIVE
        // ========================================

        if (
            !gameRunning
        ) {

            mouseDown =
                false;

            return;

        }


        // ========================================
        // FIRE AT FIXED FIRE RATE
        // ========================================

        shoot();

    },
    250
);


// ========================================
// DRAW GAME
// ========================================

function drawGame() {

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    // ========================================
    // BACKGROUND
    // ========================================

    ctx.fillStyle =
        "#18202b";


    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    // ========================================
    // GRID
    // ========================================

    ctx.strokeStyle =
        "rgba(255,255,255,0.035)";


    ctx.lineWidth =
        1;


    for (
        let x = 0;
        x <
        canvas.width;
        x += 50
    ) {

        ctx.beginPath();


        ctx.moveTo(
            x,
            0
        );


        ctx.lineTo(
            x,
            canvas.height
        );


        ctx.stroke();

    }


    for (
        let y = 0;
        y <
        canvas.height;
        y += 50
    ) {

        ctx.beginPath();


        ctx.moveTo(
            0,
            y
        );


        ctx.lineTo(
            canvas.width,
            y
        );


        ctx.stroke();

    }


    // ========================================
    // DRAW CURRENT MAP
    // ========================================

    drawCurrentMap();


    // ========================================
    // BULLETS
    // ========================================

    gameBullets.forEach(
        function(bullet) {

            ctx.beginPath();


            ctx.arc(
                bullet.x,
                bullet.y,
                5,
                0,
                Math.PI * 2
            );


            ctx.fillStyle =
                "#ffffff";


            ctx.shadowBlur =
                10;


            ctx.shadowColor =
                "#ffffff";


            ctx.fill();


            ctx.shadowBlur =
                0;

        }
    );


    // ========================================
    // PLAYERS
    // ========================================

    Object.values(
        gamePlayers
    ).forEach(
        function(player) {

            const isMe =
                player.id ===
                socket.id;


            ctx.beginPath();


            ctx.arc(
                player.x,
                player.y,
                18,
                0,
                Math.PI * 2
            );


            ctx.fillStyle =
                player.color;


            ctx.shadowBlur =
                isMe
                ?
                20
                :
                10;


            ctx.shadowColor =
                player.color;


            ctx.fill();


            ctx.shadowBlur =
                0;


            // ========================================
            // USERNAME
            // ========================================

            ctx.fillStyle =
                "#ffffff";


            ctx.font =
                "bold 12px Arial";


            ctx.textAlign =
                "center";


            ctx.fillText(
                player.username ||
                "Player",
                player.x,
                player.y - 28
            );


            // ========================================
            // HEALTH BACKGROUND
            // ========================================

            ctx.fillStyle =
                "#222";


            ctx.fillRect(
                player.x - 25,
                player.y + 25,
                50,
                6
            );


            // ========================================
            // HEALTH
            // ========================================

            ctx.fillStyle =
                "#2ed573";


            ctx.fillRect(
                player.x - 25,
                player.y + 25,
                50 *
                (
                    player.health /
                    100
                ),
                6
            );

        }
    );


    requestAnimationFrame(
        drawGame
    );

}


// ========================================
// DRAW CURRENT MAP
// ========================================

function drawCurrentMap() {

    // ========================================
    // MAP 1 - CLASSIC
    // ========================================

    if (
        currentMapIndex ===
        0
    ) {

        drawWall(
            0,
            0,
            1000,
            20
        );

        drawWall(
            0,
            630,
            1000,
            20
        );

        drawWall(
            0,
            0,
            20,
            650
        );

        drawWall(
            980,
            0,
            20,
            650
        );

        drawWall(
            250,
            150,
            200,
            30
        );

        drawWall(
            550,
            150,
            200,
            30
        );

        drawWall(
            250,
            470,
            200,
            30
        );

        drawWall(
            550,
            470,
            200,
            30
        );

        drawWall(
            470,
            250,
            60,
            150
        );

    }


    // ========================================
    // MAP 2 - FOUR CORNERS
    // ========================================

    else if (
        currentMapIndex ===
        1
    ) {

        drawWall(
            0,
            0,
            1000,
            20
        );

        drawWall(
            0,
            630,
            1000,
            20
        );

        drawWall(
            0,
            0,
            20,
            650
        );

        drawWall(
            980,
            0,
            20,
            650
        );

        drawWall(
            200,
            120,
            180,
            35
        );

        drawWall(
            620,
            120,
            180,
            35
        );

        drawWall(
            200,
            495,
            180,
            35
        );

        drawWall(
            620,
            495,
            180,
            35
        );

        drawWall(
            440,
            250,
            120,
            35
        );

        drawWall(
            440,
            365,
            120,
            35
        );

    }


    // ========================================
    // MAP 3 - CROSS
    // ========================================

    else if (
        currentMapIndex ===
        2
    ) {

        drawWall(
            0,
            0,
            1000,
            20
        );

        drawWall(
            0,
            630,
            1000,
            20
        );

        drawWall(
            0,
            0,
            20,
            650
        );

        drawWall(
            980,
            0,
            20,
            650
        );

        drawWall(
            420,
            80,
            160,
            180
        );

        drawWall(
            420,
            390,
            160,
            180
        );

        drawWall(
            180,
            295,
            220,
            60
        );

        drawWall(
            600,
            295,
            220,
            60
        );

    }


    // ========================================
    // MAP 4 - MAZE
    // ========================================

    else if (
        currentMapIndex ===
        3
    ) {

        drawWall(
            0,
            0,
            1000,
            20
        );

        drawWall(
            0,
            630,
            1000,
            20
        );

        drawWall(
            0,
            0,
            20,
            650
        );

        drawWall(
            980,
            0,
            20,
            650
        );

        drawWall(
            180,
            80,
            40,
            300
        );

        drawWall(
            180,
            500,
            300,
            40
        );

        drawWall(
            350,
            150,
            40,
            300
        );

        drawWall(
            500,
            110,
            40,
            300
        );

        drawWall(
            500,
            500,
            300,
            40
        );

        drawWall(
            780,
            270,
            40,
            270
        );

    }

}


// ========================================
// DRAW WALL
// ========================================

function drawWall(
    x,
    y,
    width,
    height
) {

    ctx.fillStyle =
        "#343c4d";


    ctx.fillRect(
        x,
        y,
        width,
        height
    );


    ctx.strokeStyle =
        "#596276";


    ctx.lineWidth =
        2;


    ctx.strokeRect(
        x,
        y,
        width,
        height
    );

}


// ========================================
// PLAYER LEFT GAME
// ========================================

socket.on(
    "playerLeftGame",
    function() {

        gameStatus.textContent =
            "OPPONENT LEFT";


        gameRunning =
            false;


        mouseDown =
            false;

    }
);


// ========================================
// HOST LEFT
// ========================================

socket.on(
    "hostLeft",
    function() {

        alert(
            "👑 The host left the lobby."
        );


        leaveLobbyScreen();

    }
);


// ========================================
// PLAYER LEFT LOBBY
// ========================================

socket.on(
    "playerLeft",
    function(data) {

        updatePlayers(
            data.players
        );


        if (
            isHost
        ) {

            startMatchButton.disabled =
                true;


            waitingText.textContent =
                "⏳ Waiting for opponent...";

        }

    }
);


// ========================================
// BACK BUTTON
// ========================================

backButton.addEventListener(
    "click",
    function() {

        socket.emit(
            "leaveLobby"
        );


        leaveLobbyScreen();

    }
);


// ========================================
// BACK FROM JOIN
// ========================================

joinBackButton.addEventListener(
    "click",
    function() {

        joinLobbyMenu.classList.add(
            "hidden"
        );


        mainMenu.classList.remove(
            "hidden"
        );


        joinMessage.textContent =
            "";

    }
);


// ========================================
// LEAVE LOBBY SCREEN
// ========================================

function leaveLobbyScreen() {

    gameScreen.classList.add(
        "hidden"
    );


    lobbyMenu.classList.add(
        "hidden"
    );


    joinLobbyMenu.classList.add(
        "hidden"
    );


    mainMenu.classList.remove(
        "hidden"
    );


    lobbyCodeDisplay.textContent =
        "------";


    playersList.innerHTML =
        "";


    lobbyCodeInput.value =
        "";


    joinMessage.textContent =
        "";


    waitingText.textContent =
        "⏳ Waiting for opponent...";


    startMatchButton.classList.add(
        "hidden"
    );


    startMatchButton.disabled =
        true;


    isHost =
        false;


    gameRunning =
        false;


    mouseDown =
        false;


    keys =
        {};


    gamePlayers =
        {};


    gameBullets =
        [];


    playerOneKills =
        0;


    playerTwoKills =
        0;


    currentMapIndex =
        0;


    currentMapName =
        "CLASSIC";


    playerOneScore.textContent =
        "0";


    playerTwoScore.textContent =
        "0";

}


// ========================================
// START DRAW LOOP
// ========================================

drawGame();
