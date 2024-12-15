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
    constructor(x, y, width, height, color)
    {
        this.x = x;
        this.y = y;
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

class Player extends Block
{
    constructor(x, y)
    {
        super(x, y, 20, 20, "aqua");
    }

    move()
    {
        if (keyFlag["ArrowLeft"])  this.x--;
        if (keyFlag["ArrowUp"])    this.y--;
        if (keyFlag["ArrowRight"]) this.x++;
        if (keyFlag["ArrowDown"])  this.y++;
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
        this.player = new Player(300, 300);

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

    update()
    {
        this.player.move();
        this.player.draw();
        this.walls.forEach(ey => ey.forEach(ex => ex.draw()));
    }
}
