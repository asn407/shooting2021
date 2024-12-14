// 厳格モードで実行
"use strict";
// 2Dグラフィック描写のオブジェクト
let context;
// キー押下情報
let keyFlag = [];

let loopReqest = null;

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

class Player extends Block
{
    constructor()
    {
        super(300, 300, 20, 20, "aqua");
    }

    move()
    {
        if (keyFlag["ArrowLeft"] === true)
        {
            this.x--;
        }
        if (keyFlag["ArrowUp"])    this.y--;
        if (keyFlag["ArrowRight"]) this.x++;
        if (keyFlag["ArrowDown"])  this.y++;
        if (keyFlag["w"])          this.x--;
        if (keyFlag["a"])          this.y--;
        if (keyFlag["s"])          this.x++;
        if (keyFlag["d"])          this.y++;
    }
}



function main()
{
    // 図形描写の初期化
    let canvas = document.getElementById("canvas");
    // 2Dグラフィック描写オブジェクトを取得
    context = canvas.getContext("2d");

    let player = new Player();
}

function loop()
{
    player.draw();
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
        this.player = new Player();

        this.loop();
    }

    loop()
    {
        this.update();
        // context.clearRect(0, 0, 440, 440);
        this.loopReqest = window.requestAnimationFrame(this.loop());
    }

    update()
    {
        this.player.move();
        this.player.draw();
    }
}