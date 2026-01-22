## 🛡 今日も無事？（見守りチェックインアプリ）

家族や大切な人が「今日も無事」であることを、

1日1回ボタンを押すだけで確認できる Web アプリです。

## 🔗 デモ

Web アプリ：

https://mimamori-web-ten.vercel.app

## 💡 主な機能

メールアドレス / パスワードによるログイン

「今日も無事」ボタンによるチェックイン

当日分の二重登録防止

今日の状態（確認済み / 未確認）の表示

JST（日本時間）基準での日付管理

## 🧱 技術構成

フロントエンド

React + TypeScript（Vite）

Vercel にデプロイ

## バックエンド

Firebase

Authentication（メール / パスワード）

Cloud Functions（HTTP API）

Firestore

## 🗂 データ設計

users/{uid}/checkins/{YYYY-MM-DD}

日付キーは サーバー側で生成（JST）

すでに存在する場合は再登録せず、状態のみ返却

## 🔐 セキュリティ / 工夫点

Firebase Auth の ID トークンを使った API 認証

Cloud Functions 側でトークン検証

CORS を本番ドメインのみに限定

ローカル / 本番で API URL を環境変数で切り替え

## 🚀 今後の改善予定

見守り側（家族）用の一覧画面

未チェック時の通知（メール / Push）

デザインの改善