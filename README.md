# Personal-Project-A-Automation-of-Accounting-System-in-Debate-Club
An accounting automation system for a club, built with Google Sheets, Forms, Apps Script, and Gmail. Automates participant registration, fee calculation, billing, and payment reminders, streamlining routine work while improving accuracy and maintainability. 大学サークルの会計業務を自動化するシステム。Google Sheets、Forms、Apps Script、Gmailを連携し、参加登録・参加費計算・請求・入金催促を効率化。

## 【English Version】

### 1. Overview

This project is an accounting workflow automation system developed for a university student organization.

It integrates Google Sheets, Google Forms, Google Apps Script, and Gmail to streamline tournament registration, participation fee calculation, individual billing, payment tracking, and reminder emails.

The main objective was not only to reduce repetitive manual work, but also to create a system that could be maintained and operated by future accounting officers with limited programming experience.

### 2. Technical Stack

- **Google Sheets:** Centralized data management, fee calculation, and payment tracking
- **Google Forms:** Tournament participation registration
- **Google Apps Script:** Workflow automation and integration between Google services
- **Gmail:** Automated individual billing and payment reminder emails
- **JavaScript:** Implementation of automation logic

### 3. System Architecture

The system consists of three main workflows.

**1. Google Sheets → Google Forms**

A script retrieves tournament names and member names from Google Sheets and updates the corresponding form choices.

This allows the form to reflect changes in the accounting spreadsheet without manually editing every choice.

**2. Google Forms → Google Sheets**

When a form is submitted, an installable trigger executes the corresponding Apps Script function.

The submitted tournament and participant information is processed and reflected in the accounting spreadsheet as participation records.

A duplicate-submission prevention mechanism is also incorporated to reduce unintended repeated registrations.

**3. Google Sheets → Gmail**

Apps Script retrieves individual billing information and generates personalized emails.

Payment reminder emails are sent based on payment confirmation status, allowing the system to target members whose payments have not yet been confirmed.

Additional confirmation steps are used before sending emails to reduce the risk of accidental mass mailing.

### 4. Design and Implementation Considerations

#### Separation of Participation Records and Fee Data

Participation status and participation fees are managed separately.

Instead of directly storing calculated fees for each member, the system records participation information using flags and references the corresponding tournament fee.

This design allows fee changes to be reflected in individual billing calculations without manually updating every member's record.

#### Maintaining Compatibility with Existing Workflows

Rather than introducing an entirely new accounting platform, the system was designed around Google Sheets, which was already familiar to the organization.

This minimizes the learning curve while preserving the ability to make manual adjustments when exceptional situations arise.

#### Automated but Controlled Email Operations

Personalized billing and reminder emails are generated using spreadsheet data and predefined templates.

Payment confirmation status is used to determine reminder recipients.

Confirmation steps are incorporated into the sending process to help prevent unintended email delivery.

#### Maintainability and Knowledge Transfer

The system was designed with future accounting officers in mind.

Configuration values, such as spreadsheet and form identifiers and sheet names, are managed separately from the main processing logic.

In addition to the source code, illustrated documentation covering system structure, operation, and basic troubleshooting was prepared.

The documentation is intended to help successors understand and maintain the system even without prior experience with Google Apps Script. It also provides a reference for consulting AI tools when troubleshooting or modifying the code.

### 5. Results

Based on the annual workload during the development and operation period:

| Metric | Result |
|---|---:|
| Tournaments managed annually | Approximately 25 |
| Annual participation entries | Approximately 200 |
| Members subject to fee collection | Approximately 60 |
| Fee collection cycles | 2 per year |
| Estimated routine work automated | Approximately 485 minutes/year |

The estimated 485 minutes consist of:

- Tournament fee calculation: 25 tournaments × 1 minute = 25 minutes
- Manual participant data entry: 200 entries × 30 seconds = 100 minutes
- Individual billing: 120 billing instances × 3 minutes = 360 minutes

The system also eliminated several annual data-entry errors that had occurred under the previous manual workflow.

Most routine accounting operations were automated, while tasks requiring human involvement, such as bank transfers and external communications, remained manual.

*Note: The time savings are estimates based on average task durations, rather than measurements from a controlled experiment.*

### 6. Future Improvements

Potential areas for further improvement include:

- More comprehensive error logging and monitoring
- Automated testing of major workflows
- Further simplification of semester and academic-year transitions
- Continuous improvement of operational documentation

