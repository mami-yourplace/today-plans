const today = new Date();

document.getElementById("today").textContent =
    today.getFullYear() + "年" + (today.getMonth() + 1) + "月" + today.getDate() + "日";

document.getElementById("save-button").addEventListener("click", function() {
if (document.getElementById("plan").value.trim() === "") {
    return
}    

if (editingItem === null) {

    plans.push({
            date: document.getElementById("plan-date").value,
            plan: document.getElementById("plan").value
        });

} else {

    editingItem.date = document.getElementById("plan-date").value;
    editingItem.plan = document.getElementById("plan").value;

    // 編集を終了する
    editingItem = null;
    document.getElementById("save-button").textContent = "保存";
}
    localStorage.setItem("plans", JSON.stringify(plans));
    showCompleted = false;
        showPlans();
    // document.getElementById("saved-plan").textContent = "保存しました！";
        localStorage.setItem("plan-date", document.getElementById("plan-date").value);  // 日付を保存
        document.getElementById("plan").value = "";

        // 保存後に日付もクリアしたい場合は有効にする
        document.getElementById("plan-date").value = "";
    });

let plans = JSON.parse(localStorage.getItem("plans")) || [];  // 保存済みの予定を配列に戻す。保存がなければ空の配列を用意する
// 編集中の予定を覚えておく
let editingItem = null;

// どちらの一覧を表示するか
let showCompleted = false;

// 完了した予定ボタンの処理
document.getElementById("completed-button").addEventListener("click", function() {
    showCompleted = true;
    showPlans();

});

// 未完了の予定ボタンの処理
document.getElementById("active-button").addEventListener("click", function() {
    showCompleted = false;
    showPlans();

});

function showPlans() {
    document.getElementById("active-button").classList.toggle("selected", showCompleted === false);
    document.getElementById("completed-button").classList.toggle("selected", showCompleted === true);

    document.getElementById("saved-plan").textContent = "";

for (const item of plans) {

    // チェックが入っていない予定だけを表示する
    if (showCompleted === false && item.completed === true) {
        continue;
    }

    // チェックが入っている予定だけを表示する
    if (showCompleted === true && item.completed !== true) {
        continue;
    }

    const row = document.createElement("div");  // row は変数名 <div> は文字やボタンなどをまとめるために使う要素
    row.className = "plan-row";

    const content = document.createElement("div");
    content.className = "plan-content";
    row.appendChild(content);

    const date = document.createElement("div");
    date.className = "plan-day";
    date.textContent = item.date;
    content.appendChild(date);

    const plan = document.createElement("div");
    plan.textContent = item.plan;
    content.appendChild(plan);

    // チェックボックスを作る
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";

    // 保存されたチェックの状態を反映する
    checkbox.checked = item.completed;

    row.prepend(checkbox); // prepend 一番前

    // チェックの状態が変わったときの処理
    checkbox.addEventListener("change", function() {
        item.completed = checkbox.checked;
        localStorage.setItem("plans", JSON.stringify(plans));
        showPlans();

    });

    const button = document.createElement("button");  // 要素を新しく作る = "button"が作りたい要素
    button.textContent = "編集";  // 「編集」という文字をbuttonに入れる

    button.addEventListener("click", function() {

        document.getElementById("plan-date").value = item.date;
        document.getElementById("plan").value = item.plan;
        document.getElementById("save-button").textContent = "更新";

        editingItem = item;

    });

    row.appendChild(button); // appendChild 一番後ろ
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "削除";
    deleteButton.addEventListener("click", function() {
        if (confirm("この予定を削除しますか？")) {
            console.log("削除します");
            plans = plans.filter(p => p !== item); // => アロー関数
            // plans = plans.filter(function(p) {
                // return p !== item});
            localStorage.setItem("plans", JSON.stringify(plans));
            showPlans();
        }
    })
    row.appendChild(deleteButton);

    document.getElementById("saved-plan").appendChild(row);

    // document.getElementById("saved-plan").textContent +=
    //     item.date + "　" + item.plan + "\n";
    }
}

showPlans();
