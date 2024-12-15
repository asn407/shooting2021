// 厳格モードで実行
"use strict";

// 2Dグラフィック描写のオブジェクト
let context;

// キー押下情報
// = [] 配列型
// = {} 連想配列型
// 配列型で初期化すると動作しないので注意
let keyFlag = {};

window.addEventListener("keydown", (e) => {
    keyFlag[e.key] = true;
});

window.addEventListener("keyup", (e) => {
    keyFlag[e.key] = false;
});

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
        context.fillStyle = this.color;
        context.fillRect(this.x1, this.y1, this.width, this.height);
    }
}

class Wall extends Block
{
    constructor(x1, y1)
    {
        super(x1, y1, 40, 40, "red");
    }
}

class Player extends Block
{
    constructor(x1, y1)
    {
        super(x1, y1, 20, 20, "aqua");
    }

    copyPlayer()
    {
        return new Player(this.x1, this.y1);
    }
}

class Main
{
    constructor()
    {
        // 図形描写の初期化
        let canvas = document.getElementById("canvas");

        // 2Dグラフィック描写のオブジェクトを取得
        context = canvas.getContext("2d");

        this.loopReqest = null;
        this.playerVx = 0;
        this.playerVy = 0;
        this.player = new Player(2, 220);

        this.walls = []
        for (let i = 0; i < 5; i++)
        {
            this.walls[i] = []
            for (let j = 0; j < 5; j++)
            {
                this.walls[i][j] = new Wall(j * 80 + 40, i * 80 + 40);
            }
        }

        this.loop();
    }

    loop()
    {
        context.clearRect(0, 0, canvas.width, canvas.height);
        this.update();

        // requestAnimationFrame のコールバックとして this.loop を渡す際に，
        // this のコンテキストを維持するために bind(this) を使用する
        this.loopReqest = window.requestAnimationFrame(this.loop.bind(this));
    }

    action()
    {
        if (keyFlag["ArrowLeft"])  this.playerVx = -1;
        if (keyFlag["ArrowUp"])    this.playerVy = -1;
        if (keyFlag["ArrowRight"]) this.playerVx = 1;
        if (keyFlag["ArrowDown"])  this.playerVy = 1;
    }

    isPlayerMoveable(futurePlayer)
    {
        for (let i = 0; i < 5; i++)
        {
            for (let j = 0; j < 5; j++)
            {
                if (futurePlayer.x2 < this.walls[i][j].x1) continue;
                if (futurePlayer.y2 < this.walls[i][j].y1) continue;
                if (this.walls[i][j].x2 < futurePlayer.x1) continue;
                if (this.walls[i][j].y2 < futurePlayer.y1) continue;
                return false;
            }
        }

        return true;
    }

    update()
    {
        this.action();
        if (this.playerVx !== 0)
        {
            let futurePlayer = this.player.copyPlayer();
            futurePlayer.x1 += this.playerVx;
            futurePlayer.x2 += this.playerVx;

            if (this.isPlayerMoveable(futurePlayer))
            {
                this.player.x1 += this.playerVx;
                this.player.x2 += this.playerVx;
            }

            this.playerVx = 0;
        }

        if (this.playerVy !== 0)
        {
            let futurePlayer = this.player.copyPlayer();
            futurePlayer.y1 += this.playerVy;
            futurePlayer.y2 += this.playerVy;

            if (this.isPlayerMoveable(futurePlayer))
            {
                this.player.y1 += this.playerVy;
                this.player.y2 += this.playerVy;
            }

            this.playerVy = 0;
        }

        this.player.draw();
        this.walls.forEach(ey => ey.forEach(ex => ex.draw()));
    }
}
