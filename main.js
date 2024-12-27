"use strict";

let context;
let keyPush = {};

window.addEventListener("keydown", (e) => {
    keyPush[e.key] = true;
});

window.addEventListener("keyup", (e) => {
    keyPush[e.key] = false;
})

function CollisionChecker(o1, o2)
{
    if (o1.x2 < o2.x) return false;
    if (o1.y2 < o2.y) return false;
    if (o2.x2 < o1.x) return false;
    if (o2.y2 < o1.y) return false;
    return true;
}

class Vector
{
    constructor(x, y)
    {
        this.x = x;
        this.y = y;
    }
}

class Block
{
    constructor(x, y, width, height, color)
    {
        this.x = x;
        this.y = y;
        this.x2 = x + width;
        this.y2 = y + height;
        this.width = width;
        this.height = height;
        this.color = color;
    }

    draw()
    {
        context.fillStyle = this.color;
        context.fillRect(this.x, this.y, this.width, this.height);
    }
}

class Wall extends Block
{
    constructor(x, y)
    {
        super(x, y, 40, 40, "red");
    }
}

class WallManager
{
    constructor()
    {
        this.walls = [];
        for (let y = 0; y < 5; y++)
        {
            this.walls[y] = []
            for (let x = 0; x < 5; x++)
            {
                this.walls[y][x] = new Wall(x * 80 + 40, y * 80 + 40);
            }
        }
    }

    collision(obj)
    {
        for (let y = 0; y < 5; y++)
        {
            for (let x = 0; x < 5; x++)
            {
                if (CollisionChecker(obj, this.walls[y][x]))
                {
                    return true;
                }
            }
        }

        return false;
    }

    draw()
    {
        for (let y = 0; y < 5; y++)
        {
            for (let x = 0; x < 5; x++)
            {
                this.walls[y][x].draw();
            }
        }
    }
}

class Bullet extends Block
{
    constructor(x, y, direction)
    {
        super(x, y, 6, 6, "yellow");
        this.direction = direction;
        this.speed = 2;
    }
}

class Enemy extends Block
{
    constructor(x, y, name)
    {
        super(x, y, 20, 20, "white");
        this.name = name;
    }
}

class Player extends Block
{
    constructor(x, y)
    {
        super(x, y, 20, 20, "aqua");
        this.vector = new Vector(0, 0);
        this.direction = "up";
    }

    action()
    {
        if (keyPush["ArrowLeft"])
        {
            this.vector.x = -1;
            this.direction = "left";
        }
        if (keyPush["ArrowUp"])
        {
            this.vector.y = -1;
            this.direction = "up";
        }
        if (keyPush["ArrowRight"])
        {
            this.vector.x = 1;
            this.direction = "right";
        }
        if (keyPush["ArrowDown"])
        {
            this.vector.y = 1;
            this.direction = "down";
        }
        // if (keyPush["z"]) {}
    }

    copyPlayer()
    {
        return new Player(this.x, this.y);
    }

    move()
    {
        this.x  += this.vector.x;
        this.x2 += this.vector.x;
        this.y  += this.vector.y;
        this.y2 += this.vector.y;
    }

    resetVector()
    {
        this.vector.x = this.vector.y = 0;
    }
}

class Game
{
    constructor()
    {
        this.canvas = document.getElementById("canvas");
        context = this.canvas.getContext("2d");

        this.loopReqest = null;
        this.player = new Player(210, 250);
        this.enemy = new Enemy(210, 90, "L");
        this.wallManager = new WallManager;

        this.loop();
    }

    loop()
    {
        context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.update();
        this.loopReqest = window.requestAnimationFrame(this.loop.bind(this));
    }

    update()
    {
        this.player.action();
        if (this.player.vector.x || this.player.vector.y)
        {
            let futurePlayer = this.player.copyPlayer();
            futurePlayer.move();

            if (this.wallManager.collision(futurePlayer) == false)
            {
                this.player.move();
            }
        }

        this.player.resetVector();
        this.player.draw();
        this.enemy.draw();
        this.wallManager.draw();
    }
}