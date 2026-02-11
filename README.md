# Antigravity Dashboard

Notion風のシンプルで洗練されたマーケティングオートメーションダッシュボード

## 特徴

- 🎨 Notion風のシンプルで洗練されたUI/UX
- 📊 統計情報を一目で把握できるダッシュボード
- 🎯 直感的なナビゲーション
- ⚡ スケルトンローディングで快適なUX
- 📱 レスポンシブデザイン

## 技術スタック

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Lucide React** (アイコン)
- **Inter Font** (Google Fonts)

## セットアップ

### 前提条件

- Node.js 18以上
- npm または yarn

### インストール

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev
```

ブラウザで `http://localhost:3000` を開いてください。

## プロジェクト構造

```
antigravity-dashboard/
├── app/
│   ├── dashboard/          # ダッシュボードページ
│   ├── funnels/            # LP一覧ページ
│   ├── contents/           # 動画管理ページ
│   ├── sequences/          # LINE配信ページ
│   ├── analytics/          # ユーザー分析ページ
│   ├── layout.tsx          # グローバルレイアウト
│   ├── page.tsx            # ルートページ
│   └── globals.css         # グローバルスタイル
├── components/
│   ├── layout/
│   │   └── AppSidebar.tsx  # サイドバーナビゲーション
│   └── dashboard/
│       ├── StatCard.tsx    # 統計カードコンポーネント
│       └── StatCardSkeleton.tsx  # スケルトンローディング
├── lib/
│   └── utils.ts            # ユーティリティ関数
└── tailwind.config.ts      # Tailwind設定
```

## 主要機能

### ダッシュボード

- 本日の登録者数
- 総ユーザー数
- 動画完了率
- アクティブシーケンス数
- 最近のアクティビティ
- クイックアクション

### ナビゲーション

- ダッシュボード
- LP一覧
- 動画管理
- LINE配信
- ユーザー分析

## デザインシステム

### カラーパレット

```css
--background: #FFFFFF;        /* 純白背景 */
--background-alt: #F9FAFB;    /* 極薄グレー */
--border: #E5E7EB;            /* 細い境界線 */
--text-primary: #111827;      /* 濃いグレー（黒に近い） */
--text-secondary: #6B7280;    /* ミディアムグレー */
--accent: #3B82F6;            /* アクセントカラー（青） */
```

### タイポグラフィ

- **フォント**: Inter (Google Fonts)
- **見出し**: 大きく、セミボールド
- **本文**: 読みやすいサイズと行間

### コンポーネント

- **notion-card**: 枠線のないシンプルなカード
- ホバー時に背景が薄いグレーに変化
- 広めのパディングで圧迫感を排除

## 次のステップ

- [ ] Supabaseとの連携
- [ ] 実際のデータ取得
- [ ] LP一覧ページの実装
- [ ] 動画管理ページの実装
- [ ] LINE配信設定ページの実装
- [ ] ユーザー分析ページの実装（グラフ・チャート）

## ライセンス

© 2026 Antigravity
