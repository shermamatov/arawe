class Player:
    speed = 20

    def __init__(self, x, y):
        self.x = x
        self.y = y

    def move_forward(self):
        self.y -= self.speed 

    def move_left(self):
        self.x -= self.speed

    def move_right(self):
        self.x += self.speed

    def move_backward(self):
        self.y += self.speed

class Game:
    width = 3200
    height = 3200
    player = Player(128, 128)

    def get_state(self):
        return f"player: {self.player.x} {self.player.y}"
        
