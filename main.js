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

// プレイヤーの当たり判定に用いる
class Vector
{
    constructor(x, y)
    {
        this.x = x;
        this.y = y;
    }
}

// 基底クラス
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
    constructor(x1, y1, size)
    {
        super(x1, y1, size, size, "red");
    }
}

class Bullet extends Block
{
    constructor(x1, y1, size, direction, speed)
    {
        super(x1, y1, size, size, "yellow");
        this.size = size;
        this.direction = direction;
        this.speed = speed;
    }

    copyBullet()
    {
        return new Bullet(this.x1, this.y1, this.size, this.direction);
    }

    move()
    {
        switch (this.direction)
        {
            case "left":  this.x1 -= this.speed; break;
            case "up":    this.y1 -= this.speed; break;
            case "right": this.x1 += this.speed; break;
            case "down":  this.y1 += this.speed; break;
        }
    }

    futureMove()
    {
        let futureBullet = this.copyBullet();
        switch (this.direction)
        {
            case "left":  futureBullet.x1 -= this.speed; break;
            case "up":    futureBullet.y1 -= this.speed; break;
            case "right": futureBullet.x1 += this.speed; break;
            case "down":  futureBullet.y1 += this.speed; break;
        }

        return futureBullet;
    }
}

class EnemyBullet extends Bullet
{}

class Enemy extends Block
{
    constructor(x1, y1, size, name)
    {
        super(x1, y1, size, size, "white");
        this.name = name;
    }
}

class Player extends Block
{
    constructor(x1, y1, size, direction)
    {
        super(x1, y1, size, size, "aqua");
        this.size = size;
        this.direction = direction;
        this.vector = new Vector(0, 0);
    }

    copyPlayer()
    {
        return new Player(this.x1, this.y1, this.size, this.direction);
    }

    resetVector()
    {
        this.vector.x = 0;
        this.vector.y = 0;
    }

    shot()
    {
        return new Bullet(this.x1 + 7, this.y1 + 7, 6, this.direction, 2);
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

        // ループリクエスト
        // ループキャンセルの引数として使用する
        this.loopReqest = null;

        // オブジェクトのインスタンス化
        this.player = new Player(210, 250, 20, "up");
        this.enemy = new Enemy(210, 90, 20, "L");

        // オブジェクトのインスタンス化
        // 5x5の多次元配列に格納する
        this.walls = []
        for (let i = 0; i < 5; i++)
        {
            this.walls[i] = [];
            for (let j = 0; j < 5; j++)
            {
                this.walls[i][j] = new Wall(j * 80 + 40, i * 80 + 40, 40);
            }
        }

        // 弾オブジェクトを格納する配列
        // 初期段階は空
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

    // キー入力時の処理
    action()
    {
        if (keyPush["ArrowLeft"])
        {
            this.player.vector.x = -1;
            this.player.direction = "left";
        }
        if (keyPush["ArrowUp"])
        {
            this.player.vector.y = -1;
            this.player.direction = "up";
        }
        if (keyPush["ArrowRight"])
        {
            this.player.vector.x = 1;
            this.player.direction = "right";
        }
        if (keyPush["ArrowDown"])
        {
            this.player.vector.y = 1;
            this.player.direction = "down";
        }
        if (keyPush["z"] && this.bullets.length < 5) this.bullets.push(this.player.shot());
    }

    isObjectDontTouchWallsAndFrame(futureObject)
    {
        // 壁と衝突しているかの判定
        for (let i = 0; i < 5; i++)
        {
            for (let j = 0; j < 5; j++)
            {
                if (futureObject.x2 <= this.walls[i][j].x1) continue;
                if (futureObject.y2 <= this.walls[i][j].y1) continue;
                if (this.walls[i][j].x2 <= futureObject.x1) continue;
                if (this.walls[i][j].y2 <= futureObject.y1) continue;
                return false;
            }
        }

        // 画面枠と衝突しているかの判定
        if (futureObject.x1 <= 0) return false;
        if (futureObject.y1 <= 0) return false;
        if (this.canvas.width <= futureObject.x2) return false;
        if (this.canvas.height <= futureObject.y2) return false;

        return true;
    }

    resetKeyState(keyIndex)
    {
        keyPush[keyIndex] = false;
    }

    update()
    {
        // キー入力更新
        this.action();

        // プレイヤーのx軸方向の当たり判定
        if (this.player.vector.x)
        {
            let futurePlayer = this.player.copyPlayer();
            futurePlayer.x1 += this.player.vector.x;
            futurePlayer.x2 += this.player.vector.x;

            if (this.isObjectDontTouchWallsAndFrame(futurePlayer))
            {
                this.player.x1 += this.player.vector.x;
                this.player.x2 += this.player.vector.x;
            }
        }

        // プレイヤーのy軸方向の当たり判定
        if (this.player.vector.y)
        {
            let futurePlayer = this.player.copyPlayer();
            futurePlayer.y1 += this.player.vector.y;
            futurePlayer.y2 += this.player.vector.y;

            if (this.isObjectDontTouchWallsAndFrame(futurePlayer))
            {
                this.player.y1 += this.player.vector.y;
                this.player.y2 += this.player.vector.y;
            }
        }

        // 弾の当たり判定
        for (let i = 0; i < this.bullets.length; i++)
        {
            let futureBullet = this.bullets[i].futureMove();

            if (this.isObjectDontTouchWallsAndFrame(futureBullet))
            {
                // 壁や画面枠に触れていない
                this.bullets[i].move();
            }
            else
            {
                // 壁や画面枠に触れている -> 弾を消去
                this.bullets.shift();
            }
        }

        this.player.draw();
        this.enemy.draw();
        this.walls.forEach(ey => ey.forEach(ex => ex.draw()));
        if (this.bullets.length) this.bullets.forEach(e => e.draw());

        this.player.resetVector();
        this.resetKeyState("z");
    }
}
