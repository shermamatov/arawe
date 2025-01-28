from asyncio import sleep
from random import randint 

from starlette.websockets import WebSocket


class Object:
    x: float
    y: float


class Shell(Object):
    dx = 0
    dy = 0


class Player(Shell):
    speed = 1
    id = 0

    @classmethod
    def get_id(cls):
        cls.id += 1
        return cls.id

    def __str__(self):
        return 'p' + str(self.id)

    def __init__(self):
        self.x = randint(64, Game.width - 64)
        self.y = randint(64, Game.height - 64)
        self.id = self.get_id()
        self.hp = 100

    def move(self):
        if self.dx or self.dy:
            self.x += self.dx * self.speed
            self.y += self.dy * self.speed
            return True
        return False

    def get_pos(self):
        return f"{self}pos:{self.x},{self.y}"

    def get_hp(self):
        return f"{self}hp:{self.hp}"

    def get_vector(self):
        return f"{self}vec:{self.dx},{self.dy}"

    def set_vector(self, dx, dy):
        self.dx = dx
        self.dy = dy


class Game:
    width = 640
    height = 640
    players: dict[WebSocket, Player] = {}

    async def add_player(self, ws: WebSocket):
        self.players[ws] = player = Player()
        await ws.send_text(str(player))

    async def del_player(self, ws: WebSocket):
        player = self.players.pop(ws)
        await self.send_all(f"{player}hp:0")

    async def send_all(self, msg: str):
        for ws in self.players:
            await ws.send_text(msg)

    async def set_vector(self, ws, dx, dy):
        player = self.players[ws]
        player.set_vector(dx, dy)        
        await self.send_all(f"{player}vec:{dx},{dy}")

    async def use(self, ws, dx=None, dy=None):
        player = self.players[ws]
        await self.send_all(f"{player}use")

    async def get_state(self):
        for player in self.players.values():
            await self.send_all(player.get_pos())
            await self.send_all(player.get_vector())
            await self.send_all(player.get_hp())

    async def loop(self):
        while True:
            for player in self.players.values():
                if player.move():
                    await self.send_all(player.get_pos())
            await sleep(0.03)

