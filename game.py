from asyncio import sleep 
from starlette.websockets import WebSocket


class Object:
    x: float
    y: float


class Shell(Object):
    dx = 0
    dy = 0


class Player(Shell):
    speed = 1

    def __init__(self, x, y):
        self.x = x
        self.y = y

    def move(self):
        self.x += self.dx * self.speed
        self.y += self.dy * self.speed
        return self.x, self.y

    def set_vector(self, dx, dy):
        self.dx = dx
        self.dy = dy


class Game:
    width = 3200
    height = 3200
    registry: list[Player] = []

    async def loop(self):
        for p in self.registry:
            p.move()
        # send to clients
        await sleep(33)

    async def send_clients(self, msg):
        WebSocket
        
