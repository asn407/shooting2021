// 厳格モードで実行
"use strict";
// 2dグラフィックを描写するためのオブジェクトを格納するグローバル変数
let context;

class Rectagle
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

class Character extends Rectagle
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
        this.character = new Character();
        this.update()
    }

    mainLoop()
    {
        context.clearRect(0, 0, 440, 440);
        this.update();
        this.loopReqest = window.requestAnimationFrame(this.mainLoop);
    }

    update()
    {
        this.character.draw();
    }
}
