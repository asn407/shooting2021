// 厳格モードで実行
"use strict";

// 2Dグラフィック描写のオブジェクト
let context;

// キー押下情報
// = [] 配列型
// = {} 連想配列型
// 配列型で初期化すると動作しないので注意
let keyPush = {};

// キーを押すとフラグが上がる
window.addEventListener("keydown", (e) => {
    keyPush[e.key] = true;
});

// キーを離すとフラグが下がる
window.addEventListener("keyup", (e) => {
    keyPush[e.key] = false;
});

function resetKeyState(keyIndex)
{
    keyPush[keyIndex] = false;
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

class Bullet extends Block
{
    constructor(x1, y1, direction)
    {
        super(x1, y1, 5, 5, "yellow");
        this.direction = direction;
    }

    move()
    {
        switch (this.direction)
        {
            case "left":  this.x1--; break;
            case "up":    this.y1--; break;
            case "right": this.x1++; break;
            case "down":  this.y1++; break;
        }
    }
}

class Player extends Block
{
    constructor(x1, y1, direction)
    {
        super(x1, y1, 20, 20, "aqua");
        this.direction = direction;
    }

    copyPlayer()
    {
        return new Player(this.x1, this.y1, this.direction);
    }

    shot()
    {
        return new Bullet(this.x1, this.y1, this.direction);
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
        this.player = new Player(210, 250, "up");

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

        this.bullets = [];

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
        if (keyPush["ArrowLeft"])
        {
            this.playerVx = -1;
            this.player.direction = "left";
        }
        if (keyPush["ArrowUp"])
        {
            this.playerVy = -1;
            this.player.direction = "up";
        }
        if (keyPush["ArrowRight"])
        {
            this.playerVx = 1;
            this.player.direction = "right";
        }
        if (keyPush["ArrowDown"])
        {
            this.playerVy = 1;
            this.player.direction = "down";
        }
        if (keyPush["z"]) this.bullets.push(this.player.shot());
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

        // プレイヤーのx軸方向の当たり判定
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
        }

        // プレイヤーのy軸方向の当たり判定
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
        }

        this.player.draw();
        this.walls.forEach(ey => ey.forEach(ex => ex.draw()));

        if (this.bullets.length) this.bullets.forEach(e => e.move());
        if (this.bullets.length) this.bullets.forEach(e => e.draw());

        this.playerVx = 0;
        this.playerVy = 0;
        resetKeyState("z");
    }
}
