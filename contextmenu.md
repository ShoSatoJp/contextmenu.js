# ContextMenu.js
## コンテキストメニューの書き方
### インポート
```html
<link rel="stylesheet" href="contextmenu.css">
<script src="contextmenu.js"></script>
```
### 使えるCSSクラス
|クラス|   |
|---|---|
|```contextmenu```|コンテキストメニュー|
|```contextmenu-item```|メニューアイテム|
|```contextmenu-icon```|メニューアイテムのアイコン|
|```contextmenu-text```|メニューアイテムのテキスト|
|```contextmenu-hr```|メニューアイテムの区切り|
|```contextmenu-item-check```|チェックボックスにするメニューアイテム|
|```contextmenu-item-radio```|ラジオボタンにするメニューアイテム|

### 使えるHTML属性
|属性|   |
|---|---|
|```onmenu```|メニューアイテムクリック時の動作。変数```$$```にエリアの```data-contextmenu```属性で指定したデータが入る|
|```value```|チェックボックス・ラジオボタンの値|
|```name```|ラジオボタンのグループ化|

### 例
```html
<div class="contextmenu">
    <!-- メニューアイテム -->
    <div class="contextmenu-item"></div>
    <!-- メニューアイテム アイコン指定-->
    <div class="contextmenu-item">
        <div class="contextmenu-icon"></div>
    </div>
    <!-- メニューアイテム アイコン・テキスト要素指定-->
    <div class="contextmenu-item">
        <div class="contextmenu-icon"></div>
        <div class="contextmenu-text"></div>
    </div>
    <!-- メニューアイテム 子コンテキストメニュー-->
    <div class="contextmenu-item">
        <div class="contextmenu">
            <div class="contextmenu-item"></div>
        </div>
    </div>
    <!-- 区切り -->
    <div class="contextmenu-hr"></div>
    <!-- メニューアイテム チェックボックス-->
    <div class="contextmenu-item contextmenu-item-check" value="true"></div>
    <!-- メニューアイテム ラジオボタン-->
    <div class="contextmenu-item contextmenu-item-radio" name="radio1" value="false"></div>
    <div class="contextmenu-item contextmenu-item-radio" name="radio1"></div>
    <!-- メニューアイテム onmenu属性-->
    <div class="contextmenu-item" onmenu="console.log('hoge');"></div>
    <!-- メニューアイテム onmenu属性 変数$$-->
    <div class="contextmenu-item" onmenu="console.log($$);"></div>
</div>
```

## 初期化
``` js
new ContextMenu([contextmenu]: String | Element,
                [area] : String | Element, 
                [option?] = {
                    arrow: '>',
                    check_true: 'T',
                    check_false: 'F',
                    radio_true: 'T',
                    radio_false: 'F',
});
```
|引数|型||
|---|---|---|
|```contextmenu```|```String``` ```Element```|コンテキストメニュー|
|```area```|```String``` ```Element```|有効エリア|
|```option```|```Object```|オプション|
|```option.arrow```|```String```|子コンテキストメニューの表示|
|```option.check_true```|```String```|チェックボックスが```true```の時のアイコン|
|```option.check_false```|```String```|チェックボックスが```false```の時のアイコン|
|```option.radio_true```|```String```|ラジオボタンが```true```の時のアイコン|
|```option.radio_false```|```String```|ラジオボタンが```false```の時のアイコン|
``` js
var contextmenu = new ContextMenu('#contextmenu', '#area');

var contextmenu = new ContextMenu(document.querySelector('#contextmenu'), '#area');

var contextmenu = new ContextMenu('#contextmenu', '#area', {
    arrow: '<i class="fas fa-chevron-right"></i>',
    check_true: '<i class="fas fa-check"></i>',
    check_false: '<i class="fas fa-times"></i>',
    radio_true: '<i class="far fa-dot-circle"></i>',
    radio_false: '<i class="far fa-circle"></i>',
});
```

## エリアの書き方
```html
<div data-contextmenu="data">
```
```data-contextmenu```に指定したデータがコンテキストメニューの```onmenu```属性の変数```$$```に入る

## ```ContextMenu```のメソッド
|メソッド|   |引数|戻り値|
|---|---|---|---|
|```constructor```|コンストラクタ|||
|```setArea```|エリアの再指定<br>動的に追加される要素には追加後にこのメソッドを適用する必要があります。|```area_selector : String```エリア指定セレクタ<br>```events : Object```適用するイベント|```void```|
|```addArea```|エリアの追加|```el : Element```適用対象要素<br>```events : Object```適用するイベント|```void```|

## ```ContextMenu```のプロパティ
|プロパティ|型||
|---|---|---|
|```option```|```Object```|オプション|
|```parent```|```ContextMenu```|親コンテキストメニュー|
|```contextmenu```|```Element```|コンテキストメニュー|
|```size```|```DOMRect```|コンテキストメニューのサイズ|
|```data```|```String```|```data-contextmenu```のデータ|
|```isopen```|```Boolean```|コンテキストメニューの状態|
|```childmenu```|```Array``` of ```ContextMenu```|子コンテキストメニュー|
|```isopen```|```Boolean```|コンテキストメニューの状態|
|```area_selector```|```String```|エリアのセレクター|
