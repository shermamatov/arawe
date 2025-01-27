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

    def move(self, vector_x, vecotr_y):
        self.x += vector_x * self.speed
        self.y += vector_y * self.speed


class Game:
    width = 3200
    height = 3200
    registry: list[Player] = []
