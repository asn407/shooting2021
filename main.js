"use strict";

let context;
let keyPush = {};
let keyFlag = {};
const debug = true;

window.addEventListener("keydown", (e) => {
    keyPush[e.key] = true;
});

window.addEventListener("keyup", (e) => {
    keyPush[e.key] = false;
});

function KeyPressed(keyIndex)
{
    if (keyPush[keyIndex] && !keyFlag[keyIndex])
    {
        keyFlag[keyIndex] = true;
        return true;
    }

    if (!keyPush[keyIndex])
    {
        keyFlag[keyIndex] = false;
    }

    return false;
}

function CollisionChecker(block1, block2)
{
    if (block1.x2 <= block2.x) return false;
    if (block1.y2 <= block2.y) return false;
    if (block2.x2 <= block1.x) return false;
    if (block2.y2 <= block1.y) return false;
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

    collision(block)
    {
        for (let y = 0; y < 5; y++)
        {
            for (let x = 0; x < 5; x++)
            {
                if (CollisionChecker(block, this.walls[y][x]))
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

    move()
    {
        switch (this.direction)
        {
            case "left":  this.x -= this.speed; break;
            case "up":    this.y -= this.speed; break;
            case "right": this.x += this.speed; break;
            case "down":  this.y += this.speed; break;
        }
    }

    copyBullet()
    {
        return new Bullet(this.x, this.y, this.direction);
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
    constructor(x, y, Vx, Vy)
    {
        super(x, y, 20, 20, "aqua");
        this.vector = new Vector(Vx, Vy);
        this.direction = "up";
        this.bullets = [];
    }

    keyInput()
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
        if (KeyPressed("z") && this.bullets.length < 5)
        {
            this.bullets.push(this.shot());
        }
    }

    copyPlayer()
    {
        return new Player(this.x, this.y, this.vector.x, this.vector.y);
    }

    moveX()
    {
        this.x  += this.vector.x;
        this.x2 += this.vector.x;
    }

    moveY()
    {
        this.y  += this.vector.y;
        this.y2 += this.vector.y;
    }

    shot()
    {
        return new Bullet(this.x + 7, this.y + 7, this.direction);
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
        this.player = new Player(210, 250, 0, 0);
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
        this.player.keyInput();

        if (this.player.vector.x)
        {
            let futurePlayer = this.player.copyPlayer();
            futurePlayer.moveX();

            if (!this.wallManager.collision(futurePlayer) && !this.collisionCanvas(futurePlayer))
            {
                this.player.moveX();
            }
        }

        if (this.player.vector.y)
        {
            let futurePlayer = this.player.copyPlayer();
            futurePlayer.moveY();

            if (!this.wallManager.collision(futurePlayer) && !this.collisionCanvas(futurePlayer))
            {
                this.player.moveY();
            }
        }

        for (let i = 0; i < this.player.bullets.length; i++)
        {
            let futureBullet = this.player.bullets[i].copyBullet();
            futureBullet.move();

            if (!this.wallManager.collision(futureBullet) && !this.collisionCanvas(futureBullet))
            {
                this.player.bullets[i].move();
            }
            else
            {
                this.player.bullets.splice(i, 1);
            }
        }

        this.player.draw();
        if (this.player.bullets.length)
        {
            this.player.bullets.forEach(e => e.draw());
        }
        this.enemy.draw();
        this.wallManager.draw();

        if (debug)
        {
            context.font="15px 'Impact'";
            context.fillStyle="white";
            context.fillText("X : " + this.player.x + " Y : " + this.player.y, 10, 20);
            context.fillText("vecX : " + this.player.vector.x + " vecY : " + this.player.vector.y, 10, 40);
            context.fillText("Remain : " + (5 - this.player.bullets.length), 10, 60);
        }

        this.player.resetVector();
    }

    collisionCanvas(block)
    {
        if (block.x < 0) return true;
        if (block.y < 0) return true;
        if (this.canvas.width  < block.x2) return true;
        if (this.canvas.height < block.y2) return true;
        return false;
    }
}
