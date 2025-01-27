const canvas = document.createElement("canvas");
const width = canvas.width = document.body.clientWidth;
const height = canvas.height = document.body.clientHeight
document.body.append(canvas)
const ctx = canvas.getContext("2d");
// ctx.imageSmoothingQuality = "high"
ctx.imageSmoothingEnabled = false
ctx.scale(4, 4)

const player = {
  x: 128,
  y: 128,
  speed: 1,
  frame: 0
}

const movement = {
  forward: false,
  backward: false,
  left: false,
  right: false
}

const textures = {
  player: [],
  player_running: [],
  enemy: []
}

class Player {
  // item:
  // dx: 0,
  // dy: 1,
  use() {
    // ...  
  }
}

class Object {  
}

class Shells {
  
}

const player = {}
const shells = {}
const objects = {}
const items = {}


function loadTextures() {
  let img;
  for (let i = 0; i < 5; i++) {
    const image = new Image()
    image.src = "/static/img/" + i + ".png"
    player.stay.push(image)
  }

  for (let i = 1; i < 8; i++) {
    const img = new Image()
    img.src = "/static/img/p" + (i) + ".png"
    player.textures.push(img)
    // enemy.textures.push(img)
  }
  const image = new Image()
  image.src = "/static/img/Tree.png"
  enemy.textures[0] = image
}
// console.log(width, height)
// p2set2
// p2use
// set 2
// p2use

function render() {
  // console.log(player.textures)
  ctx.fillStyle = "#1f1f1f";
  ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = "#0fef7f";
  if (movement.forward || movement.backward || movement.left || movement.right)
    ctx.drawImage(player.textures[player.frame % 7], player.x, player.y, 32, 32)
  else
    ctx.drawImage(player.stay[player.frame % 5], player.x, player.y, 32, 32)
  ctx.drawImage(enemy.textures[0], enemy.x, enemy.y, 64, 64)


  // for player in players
  //   textures[]
  
}

// p2vec 1 1
// p2vec 0 0
// p2pos 40 40
// p2pos 41 41
// p2pos 42 42

const socket = new WebSocket("ws://" + document.location.host);

function send_vector() {
  let x = 0, y = 0;
  if (movement.left)
    x -= 1;
  if (movement.right)
    x += 1;
  if (movement.forward)
    y -= 1
  if (movement.backward)
    y += 1
  socket.send(`vec ${x} ${y}`)
}

// p2hp:100
// p2pos:10,10
// p2hp:0


function addEventListeners() {
  document.addEventListener("keyup", event => {
    switch (event.code) {
      case 'KeyW':
        movement.forward = false;
        break
      case 'KeyA':
        movement.left = false;
        break
      case 'KeyS':
        movement.backward = false;
        break
      case 'KeyD':
        movement.right = false;
        break
    }
    send_vector()
  })


  document.addEventListener("keydown", event => {
    switch (event.code) {
      case 'KeyW':
        movement.forward = true;
        break
      case 'KeyA':
        movement.left = true;
        break
      case 'KeyS':
        movement.backward = true;
        break
      case 'KeyD':
        movement.right = true;
        break
    }
    send_vector()
  })

  // socket.addEventListener("open", (event) => {});

  socket.addEventListener("message", event => {
    // [msgType, x, y] = event.data.split(' ');
    render()
  });
  
}

function addIntervals() {
  setInterval(() => render(), 16)

  setInterval(() => {
    if (frame == 7)
      player.frame = 0
    else
      player.frame++
  }, 100)
}

function main() {
  addEventListeners();
  addIntervals();
}
