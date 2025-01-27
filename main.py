from contextlib import asynccontextmanager

from starlette.applications import Starlette
from starlette.responses import FileResponse
from starlette.routing import Route, Mount, WebSocketRoute
from starlette.staticfiles import StaticFiles
from starlette.endpoints import WebSocketEndpoint

from game import Game


game = Game()


async def index(request):
    return FileResponse("index.html")


class Server(WebSocketEndpoint):
    encoding = "text"

    async def on_connect(self, ws):
        await ws.accept()
        await game.add_player(ws)
        await game.get_state()

    async def on_receive(self, ws, data):
        if data.startswith("vec"):
            msg = data.split(':')
            if len(msg) != 2:
                return
            cmd, args = msg[0], msg[1].split(',')
            if len(args) != 2:
                return
            dx, dy = args
            if not dx.isdigit() or not dy.isdigit():
                return
            dx = int(dx)
            dy = int(dy)
            for i in dx, dy:
                if i < -1 or i > 1:
                    return
            await game.set_vector(ws, dx, dy)
        elif data == "use":
            await game.use(ws)
    
    async def on_disconnect(self, ws, close_code):
        await game.del_player(ws)


@asynccontextmanager
async def lifespan(app):
    await game.loop()
    yield


app = Starlette(
    debug=True,
    routes=(
        Route('/', index),
        Mount('/static', app=StaticFiles(directory="static")),
        WebSocketRoute('/', Server)
    )
)
