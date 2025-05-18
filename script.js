"use strict";



// オブジェクトの作成
let obj = {
    // 予定リスト
    todo: [],
    // 時間切れリスト
    timeout_todo: []
}

// それぞれを配置する要素を変数に代入
let list = document.getElementById("list");
let list2 = document.getElementById("list2");


// グラフィックの設定

// 残り時間によって色を変えるために三つの変数を作成
// 初期値が青色にあるようにblueに255を設定
let red = 0;
let blue = 255;
let green = 0;

// 背景にキャンパスを表示するために設定を行う
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// todoの一番上にあるフラッグの数を検知して背景色を変更する関数
function flag_check () {
    // もしリストが空の場合は青色に
    if (obj.todo.length == 0) {
        red = 0;
        blue = 255;
        green = 0;
    }

    // それ以外の条件に応じて色を変更していく
    else if (obj.todo[0][7] <= 1) {
        red = 0;
        blue = 255;
        green = 0;
    }

    else if (obj.todo[0][7] <= 2) {
        red = 255;
        blue = 0;
        green = 255;
    }

    else if (obj.todo[0][7] <= 3) {
        red = 255;
        blue = 0;
        green = 0;
    }
    
    else {
        red = 0;
        blue = 255;
        green = 0;
    }
}


// キャンパスに四角を作成するクラス
class Rect {
    constructor() {
        // それぞれの四角形ごとにランダムに設定
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = 30 + Math.random() * 40;
        this.alpha = 0.1 + Math.random() * 0.4;
        this.speedX = 1 + Math.random() * 3;
        
    }

    // x軸方向へ四角を移動する
    update() {
        this.x += this.speedX;
        if (this.x > canvas.width) {
            this.x = -this.size;
        }
    }

    // ここで描画する際の設定を行う
    draw() {
        ctx.fillStyle = `rgba(${red}, ${green}, ${blue}, ${this.size * 0.005})`;
        ctx.fillRect(this.x, this.y, this.size, this.size);
    }
}


// 描画する四角の個数を設定
const NUM = 50;
// 一度保管しておくために配列の作成ww
const rects = [];
for (let i = 0; i < NUM; i++) {
    // Rectsに格納していく
    rects.push(new Rect());
}

// renderは最後にsetInterval関数で連続して実行しアニメーションを作成する関数
function render() {
    // 更新した際に重複していかないように最初に内容をクリアにする
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // 先ほど作成したリストを実行していく
    for (let rect of rects) {
        rect.update();
        rect.draw();
    }
}

// ※最後に他の関数とまとめてレンダーも実行している

// グラフィック設定終了



// 現在時刻に関する設定開始

// 時間を取得して表示するためにそれぞれの要素へ分ける関数
function now_time() {
    const now = new Date();

    return {
        year: now.getFullYear(),
        month: Number(now.getMonth() + 1),
        date: Number(now.getDate()),
        hour: Number(now.getHours()),
        min: Number(now.getMinutes()),
        sec: now.getSeconds()
    };
}


// now_time()を読み込み表示する関数
function hyouzi() {
    // 取得しそれぞれの変数に格納
    const {year, month, date, hour, min, sec} = now_time();
    // 表示する文章の作成
    const x = `${year}年${month}月${date}日<br><span class="kazari">${hour}時${min}分${sec}秒</span>`;
    // ＩＤを取得して画面に表示
    document.getElementsByClassName("tokei")[0].innerHTML = x;
}


// 予定管理のために関数を作成

// スケジュールの内容を取得、それぞれの要素へわける
function schedule () {
    let input_date = document.getElementById("date").value;
    let input_time = document.getElementById("time").value;

    // date型へ変換しやすいようにそれぞれ抜き出す。substrは文字の途中にある単語など抜き出すときに便利
    const sch_year =  Number(input_date.substr(0, 4));
    const sch_month = Number(input_date.substr(5, 2));
    const sch_date =  Number(input_date.substr(8, 2));
    const sch_hour = Number(input_time.substr(0, 2));
    const sch_min = Number(input_time.substr(3, 2));


    // date型と表示のために抜き出した月や日をaddtask（）へ送りグローバル関数へ
    return {
    input_date: document.getElementById("date").value,
    input_time: document.getElementById("time").value,
    text: document.getElementById("text").value,
    sch_all: new Date(sch_year, sch_month - 1, sch_date, sch_hour, sch_min),
    sch_year: sch_year,
    sch_month: sch_month,
    sch_date: sch_date,
    sch_hour: sch_hour,
    sch_min: sch_min,
    }
}

// タスクをリストへ追加するための関数
function addTask() {
    // データの受け取り
    const {input_date, input_time, text, sch_all, sch_year, sch_month, sch_date, sch_hour, sch_min} = schedule();
    // 未入力の場合は追加しないよう設定
    if (text === "" || input_date === "" || input_time === "") {
        alert("未入力の欄があります！")
        return;
    }

    // この先配列で使用するため型を変更する
    // 最後の0は通知が連続して出ないよう、フラッグを立てるため追加してある
    obj.todo.push([sch_all, sch_year, sch_month, sch_date, sch_hour, sch_min, text, 0]);

    // リストの要素を比較して降順へ
    obj.todo.sort((a, b) => a[0] - b[0]);
    
    // 全ての処理が終わった後はテキストの値を空に
    document.getElementById("text").value = "";
    //更新
    updateList();
}

