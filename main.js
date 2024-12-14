// 厳格モードで実行
"use strict";
// 2dグラフィックを描写するためのオブジェクトを格納するグローバル変数
let context;

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
    {}
}

class Main
{
    constructor()
    {
        // 図形描写の初期化
        let canvas = document.getElementById("canvas");
        // 2dグラフィックを描写するためのオブジェクトを取得
        context = canvas.getContext("2d");

        this.loopReqest = null;
        this.player = new Player();
        this.update()
    }

    loop()
    {
        context.clearRect(0, 0, 440, 440);
        this.update();
        this.loopReqest = window.requestAnimationFrame(this.loop);
    }

    update()
    {
        this.player.draw();
    }
}
