// 厳格モードで実行
"use strict";

function start()
{
    // 図形描写の初期化
    let canvas = document.getElementById("canvas");
    // 2dグラフィックを描写するためのメソッドやプロパティを持つオブジェクトを取得
    let context = canvas.getContext("2d");

    // テスト
    // 描画する色を指定するプロパティ => fillStyle
    context.fillStyle = "red";

    // 四角形を描画するメソッド => fillRect()
    context.fillRect(15, 10, 150, 100);
}