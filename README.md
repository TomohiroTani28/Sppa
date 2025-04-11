# Sppa – ✈️🌴 *Healing Without Borders*

<div align="center">
<<<<<<< HEAD
  <img src="public/images/sppa2.png" alt="Sppa Logo" style="max-width:100%;height:auto;"/>
=======
  <img src="public/images/sppa-logo-bali-sunset.svg" alt="Sppa Logo" width="200"/>
>>>>>>> fbaddbcc94cb946a9c22871f6bdc37a74e52d338
  <p><strong>言葉が違っても、癒しは分かち合える。</strong></p>

  <!-- Badges -->
  <p>
    <img src="https://img.shields.io/github/stars/TomohiroTani28/Sppa?style=social" alt="GitHub stars"/>
    <img src="https://img.shields.io/github/actions/workflow/status/TomohiroTani28/Sppa/ci.yml?label=CI&logo=github" alt="build status"/>
    <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" alt="PRs welcome"/>
    <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="MIT License"/>
  </p>

  <p>
    <a href="#ストーリー">ストーリー</a> ·
    <a href="#市場機会">市場機会</a> ·
    <a href="#プロダクトの特徴">プロダクトの特徴</a> ·
    <a href="#アーキテクチャ">アーキテクチャ</a> ·
    <a href="#クイックスタート">クイックスタート</a> ·
    <a href="#コントリビューションガイド">コントリビューションガイド</a> ·
    <a href="#ロードマップ">ロードマップ</a>
  </p>
</div>

---

## 🌅 ストーリー

> **Sunset to Startup – バリ島の夕陽がインスピレーションを灯した夜**
>
> ある日、チャングーのビーチバーでサンセットを眺めながらマッサージを予約しようとしたら――“言語の壁” と “口コミの迷路” に迷い込みました。そこでふと思ったのです。「**ウェルネスの楽園バリで、癒しを探すこと自体がストレスになるなんて矛盾している！**」
>
> こうして生まれたのが **Sppa**。バリ語で “Santai Pijat = リラックスマッサージ”。旅人とセラピストをリアルタイム翻訳と安全な決済で結び、**探すストレスをゼロ** にする次世代SNSです。

<div align="center">
  <img src="public/images/story-sunset.gif" alt="Sunset inspiration" width="600"/>
</div>

---

## 📈 市場機会

| 指標 | 数値 | インサイト |
| --- | --- | --- |
| 年間観光客数 | **530万 → 633万 (+20.1%)** | 2025年には1,700万を目標に急拡大 |
| スパ施設数 | **1,000+** | 若いセラピスト人口が豊富で供給力◎ |
| 旅行者ニーズ | リラックス65% / ビーチ58% | ウェルネス × ビーチカルチャーが核心 |
| 課題 | 言語・決済・信頼性 | Sppaが一気通貫で解決！ |

> **バリ島好き・在住エンジニアへ**: この波に乗り、ローカルコミュニティと世界を繋ぐブリッジを一緒に作りませんか？ 🌊

---

## ✨ プロダクトの特徴

| カテゴリ | 旅行者 (Tourist) | セラピスト (Therapist) |
| :-- | :-- | :-- |
| **ホームフィード** | 写真 & 30秒動画で雰囲気を直感把握 | ポートフォリオ投稿でファン獲得 |
| **検索 / 絞り込み** | 「今すぐ予約」「ホテル5km」など旅人視点フィルタ | 稼働エリア・施術タグ登録 |
| **チャット** | 自動翻訳 + 原文表示・画像/音声対応 | クイック返信テンプレ & 既読管理 |
| **予約 / 決済** | Stripe / 現地キャッシュレス統合 | Googleカレンダー同期 & ダブルブッキング防止 |
| **レビュー & AIレコメンド** | GPS & 決済連携で不正防止 | 実績×評価でスコアリング |

<div align="center">
  <img src="public/images/sppa-demo.gif" alt="Sppa demo" width="700"/>
</div>

---

## 🏗️ アーキテクチャ

