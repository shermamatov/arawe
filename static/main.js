const canvas = document.createElement("canvas");
const width = document.body.clientWidth;
const height = document.body.clientHeight;
canvas.width = width;
canvas.height = height;
document.body.append(canvas);

const ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;
ctx.scale(4, 4);

const socket = new WebSocket("ws://" + document.location.host);
let frame = 0;
//!  constants end

class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.state = 0;
    }
    // item:
    // dx: 0,
    // dy: 1,
    use() {
        // ...
    }
}

class Object {}

class Shells {}
const clientId = null;
// const player = {
//     x: 128,
//     y: 128,
//     state: 0,

//     dx: 0,

const player = Player;
const shells = {};
const objects = {};
const items = {};

const movement = {
    forward: false,
    backward: false,
    left: false,
    right: false,
};

const textures = {
    player_staying: [],
    player_running: [],
    enemy: [],
};

function loadTextures() {
    let img;
    for (let i = 1; i < 7; i++) {
        img = new Image();
        img.src = "/static/img/Dacer/Dacer_Standing" + i + ".png";
        textures.player_staying.push(img);
        img = new Image();
        img.src = "/static/img/Dacer/Dacer_Runing" + i + ".png";
        textures.player_running.push(img);
        // enemy.textures.push(img)
    }

    for (let i = 1; i < 7; i++) {}
    // console.log(player);
    // const image = new Image();
    // image.src = "/static/img/baground/Tree.png";
    // enemy.textures[0] = image;
}

function render() {
    ctx.fillStyle = "#1f1f1f";
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = "#0fef7f";
    // console.log(player);

    if (player.state)
        ctx.drawImage(
            textures.player_running[frame % 6],
            player.x,
            player.y,
            32,
            32
        );
    else
        ctx.drawImage(
            textures.player_staying[frame % 6],
            player.x,
            player.y,
            32,
            32
        );
    ctx.restore();
    // ctx.drawImage(enemy.textures[0], enemy.x, enemy.y, 64, 64);
}

function send_vector() {
    let x = 0,
        y = 0;
    if (movement.left) x -= 1;
    if (movement.right) x += 1;
    if (movement.forward) y -= 1;
    if (movement.backward) y += 1;
    socket.send(`vec:${x},${y}`);
}

function addEventListeners() {
    document.addEventListener("keyup", (event) => {
        switch (event.code) {
            case "KeyW":
                movement.forward = false;
                send_vector();
                break;
            case "KeyA":
                movement.left = false;
                send_vector();
                break;
            case "KeyS":
                movement.backward = false;
                send_vector();
                break;
            case "KeyD":
                movement.right = false;
                send_vector();
                break;
        }
    });

    document.addEventListener("keydown", (event) => {
        switch (event.code) {
            case "KeyW":
                movement.forward = true;
                send_vector();
                break;
            case "KeyA":
                movement.left = true;
                send_vector();
                break;
            case "KeyS":
                movement.backward = true;
                send_vector();
                break;
            case "KeyD":
                movement.right = true;
                send_vector();
                break;
        }
        // send_vector();
    });

    // socket.addEventListener("open", (event) => {});
    loadTextures();
    socket.addEventListener("message", (event) => {
        let msg = event.data.split(":");
        if (msg.length === 4) {
            if (msg[2] == "pos") {
                [x, y] = msg[3].split(",");
                player.x = x;
                player.y = y;
            } else if (msg[2] == "vec") {
                [x, y] = msg[3].split(",");
                player.state = x != 0 || y != 0;
                player.dx = x;
            }
        } else if (msg.length == 2) {
            clientId = msg[1];
        }
        // console.log(event.data);
        render();
    });
}

function addIntervals() {
    setInterval(() => render(), 16);
    setInterval(() => {
        if (frame == 5) {
            frame = 0;
        } else {
            frame++;
        }
    }, 100);
}

function main() {
    addEventListeners();
    addIntervals();
}

main();
