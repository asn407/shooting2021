"use strict";

const canvas = document.getElementById("canvas");
const canvasContext = canvas.getContext("2d");

let keyPush = {};

window.addEventListener("keydown", (e) => {
    keyPush[e.key] = true;
});

window.addEventListener("keyup", (e) => {
    keyPush[e.key] = false;
});

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
    constructor(x1, y1, width, height, color)
    {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x1 + width;
        this.y2 = y1 + height;
        this.width = width;
        this.height = height;
        this.color = color;
    }

    draw()
    {
        canvasContext.fillStyle = this.color;
        canvasContext.fillRect(this.x1, this.y1, this.width, this.height);
    }
}

class Wall extends Block
{
    constructor(x1, y1)
    {
        super(x1, y1, 40, 40, "red");
    }
}

class Bullet extends Block
{
    constructor(x1, y1, direction)
    {
        super(x1, y1, 6, 6, "yellow");
        this.direction = direction;
        this.speed = 2;
    }

    copyBullet()
    {
        return new Bullet(this.x1, this.y1, this.direction);
    }
}

class Enemy extends Block
{
    constructor(x1, y1, name)
    {
        super(x1, y1, 20, 20, "white");
        this.name = name;
    }
}

class Player extends Block
{
    constructor(x1, y1)
    {
        super(x1, y1, 20, 20, "aqua");
        this.direction = "up";
        this.vector = new Vector(0, 0);
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

        if (keyPush["z"] && this.bullets.length < 5) this.bullets.push(this.shot());
    }

    copyPlayer()
    {
        return new Player(this.x1, this.y1);
    }

    resetVector()
    {
        this.vector.x = 0;
        this.vector.y = 0;
    }

    shot()
    {
        return new Bullet(this.x1 + 7, this.y1 + 7, this.direction);
    }
}

class Game
{
    constructor()
    {
        this.loopReqest = null;
        this.dontMove = false;
        this.player = new Player(210, 250);
        this.enemy = new Enemy(210, 90, "L");
        this.walls = [];
        for (let i = 0; i < 5; i++)
        {
            this.walls[i] = [];
            for (let j = 0; j < 5; j++)
            {
                this.walls[i][j] = new Wall(j * 80 + 40, i * 80 + 40);
            }
        }

        this.loop();
    }

    loop()
    {
        canvasContext.clearRect(0, 0, canvas.width, canvas.height);
        this.update();
        this.loopReqest = window.requestAnimationFrame(this.loop.bind(this));
    }

    update()
    {
        this.player.keyInput();

        // プレイヤーと壁との当たり判定
        this.dontMove = false;
        for (let y = 0; y < 5; y++)
        {
            for (let x = 0; x < 5; x++)
            {
                if (this.player.vector.x || this.player.vector.y)
                {
                    let futurePlayer = this.player.copyPlayer();
                    futurePlayer.x1 += this.player.vector.x;
                    futurePlayer.x2 += this.player.vector.x;
                    futurePlayer.y1 += this.player.vector.y;
                    futurePlayer.y2 += this.player.vector.y;
        
                    if (this.collisionObject(futurePlayer, this.walls[y][x])) dontMove = true;
                    if (this.collisionFrame(futurePlayer)) dontMove = true;
                }
            }
        }

        if (dontMove == false)
        {
            this.player.x1 += this.player.vector.x;
            this.player.x2 += this.player.vector.x;
            this.player.y1 += this.player.vector.y;
            this.player.y2 += this.player.vector.y;
        }

        // プレイヤーの弾と壁の当たり判定
        this.dontMove = false;
        for (let y = 0; y < 5; y++)
        {
            for (let x = 0; x < 5; x++)
            {
                for (let i = 0; i < this.player.bullets.length; i++)
                {
                    let futureBullet = this.player.bullets[i].copyBullet();
                    switch (futureBullet.direction)
                    {
                        case "left":  futureBullet.x1 -= this.speed; break;
                        case "up":    futureBullet.y1 -= this.speed; break;
                        case "right": futureBullet.x1 += this.speed; break;
                        case "down":  futureBullet.y1 += this.speed; break;
                    }
                    if (this.collisionObject(futureBullet, this.walls[y][x])) dontMove = true;
                    if (this.collisionFrame(futureBullet)) dontMove = true;
                }
            }
        }

        if (dontMove == false)
        {
            for (let i = 0; i < this.player.bullets.length; i++)
            {
                switch (this.player.bullets[i].direction)
                {
                    case "left":  this.player.bullets[i].x1 -= this.player.bullets[i].speed; break;
                    case "up":    this.player.bullets[i].y1 -= this.player.bullets[i].speed; break;
                    case "right": this.player.bullets[i].x1 += this.player.bullets[i].speed; break;
                    case "down":  this.player.bullets[i].y1 += this.player.bullets[i].speed; break;
                }
            }
        }
        else
        {
            this.player.bullets.shift();
        }

        this.player.draw();
        this.enemy.draw();
        this.walls.forEach(ey => ey.forEach(ex => ex.draw()));
        if (this.bullets.length) this.bullets.forEach(e => e.draw());
        this.player.resetVector();
        this.resetKeyState("z");
    }

    collisionFrame(o)
    {
        if (o.x1 <= 0) return true;
        if (o.y1 <= 0) return true;
        if (canvas.width  <= o.x2) return true;
        if (canvas.height <= o.y2) return true;
        return false;
    }

    collisionObject(o1, o2)
    {
        if (o1.x2 <= o2.x1) return false;
        if (o1.y2 <= o2.y1) return false;
        if (o2.x2 <= o1.x1) return false;
        if (o2.y2 <= o1.y1) return false;
        return true;
    }

    resetKeyState(keyIndex)
    {
        keyPush[keyIndex] = false;
    }
}