```mermaid
flowchart TD
  subgraph Frontend
    A[Next.js 15 (App Router)] -->|Apollo / WS| B(Hasura GraphQL)
  end
  subgraph Backend
    B --> C[(PostgreSQL)]
    B --> D[(Supabase Auth)]
    B --> E[Edge Functions]
  end
  E -->|Webhooks| F[Stripe & Twilio]
  A -->|i18next / LibreTranslate| G[Real‑time Translation]
```

- **モノレポ**: フロント & インフラを単一Repoで管理。
- **リアルタイム**: GraphQL Subscriptionsでチャット即時反映。
- **CI/CD**: GitHub Actions + Dockerでステージング自動デプロイ。

---

## ⚙️ テクノロジースタック
<<<<<<< HEAD

<div align="center">
  <img src="public/images/technology_stack.png" alt="Technology Stack" style="max-width:100%;height:auto;"/>
</div>
=======
>>>>>>> fbaddbcc94cb946a9c22871f6bdc37a74e52d338

| レイヤー | スタック |
| --- | --- |
| フロントエンド | Next.js / React / TypeScript / Tailwind CSS |
| バックエンド | Hasura / Supabase / PostgreSQL / Redis |
| インテグレーション | Stripe · Twilio · Mapbox · LibreTranslate |
| インフラ | Vercel / Docker / GitHub Actions / Cloudflare Pages |

---

## 🚀 クイックスタート

```bash
# 1. クローン
$ git clone https://github.com/TomohiroTani28/Sppa.git && cd Sppa

# 2. 依存をインストール
$ pnpm install

# 3. 環境変数を設定
$ cp .env.example .env.local
$ pnpm db:setup   # DBスキーマ & サンプルデータ
$ pnpm supabase   # Supabaseローカル起動

# 4. 開発サーバーを起動
$ pnpm dev -p 3000
```

> **5分でローカル環境が立ち上がります。** コードを書きながら波チェックも忘れずに！🏄‍♂️

---

## 🤝 コントリビューションガイド

1. **Issue を探す**: `good first issue` / `help wanted` ラベルが入口です。
2. **フォーク & ブランチ**: `feat/your-feature` で作業しましょう。
3. **コミットメッセージ**: Conventional Commits (`feat:`, `fix:` …)。
4. **テスト**: `pnpm test` でユニットテストを追加・実行。
5. **PR**: テンプレートに沿って背景・変更点・スクリーンショットを添付。
6. **レビュー**: 24h 以内にフィードバックします。

> 初PRがマージされた方には **Sppa Contributor NFT** をプレゼント 🎁

### コミュニティ

- 💬 **Slack**: <https://sppaworld.slack.com>
- 🐛 **Issues**: <https://github.com/TomohiroTani28/Sppa/issues>
- 💡 **Discussions**: <https://github.com/TomohiroTani28/Sppa/discussions>

> 小さな typo 修正から大歓迎。**あなたの一歩が、誰かの癒し体験を変えます。**

---

## 🗺️ ロードマップ

| タイムライン | マイルストーン |
| --- | --- |
| 2025 Q2 | β版公開（チャット / 予約 / 決済）|
| 2025 Q3 | AI レコメンド・10言語対応 |
| 2025 Q4 | iOS / Android PWA・オフラインキャッシュ |
| 2026 H1 | 東南アジア主要リゾートへ横展開 |
| 2026 H2 | DAO型運営・スマートコントラクト報酬 |

---

## 📝 ライセンス

Sppa は **MIT License** のもとで公開されています。詳細は [LICENSE](LICENSE) をご覧ください。

---

<div align="center">
  <sub>Made with ❤️ & Kopi Bali by the Sppa Community</sub>
<<<<<<< HEAD
=======
</div>
    <a href="https://github.com/TomohiroTani28/Sppa/issues">Issues</a> •
    <a href="https://github.com/TomohiroTani28/Sppa/discussions">Discussions</a> •
    <a href="https://sppaworld.slack.com">Slack</a>
  </p>
>>>>>>> fbaddbcc94cb946a9c22871f6bdc37a74e52d338
</div>

