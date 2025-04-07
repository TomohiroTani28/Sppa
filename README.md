# Sppa - バリ島のセラピストと観光客をつなぐ次世代 SNS プラットフォーム

<div align="center">
  <img src="public/images/sppa.png" alt="Sppa Logo" width="200"/>
  <br/>
  <p>
    <strong>バリ島のセラピストと観光客をつなぐ、リアルタイム翻訳付きSNSプラットフォーム</strong>
  </p>
  <p>
    <a href="#概要">概要</a> •
    <a href="#主な機能">主な機能</a> •
    <a href="#技術スタック">技術スタック</a> •
    <a href="#開発環境">開発環境</a> •
    <a href="#参加方法">参加方法</a> •
    <a href="#今後の展望">今後の展望</a>
  </p>
</div>

## 概要

Sppa は、バリ島のセラピストと世界各国の観光客をつなぐ、コンテンツファーストの SNS プラットフォームです。リアルタイムチャット、インスタント予約管理、多言語翻訳機能を備え、言語の壁を超えたコミュニケーションを実現します。

### 🌟 特徴

- **リアルタイムコミュニケーション**: チャット、予約、通知がリアルタイムで更新
- **多言語対応**: 自動翻訳機能で言語の壁を解消
- **コンテンツファースト**: 写真や動画を中心とした直感的な UI
- **コミュニティ駆動**: ユーザーの声を反映した継続的な改善

## 主な機能

### 🏠 ホームフィード

- パーソナライズされたコンテンツ表示
- トレンド投稿のハイライト
- おすすめセラピストの表示

### 🔍 検索・発見

- 詳細なフィルタリング機能
- 地図ベースの検索
- リアルタイム空き状況表示

### 💬 チャット

- リアルタイム翻訳付きメッセージング
- メディア共有機能
- テンプレートメッセージ

### 📅 予約管理

- インスタント予約
- カレンダー連携
- リマインダー通知

## 技術スタック

### 🎨 フロントエンド

- Next.js 14
- React
- Tailwind CSS
- Shadcn UI

### 🔧 バックエンド

- Hasura
- Supabase
- PostgreSQL
- GraphQL

### 🌐 その他

- WebSocket
- LibreTranslate
- Docker
- GitHub Actions

## 開発環境

### 必要条件

- Node.js 18 以上
- pnpm
- Docker & Docker Compose

### セットアップ手順

1. リポジトリのクローン

```bash
git clone https://github.com/TomohiroTani28/Sppa.git
cd Sppa
```

2. 依存パッケージのインストール

```bash
pnpm install
```

3. 環境変数の設定

```bash
cp .env.example .env.development
```

4. 開発サーバーの起動

```bash
pnpm dev
```

## 参加方法

Sppa は、オープンなコミュニティとして開発を進めています。以下の方法で参加できます：

- [Issues](https://github.com/TomohiroTani28/Sppa/issues)での議論
- [Discussions](https://github.com/TomohiroTani28/Sppa/discussions)での提案
- [Slack](https://sppaworld.slack.com)でのコミュニケーション

## 今後の展望

- **グローバル展開**: 主要国へのサービス展開
- **多言語対応の強化**: 7 言語以上のサポート
- **プロダクト進化**: ユーザーフィードバックに基づく継続的な改善
- **IPO を視野にした成長**: 創業メンバーとしての参加機会

## ライセンス

このプロジェクトは[MIT ライセンス](LICENSE)の下で公開されています。

---

<div align="center">
  <p>Made with ❤️ by the Sppa Team</p>
  <p>
    <a href="https://github.com/TomohiroTani28/Sppa/issues">Issues</a> •
    <a href="https://github.com/TomohiroTani28/Sppa/discussions">Discussions</a> •
    <a href="https://sppaworld.slack.com">Slack</a>
  </p>
</div>
