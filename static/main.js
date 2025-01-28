const width = (canvas.width = document.body.clientWidth);
const height = (canvas.height = document.body.clientHeight);
const canvas = document.createElement("canvas");
document.body.append(canvas);

const ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;
ctx.scale(4, 4);

const socket = new WebSocket("ws://" + document.location.host);

//!  constants end

class Player {
    // item:
    // dx: 0,
    // dy: 1,
    use() {
        // ...
    }
}

class Object {}

class Shells {}

const player = {
    x: 128,
    y: 128,
    speed: 1,
    frame: 0,
    stay: [],
    textures: [],
};

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
    player: [],
    player_running: [],
    enemy: [],
};

function loadTextures() {
    let img;
    for (let i = 1; i < 7; i++) {
        const image = new Image();
        image.src = "/static/img/Dacer/Dacer_Standing" + i + ".png";
        player.stay.push(image);
    }

    for (let i = 1; i < 7; i++) {
        const img = new Image();
        img.src = "/static/img/Dacer/Dacer_Runing" + i + ".png";
        player.textures.push(img);
        // enemy.textures.push(img)
    }
    // console.log(player);
    // const image = new Image();
    // image.src = "/static/img/baground/Tree.png";
    // enemy.textures[0] = image;
}

function render() {
    ctx.fillStyle = "#1f1f1f";
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = "#0fef7f";
    if (
        movement.forward ||
        movement.backward ||
        movement.left ||
        movement.right
    )
        ctx.drawImage(
            player.textures[player.frame % 6],
            player.x,
            player.y,
            32,
            32
        );
    else
        ctx.drawImage(
            player.stay[player.frame % 6],
            player.x,
            player.y,
            32,
            32
        );
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
        requestArr = event.split(":");

        // [msgType, x, y] = event.data.split(' ');
        console.log(event.data)
        render();
    });
}

function addIntervals() {
    setInterval(() => render(), 16);
    setInterval(() => {
        player.frame++;
        // if (frame == 6) player.frame = 0;
        // else player.frame++;
    }, 100);
}

function main() {
    addEventListeners();
    addIntervals();
}

main();
