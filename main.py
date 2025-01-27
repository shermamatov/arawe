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
    websockets = []

    async def on_connect(self, websocket):
        await websocket.accept()
        await websocket.send_text(game.get_state())

    async def on_receive(self, websocket, data):
        print()
        pass


app = Starlette(
    debug=True,
    routes=(
        Route('/', index),
        Mount('/static', app=StaticFiles(directory="static")),
        WebSocketRoute('/', Server)
    )
)
