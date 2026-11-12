/********************************
 * 共通設定
 ********************************/
/** 【引継ぎ時利用】スプレッドシートID・シート情報 */
const CONFIG = {
  SS_ID: "1GDYaKBEDl1-nil1FBtNd9B_ulXhaTxQ5f2ROXw2cplY",
  SHEET_NAME: "2026前半",

/** 行の設定値 */
  ROW: {
    EVENT: 1,
    PRICE: 9,
    START: 17,
    END: 300,
  },

/** 列の設定値 */
  COL: {
    NAME: 2,        // B
    MAIL: 3,        // C
    EVENT_START: 4, // D
    EVENT_END_TOURNAMENTS: 24, // X
    EVENT_END: 29,  // AC
    TOTAL: 30,      // AD
    PAID: 31,       // AE
    PAID_MAIL_SENT: 36, // AJ
    FLAG_START: 37   // AK列：参加フラグ開始
  },

/** セルの設定値 */
  TEMPLATE: {
    INVOICE_HEAD: "AI302",
    INVOICE_FOOT: "AI304",
    REMIND1: "AI306",
    REMIND2: "AI308",
    PAID: "AI310",
  },

  CHECKS: {
    INVOICE: ["AF15", "AF16"],
    REMIND1: ["AG15", "AG16"],
    REMIND2: ["AH15", "AH16"],
  },

/** 【引継ぎ時利用】フォームのID */
  FORM: {
  ID: "15XnUdfRrbqt_zO7WS5Km92Au7cg9aNGsb5X52VUlcGA"
},

  FROM: "utdskomaba@gmail.com",
};


/********************************
 * 共通ユーティリティ
 ********************************/
function getSheet() {
  return SpreadsheetApp.openById(CONFIG.SS_ID)
    .getSheetByName(CONFIG.SHEET_NAME);
}

function isDoubleChecked(sheet, cells) {
  return cells.every(c => sheet.getRange(c).getValue() === true);
}

function resetChecks(sheet, cells) {
  cells.forEach(c => sheet.getRange(c).setValue(false));
}


/********************************
 * 請求メール（動作確認）
 ********************************/
function sendInvoiceMail() {
  const sheet = getSheet();
  if (!isDoubleChecked(sheet, CONFIG.CHECKS.INVOICE)) return;

  const eventNames = sheet
    .getRange(
      CONFIG.ROW.EVENT,
      CONFIG.COL.EVENT_START,
      1,
      CONFIG.COL.EVENT_END - CONFIG.COL.EVENT_START + 1
    )
    .getValues()[0];

  const head = sheet.getRange(CONFIG.TEMPLATE.INVOICE_HEAD).getValue();
  const foot = sheet.getRange(CONFIG.TEMPLATE.INVOICE_FOOT).getValue();

  for (let r = CONFIG.ROW.START; r <= CONFIG.ROW.END; r++) {
    const name = sheet.getRange(r, CONFIG.COL.NAME).getValue();
    const mail = sheet.getRange(r, CONFIG.COL.MAIL).getValue();
    const total = sheet.getRange(r, CONFIG.COL.TOTAL).getValue();
    const paid = sheet.getRange(r, CONFIG.COL.PAID).getValue();

    if (!mail || total === 0 || paid === true) continue;

    const values = sheet
      .getRange(r, CONFIG.COL.EVENT_START, 1, eventNames.length)
      .getValues()[0];

    let detail = "";
    values.forEach((v, i) => {
      if (v && v !== 0) {
        detail += `${eventNames[i]}：${v}円\n`;
      }
    });

    const body =
      `${name}さん\n\n` +
      head + "\n\n" +
      detail +
      `\n合計金額：${total}円\n\n` +
      foot;

    GmailApp.sendEmail(mail, "【請求】大会参加費のご案内", body, {
      from: CONFIG.FROM,
    });
  }

  resetChecks(sheet, CONFIG.CHECKS.INVOICE);
}


/********************************
 * 催促メール（共通）（動作確認）
 ********************************/
function sendRemind(checks, templateCell, subject) {
  const sheet = getSheet();
  if (!isDoubleChecked(sheet, checks)) return;

  const template = sheet.getRange(templateCell).getValue();

  for (let r = CONFIG.ROW.START; r <= CONFIG.ROW.END; r++) {
    const name = sheet.getRange(r, CONFIG.COL.NAME).getValue();
    const mail = sheet.getRange(r, CONFIG.COL.MAIL).getValue();
    const total = sheet.getRange(r, CONFIG.COL.TOTAL).getValue();
    const paid = sheet.getRange(r, CONFIG.COL.PAID).getValue();

    if (!mail || total === 0 || paid === true) continue;

    const body =
      `${name}さん\n\n` +
      template + "\n\n" +
      `合計金額：${total}円`;

    GmailApp.sendEmail(mail, subject, body, { from: CONFIG.FROM });
  }

  resetChecks(sheet, checks);
}

