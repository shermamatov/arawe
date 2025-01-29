from asyncio import sleep

from starlette.endpoints import WebSocketEndpoint
from starlette.websockets import WebSocket

from object import Player


def vector(i):
    if i.startswith("-"):
        mod = i[1:]
    else:
        mod = i
    if not mod.isdigit():
        return None
    i = int(i)
    if i < -1 or i > 1:
        return None
    return i


class Server(WebSocketEndpoint):
    encoding = "text"
    width = 640
    height = 640
    players: dict[WebSocket, Player] = {}

    @classmethod
    async def send_all(cls, msg: str):
        for ws in cls.players:
            await ws.send_text(msg)

    async def use(self, player, dx=None, dy=None):
        if not player.use:
            player.use = 16
            await self.send_all(f"{player}:use")

            for enemy in self.players.values():
                if enemy is player:
                    continue

                px0 = player.x
                px1 = player.x + 16 * player.dir
                py0 = player.y - 16
                py1 = player.y + 16

                ex0 = enemy.x - 8
                ex1 = enemy.x + 8
                ey0 = enemy.y - 16
                ey1 = enemy.y + 16

                if (((px0 <= ex0 and ex0 <= px1) or (px0 <= ex1 and ex1 <= px1))
                    and (py0 <= ey0 and ey0 <= py1) or (py0 <= ey1 and ey1 <= py1)):
                    enemy.hp -= 10
                    await self.send_all(player.get_hp())
                

    async def get_state(self):
        for player in self.players.values():
            await self.send_all(player.get_pos())
            await self.send_all(player.get_vector())
            await self.send_all(player.get_hp())

    @classmethod
    async def loop(cls):
        while True:
            for player in cls.players.values():
                if player.move():
                    await cls.send_all(player.get_pos())
                player.reload()
            await sleep(0.032)

    async def on_connect(self, ws):
        if len(self.players) < 50:
            await ws.accept()
            self.players[ws] = Player(64, 64)
            await self.get_state()

    async def on_receive(self, ws, data):
        player = self.players[ws]
        if data == "use":
            await self.use(player)
        else:
            msg = data.split(':')
            if len(msg) != 2:
                return
            cmd, args = msg[0], msg[1].split(',')
            if cmd != "vec":
                return
            if len(args) != 2:
                return
            dx = vector(args[0])
            dy = vector(args[1])
            if dx is None or dy is None:
                return
            player.set_vector(dx, dy)        
            await self.send_all(player.get_vector())
    
    async def on_disconnect(self, ws, close_code):
        player = self.players.pop(ws)
        await self.send_all(f"{player}:hp:0")
