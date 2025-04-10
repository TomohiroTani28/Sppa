# Sppa - バリ島のセラピストと観光客をつなぐ次世代 SNS プラットフォーム

<div align="center">
  <img src="public/images/sppa.png" alt="Sppa Logo" width="200"/>
  <br/>
  <p>

<div align="center">
  <img src="public/images/sppa.png" alt="Sppa Logo" width="160" height="160" style="object-fit: contain; margin-bottom: 1rem"/>
  <br/>
  <strong>言葉が違っても、癒しは分かち合える。</strong>
  <p>
    <a href="#ビジョン">ビジョン</a> ·
    <a href="#機能">機能</a> ·
    <a href="#テクノロジー">テクノロジー</a> ·
    <a href="#始め方">始め方</a> ·
    <a href="#コミュニティ">コミュニティ</a> ·
    <a href="#ロードマップ">ロードマップ</a>
  </p>
</div>

---

## ビジョン

**Sppa（スッパ）** は、バリ島の伝統セラピーを旅先で気軽に楽しめるようにするマッチングサービスです。

名前はインドネシア語の “Santai” (リラックス) と “Pijat” (マッサージ) から取りました。旅人とセラピストのあいだにある言語や文化の壁をできるだけ低くし、安心して予約できる仕組みをつくっています。

なぜバリ島なのか。年間 600 万人以上が訪れるウェルネスの聖地なのに、口コミ頼みで本当に自分に合うセラピストを探すのは意外と大変だからです。Sppa はその “探すストレス” を取り除き、現地セラピストの収入機会も広げます。

---

## 機能

### ホームフィード

- 写真と短いストーリーで施術の雰囲気がひと目で分かります。
- “今すぐ予約” ボタンで気になったらすぐリクエスト。
- 無限スクロールで新しい出会いを次々に表示。

### 探す

- 「今日空きあり」「ホテルから 5 km 以内」など旅行者向けの絞り込み。
- 地図表示で場所を直感的に確認。

### チャット

- メッセージはリアルタイムで自動翻訳。原文も見えるので安心です。
- 写真やスタンプで細かい希望も伝えやすくしています。

### 予約管理

- セラピスト用カレンダーとプッシュ通知でダブルブッキングを防止。
- 旅行者には現地時間に合わせたリマインダーを送ります。

---

## テクノロジー

| レイヤー | スタック |
| --- | --- |
| フロントエンド | Next.js 14 / React / Tailwind CSS |
| バックエンド | Hasura / Supabase / PostgreSQL / Redis |
| インテグレーション | LibreTranslate / Mapbox / Stripe / Twilio |
| インフラ | Vercel / Docker / GitHub Actions |

---

## 始め方

```bash
# クローン
$ git clone https://github.com/TomohiroTani28/Sppa.git && cd Sppa

# 依存をインストール
$ pnpm install

# 環境変数を設定
$ cp .env.example .env.local && pnpm setup

# 開発サーバーを起動
$ pnpm dev
```

詳しいガイドラインは [STYLE_GUIDE.md](STYLE_GUIDE.md) と [CONTRIBUTING.md](CONTRIBUTING.md) をご覧ください。

---

## コミュニティ

- バグ報告や機能提案は [Issues](https://github.com/TomohiroTani28/Sppa/issues) へ。
- コードやドキュメントの改善は [Pull Requests](https://github.com/TomohiroTani28/Sppa/pulls) で歓迎します。
- 気軽な相談は Discord にもどうぞ → <https://discord.gg/sppa>

誰でも参加できるオープンな場にしたいので、行動規範 [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) をお読みいただけると助かります。

---

## ロードマップ

| 期 | やること |
| --- | --- |
| 2024 Q4 | バリ島版正式リリース（3 言語対応） |
| 2025 上半期 | AI レコメンドと AR プレビュー |
| 2025 下半期 | ブロックチェーンでレビュー透明化 |
| その後 | 東南アジア・中南米の観光地へ展開 |

---

## ライセンス

MIT License です。詳しくは [LICENSE](LICENSE) をご覧ください。

---

<div align="center">
  <p>Made with ❤️ by the Sppa Team</p>
  <p>
    <a href="https://github.com/TomohiroTani28/Sppa/issues">Issues</a> •
    <a href="https://github.com/TomohiroTani28/Sppa/discussions">Discussions</a> •
    <a href="https://sppaworld.slack.com">Slack</a>
  </p>
</div>