function sendRemindMail1() {
  sendRemind(CONFIG.CHECKS.REMIND1, CONFIG.TEMPLATE.REMIND1, "【催促】参加費のお支払いについて");
}

function sendRemindMail2() {
  sendRemind(CONFIG.CHECKS.REMIND2, CONFIG.TEMPLATE.REMIND2, "【最終催促】参加費のお支払いについて");
}


/********************************
 * 入金確認メール（動作確認）
 ********************************/
function sendPaidMail() {
  const sheet = getSheet();
  const bodyTemplate = sheet.getRange(CONFIG.TEMPLATE.PAID).getValue();

  for (let r = CONFIG.ROW.START; r <= CONFIG.ROW.END; r++) {
    const name = sheet.getRange(r, CONFIG.COL.NAME).getValue();
    const mail = sheet.getRange(r, CONFIG.COL.MAIL).getValue();
    const paid = sheet.getRange(r, CONFIG.COL.PAID).getValue();
    const sent = sheet.getRange(r, CONFIG.COL.PAID_MAIL_SENT).getValue();

    if (!mail || paid !== true || sent === true) continue;

    const body = bodyTemplate.replace("{{name}}", name || "");
    GmailApp.sendEmail(mail, "【UTDS】入金確認のお知らせ", body);

    sheet.getRange(r, CONFIG.COL.PAID_MAIL_SENT).setValue(true);
  }
}


/********************************
 * フォーム送信時：参加費反映（動作確認）
 ********************************/
function onFormSubmit(e) {
  if (!e) {
    Logger.log("manual run");
    return;
  }

  Logger.log("trigger run");
  Logger.log(e.namedValues);

  const sheet = getSheet();
  const answers = e.namedValues;

  const eventName = answers["大会名"]?.[0];
  const members = [
    answers["参加者１"]?.[0],
    answers["参加者２"]?.[0],
    answers["参加者３"]?.[0],
  ].filter(Boolean);

  if (!eventName || members.length === 0) return;

  // 大会名一覧（D〜AC）
  const eventNames = sheet
    .getRange(
      CONFIG.ROW.EVENT,
      CONFIG.COL.EVENT_START,
      1,
      CONFIG.COL.EVENT_END - CONFIG.COL.EVENT_START + 1
    )
    .getValues()[0];

  const eventIdx = eventNames.indexOf(eventName);
  if (eventIdx === -1) return;

  // 金額列（D〜AC）
  const eventCol = CONFIG.COL.EVENT_START + eventIdx;

  // フラグ列（AK以降）
  const FLAG_OFFSET = CONFIG.COL.FLAG_START - CONFIG.COL.EVENT_START;
  const flagCol = eventCol + FLAG_OFFSET;

  // 部員名一覧（B列）
  const memberNames = sheet
    .getRange(
      CONFIG.ROW.START,
      CONFIG.COL.NAME,
      CONFIG.ROW.END - CONFIG.ROW.START + 1,
      1
    )
    .getValues()
    .flat()
    .map(v => v?.toString().trim());

  members.forEach(m => {
    const idx = memberNames.indexOf(m.trim());
    if (idx === -1) return;

    const row = CONFIG.ROW.START + idx;
    const flagCell = sheet.getRange(row, flagCol);

    // 二重提出防止（すでに参加済みなら何もしない）
    if (flagCell.getValue() === true) return;

    // 参加フラグを立てる
    flagCell.setValue(true);
  });
}

/********************************
 * フォーム選択肢更新（動作確認）
 ********************************/
function updateFormChoices() {
  const sheet = getSheet();
  const form = FormApp.openById(CONFIG.FORM.ID);

  // 大会名取得
  const eventNames = sheet
    .getRange(
      CONFIG.ROW.EVENT,
      CONFIG.COL.EVENT_START,
      1,
      CONFIG.COL.EVENT_END_TOURNAMENTS - CONFIG.COL.EVENT_START + 1
    )
    .getValues()[0]
    .filter(Boolean);

  // 部員名取得
  const memberNames = sheet
    .getRange(
      CONFIG.ROW.START,
      CONFIG.COL.NAME,
      CONFIG.ROW.END - CONFIG.ROW.START + 1,
      1
    )
    .getValues()
    .flat()
    .filter(Boolean);

  // フォームのプルダウン更新
  form.getItems(FormApp.ItemType.LIST).forEach(item => {
    const title = item.getTitle();

    if (title === "大会名") {
      item.asListItem().setChoiceValues(eventNames);
    }

    if (
      title === "参加者１" ||
      title === "参加者２" ||
      title === "参加者３"
    ) {
      item.asListItem().setChoiceValues(memberNames);
    }
  });
}
