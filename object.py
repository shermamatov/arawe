class Object:
    x: float
    y: float


class Shell(Object):
    speed: int = 2
    dx: float = 0
    dy: float = 0

    def move(self) -> bool:
        if self.dx or self.dy:
            self.x += self.dx * self.speed
            self.y += self.dy * self.speed
            return True
        return False


class Player(Shell):
    id = 0
    hp = 100
    use = 0
    dir = -1

    @classmethod
    def get_id(cls):
        cls.id += 1
        return cls.id

    def __str__(self):
        return 'p:' + str(self.id)

    def __init__(self, x, y):
        self.id = self.get_id()
        self.x = 64
        self.y = 64

    def reload(self):
        if self.use:
            self.use -= 1

    def get_pos(self):
        return f"{self}:pos:{self.x},{self.y}"

    def get_hp(self):
        return f"{self}:hp:{self.hp}"

    def get_vector(self):
        return f"{self}:vec:{self.dx},{self.dy}"

    def set_vector(self, dx, dy):
        self.dx = dx
        self.dy = dy
        if dx:
            self.dir = dx
        # TODO: if dx is float then dir is the sign of dx
