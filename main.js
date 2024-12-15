// 厳格モードで実行
"use strict";

// 2Dグラフィック描写のオブジェクト
let context;

// キー押下情報
// = [] 配列型
// = {} 連想配列型
// 配列型で初期化すると動作しないので注意
let keyFlag = {};

// キーを押したらフラグが立つ
window.addEventListener("keydown", (e) => {
    keyFlag[e.key] = true;
});

// キーを離すとフラグが降りる
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
        this.canvas = document.getElementById("canvas");

        // 2Dグラフィック描写のオブジェクトを取得
        context = this.canvas.getContext("2d");

        this.loopReqest = null;

        // プレイヤーの方向ベクトル
        // プレイヤーの当たり判定に用いる
        this.playerVx = 0;
        this.playerVy = 0;

        // オブジェクトのインスタンス化
        this.player = new Player(210, 250);

        // オブジェクトのインスタンス化
        // 5x5の多次元配列に格納する
        this.walls = []
        for (let i = 0; i < 5; i++)
        {
            this.walls[i] = []
            for (let j = 0; j < 5; j++)
            {
                this.walls[i][j] = new Wall(j * 80 + 40, i * 80 + 40);
            }
        }

        // メインループ実行
        this.loop();
    }

    loop()
    {
        // 画面を初期化
        context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        // ゲームを更新
        this.update();

        // スクリーンに反映
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
        // 壁と衝突しているかの判定
        for (let i = 0; i < 5; i++)
        {
            for (let j = 0; j < 5; j++)
            {
                if (futurePlayer.x2 <= this.walls[i][j].x1) continue;
                if (futurePlayer.y2 <= this.walls[i][j].y1) continue;
                if (this.walls[i][j].x2 <= futurePlayer.x1) continue;
                if (this.walls[i][j].y2 <= futurePlayer.y1) continue;
                return false;
            }
        }

        // 画面枠と衝突しているかの判定
        if (futurePlayer.x1 <= 0) return false;
        if (futurePlayer.y1 <= 0) return false;
        if (this.canvas.width <= futurePlayer.x2) return false;
        if (this.canvas.height <= futurePlayer.y2) return false;

        return true;
    }

    update()
    {
        // キー入力更新
        this.action();

        // プレイヤーのx軸方向の当たり判定ジャッジ
        if (this.playerVx)
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

        // プレイヤーのy軸方向の当たり判定ジャッジ
        if (this.playerVy)
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