// 更新を行うための関数
function updateList() {
    // 更新内容を追加するために一旦リストの内容を空にする
    list.innerHTML = "";
    list2.innerHTML = "";

    // forEach()で配列をひとつづつ実際の画面へ追加
    obj.todo.forEach((item, index) => {
        // データを読み込みそれぞれの変数へ代入
        const [_sch_all, sch_year, sch_month, sch_date, sch_hour, sch_min, text, _flag] = item;
        // 実際に表示する文章の作成
        let print_bun = `${sch_year}年${sch_month}月${sch_date}日  ${sch_hour}時${sch_min}分 : ${text}`;
        // リストの作成とコンテンツの追加
        let li = document.createElement("li");
        li.textContent = print_bun;

        // ユーザーが消せるように削除ボタンの表示

        let delBtn = document.createElement("button");
        delBtn.textContent = "削除";

        // クリックした時にリムーブタスクを実行
        // その際にindexを渡す
        delBtn.addEventListener("click", function(){
            removeTask(index)})

            // 親子関係の定義
        li.appendChild(delBtn);
        list.appendChild(li);
        });

    // 時間切れリストの方も同様に表示していく
    obj.timeout_todo.forEach((item, index) => {
        const [_sch_all, sch_year, sch_month, sch_date, sch_hour, sch_min, text] = item;
        let print_bun = `${sch_year}年${sch_month}月${sch_date}日  ${sch_hour}時${sch_min}分 : ${text}`;

        let li2 = document.createElement("li");
        li2.textContent = print_bun;

        let delBtn2 = document.createElement("button");
        delBtn2.textContent = "削除";

        delBtn2.addEventListener("click", function(){
            removeTask2(index)})

        li2.appendChild(delBtn2);
        list2.appendChild(li2);
        });
        saveData();
}

// タスクの削除
function removeTask(index) {
    obj.todo.splice(index, 1);
    updateList();
}

// 時間切れリストのタスクの削除
function removeTask2(index) {
    obj.timeout_todo.splice(index, 1);
    updateList();
}

// 時間切れになった際、タスクの位置の変更
function moveTask(i) {
    let tmp = obj.todo[i];
    obj.todo.splice(i, 1);
    obj.timeout_todo.push(tmp);
    updateList();
}

// タスクの保存
function saveData() {
    localStorage.setItem("todo", JSON.stringify(obj.todo));
}

function LoadData() {
    // ローカルストレージからデータがあった場合取り出して保管
    let data = localStorage.getItem("todo");
    obj.todo = data ? JSON.parse(data) : [];
    // リストを更新
    updateList();
}


// ボタンを押した際に全てを空に
function clearStorage() {
    localStorage.removeItem("todo");
    obj.todo = [];
    updateList();
}


// 現在の時間と予定時間の比較を常に行う関数
function chektime () {
    // リストの順番が変わらないように最後にまとめてタイムアウトリストへ移動するための一時保存リスト
    let tmp_list = [];

    // リストをfor文で一つ一つチェック
    for (let i = 0; i < obj.todo.length; i++) {
        const [sch_all, sch_year, sch_month, sch_date, sch_hour, sch_min, text, currentFlag] = obj.todo[i];
        const rest_list = countdown(sch_all); 
        let flag = currentFlag;
        let message = "";

        const [days, hours, minutes, seconds] = rest_list;

        // 過去の予定をタイムアウトリストへ
        if (days < 0 && hours < 0 && minutes < 0 && seconds < 0) {
            tmp_list.push(i);
        }

        // 段階的に通知を出す

        if (days <= 0 && hours < 3 && flag <= 0) {
            message = "3時間前";
            flag = 1;
        }

        if (days <= 0 && hours <= 0 && flag <= 1) {
            message = "残り時間1時間以内！";
            flag = 2;
        }
        if (days <= 0 && hours <= 0 && minutes < 5 && flag <= 2) {
            message = "5分前";
            flag = 3;
        }
        if (days <= 0 && hours <= 0 && minutes <= 0 && seconds <= 0 && flag <= 3) {
            message = "時間切れ";
            flag = 4;
            tmp_list.push(i);
        }

        // フラッグのデータを保存しておく
        obj.todo[i][7] = flag;

        // messageがない（何も基準に達してない）やつ以外はアラートをだす
        if (message !== "") {
            alert(`${message} ${sch_year}年${sch_month}月${sch_date}日 ${sch_hour}時${sch_min}分 : ${text}`);
        }
    }

    // for文がおわった段階でリストを削除
    for (let j of tmp_list) {
        moveTask(j);
    }
    // 削除後に一番上のタスクがどんなフラッグか確認し背景色の設定
    flag_check ()
}

// カウントダウンタイマーを使い今の時間と予定時間の差を出す関数
function countdown (ans) {
    // 今の時間の読み込み
    const now = new Date();
    // 差を表示
    const rest = ans.getTime() - now.getTime();

    const sec = Math.floor(rest / 1000) % 60;
    const min = Math.floor(rest / 1000 / 60) % 60;
    const hour = Math.floor(rest / 1000 / 60 / 60) % 24;
    const day = Math.floor(rest / 1000 / 60 / 60 / 24);
    const count = [day, hour, min, sec];
    return count;
}

// 毎秒チェック（setIntervalで1秒ごとにtime関数を呼ぶ）
setInterval(hyouzi, 1000);
setInterval(chektime, 1000);
setInterval(render, 100);