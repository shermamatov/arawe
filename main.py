from asyncio import sleep, create_task
from contextlib import asynccontextmanager

from starlette.applications import Starlette
from starlette.responses import FileResponse
from starlette.routing import Route, Mount, WebSocketRoute
from starlette.staticfiles import StaticFiles
from starlette.endpoints import WebSocketEndpoint

from server import Server
import uvicorn
import os
async def index(request):
    return FileResponse("index.html")


@asynccontextmanager
async def lifespan(app):
    task = create_task(Server.loop())  
    yield


app = Starlette(
    debug=True,
    routes=(
        Route('/', index),  
        Mount('/static', app=StaticFiles(directory="static")), 
        WebSocketRoute('/', Server),
        WebSocketRoute('/ws', Server)
    ),
    lifespan=lifespan
)

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=int(os.getenv("PORT", 8000)))