---

## 【日本語版】

### 1. 概要

本プロジェクトは、大学サークルの会計業務を効率化するために開発した業務自動化システムです。

Google Sheets、Google Forms、Google Apps Script、Gmailを連携させ、大会参加登録、参加費計算、個人別請求、入金確認、未入金者への催促メール送信などを自動化しています。

単純な作業時間の削減だけでなく、プログラミングの専門知識がない後任者でも継続的に運用・管理できるシステムを構築することを目指しました。

### 2. 使用技術

- **Google Sheets：** データ管理、参加費計算、入金状況管理
- **Google Forms：** 大会参加情報の登録
- **Google Apps Script：** 業務処理の自動化およびGoogleサービス間の連携
- **Gmail：** 個別請求メール・催促メールの送信
- **JavaScript：** 自動化処理の実装

### 3. システム構成

システムは主に3つの処理で構成されています。

**① Google Sheets → Google Forms**

Google Sheetsに登録されている大会名・部員名を取得し、Google Formsの選択肢を更新します。

これにより、会計シートの情報が変更された場合も、フォームの選択肢を手作業で一つずつ編集する必要がありません。

**② Google Forms → Google Sheets**

フォーム送信時にインストール型トリガーによってApps Scriptを実行します。

送信された大会情報・参加者情報を処理し、会計シートの該当する参加記録に反映します。

また、意図しない二重登録を防ぐ仕組みも導入しています。

**③ Google Sheets → Gmail**

Apps Scriptが会計シートから個人別の請求情報を取得し、メールテンプレートに反映します。

入金確認状況に応じて催促対象者を抽出し、個別の催促メールを作成・送信します。

誤送信を防ぐため、メール送信前には追加の確認手順を設けています。

### 4. 技術的・設計上の工夫

#### 参加情報と参加費データの分離

大会への参加状況と参加費を別々に管理する設計を採用しました。

各部員の請求金額を直接固定値として記録するのではなく、参加フラグを管理し、大会ごとの参加費を参照して請求額を計算します。

これにより、大会参加費が変更された場合も、各部員の請求金額に変更を反映できます。

#### 既存の業務フローとの互換性

新しい会計管理システムへの全面移行ではなく、従来から使用していたGoogle Sheetsを中心に設計しました。

担当者の学習コストを抑えながら、例外的なケースには手動で入力・修正できる柔軟性も維持しています。

#### 自動化と誤操作防止の両立

個別請求メール・催促メールは、スプレッドシートのデータとメールテンプレートを組み合わせて生成します。

入金確認状況に基づいて催促対象者を決定し、送信前の確認手順を設けることで、誤送信のリスクを抑えています。

#### 保守性と引き継ぎやすさ

後任者による継続的な運用を考慮し、スプレッドシートID、フォームID、シート名などの設定値を、主要な処理ロジックから分離して管理しています。

また、ソースコードだけでなく、システム構成、操作方法、基本的なトラブルシューティングをまとめた画像付きの説明資料を作成しました。

Apps Scriptの使用経験が少ない後任者でもシステムを理解・管理できることを目指しています。さらに、コードの修正やトラブル対応時にAIへ質問するための参考資料としても活用できるようにしています。

### 5. 導入成果

自身が会計を担当した年度の業務実績に基づく数値です。

| 指標 | 実績 |
|---|---:|
| 年間大会数 | 約25大会 |
| 年間参加回数 | 約200回 |
| 請求対象者 | 約60人 |
| 年間徴収回数 | 2回 |
| 自動化した定型作業時間 | 年間約485分 |

年間約485分の内訳：

- 大会ごとの参加費計算：25大会 × 1分 = 25分
- 参加情報の手入力：200回 × 30秒 = 100分
- 個人別請求作業：120人分 × 3分 = 360分

また、従来の手作業で年間数件発生していた入力ミスを解消しました。

振込や外部との連絡など、人の判断・対応が必要な業務を除き、日常的な会計業務の大部分を自動化しました。

※作業時間は各作業の平均所要時間に基づく推計値であり、実験的に計測した削減時間ではありません。

### 6. 今後の改善案

- エラーログ・処理状況の可視化
- 主要な処理に対するテストの体系化
- 半年・年度切り替え作業のさらなる簡略化
- 運用マニュアル・引き継ぎ資料の継続的な改善
