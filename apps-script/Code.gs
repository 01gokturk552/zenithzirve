/**
 * Zenith Zirve'26 — Backend (Google Apps Script Web App)
 * ============================================================
 * Konuşmacı + Program verisini bir Google Sheet'te saklar,
 * Google Form yanıtlarını (başvurular) IK paneline sunar.
 *
 * Kurulum adımları için: KURULUM.md
 *
 * Script Özellikleri (Project Settings → Script properties):
 *   ADMIN_PASSWORD   → panel giriş şifresi (zorunlu)
 *   RESPONSES_SHEET  → form yanıtlarının olduğu sayfanın adı (opsiyonel)
 * ============================================================
 */

var SPEAKER_COLS = ["name", "title", "photo", "bio"];
var PROGRAM_COLS = ["day", "time", "title", "desc", "speakerNames", "speakerTitle", "photos"];
var STATUS_HEADER = "Durum"; // başvuru yanıt sayfasına eklenen onay durumu sütunu

// ---------- HTTP giriş noktaları ----------

function doGet(e) {
  var action = (e && e.parameter && e.parameter.action) || "all";
  try {
    if (action === "speakers") return json({ ok: true, data: getSpeakers() });
    if (action === "program")  return json({ ok: true, data: getProgram() });
    if (action === "applications") {
      if (!roleOf(e.parameter.token)) return json({ ok: false, error: "Yetkisiz." });
      return json(getApplications());
    }
    // varsayılan: genel veri (token gerektirmez)
    return json({ ok: true, speakers: getSpeakers(), program: getProgram() });
  } catch (err) {
    return json({ ok: false, error: String(err) });
  }
}

function doPost(e) {
  var body;
  try { body = JSON.parse(e.postData.contents); }
  catch (err) { return json({ ok: false, error: "Geçersiz istek." }); }

  var action = body.action;
  try {
    if (action === "login") {
      var expected = passwordFor(body.role);
      if (expected && body.password === expected) {
        return json({ ok: true, token: body.password, role: body.role });
      }
      return json({ ok: false, error: "Hatalı şifre." });
    }

    var role = roleOf(body.token);
    if (!role) return json({ ok: false, error: "Oturum geçersiz. Yeniden giriş yapın." });

    if (action === "saveSpeakers") {
      if (role !== "admin") return json({ ok: false, error: "Bu işlem için admin yetkisi gerekir." });
      saveSpeakers(body.data || []); return json({ ok: true });
    }
    if (action === "saveProgram") {
      if (role !== "admin") return json({ ok: false, error: "Bu işlem için admin yetkisi gerekir." });
      saveProgram(body.data || []); return json({ ok: true });
    }
    if (action === "setStatus") {
      // admin veya ik onaylayabilir
      return json(setApplicationStatus(Number(body.row), String(body.status || "")));
    }

    return json({ ok: false, error: "Bilinmeyen işlem: " + action });
  } catch (err) {
    return json({ ok: false, error: String(err) });
  }
}

// ---------- Kimlik (rol bazlı: admin / ik) ----------

function prop(key) {
  return PropertiesService.getScriptProperties().getProperty(key) || "";
}
function passwordFor(role) {
  if (role === "admin") return prop("ADMIN_PASSWORD");
  if (role === "ik") return prop("IK_PASSWORD");
  return "";
}
// token = şifre (basit, durumsuz). Hangi role ait olduğunu döndürür.
function roleOf(token) {
  if (!token) return null;
  if (token === prop("ADMIN_PASSWORD")) return "admin";
  if (token === prop("IK_PASSWORD")) return "ik";
  return null;
}

// ---------- Konuşmacılar ----------

function getSpeakers() {
  var sheet = ensureSheet("Speakers", SPEAKER_COLS);
  return readObjects(sheet).map(function (o) {
    return { name: o.name || "", title: o.title || "", photo: o.photo || "", bio: o.bio || "" };
  });
}

function saveSpeakers(list) {
  var rows = list.map(function (s) {
    return [s.name || "", s.title || "", s.photo || "", s.bio || ""];
  });
  writeSheet("Speakers", SPEAKER_COLS, rows);
}

// ---------- Program ----------

function getProgram() {
  var sheet = ensureSheet("Program", PROGRAM_COLS);
  return readObjects(sheet).map(function (o) {
    return {
      day: Number(o.day) || 1,
      time: o.time || "",
      title: o.title || "",
      desc: o.desc || "",
      speakerNames: o.speakerNames || "",
      speakerTitle: o.speakerTitle || "",
      photos: String(o.photos || "").split(",").map(function (x) { return x.trim(); }).filter(String)
    };
  });
}

function saveProgram(list) {
  var rows = list.map(function (p) {
    return [
      Number(p.day) || 1, p.time || "", p.title || "", p.desc || "",
      p.speakerNames || "", p.speakerTitle || "",
      (p.photos || []).join(", ")
    ];
  });
  writeSheet("Program", PROGRAM_COLS, rows);
}

// ---------- Başvurular (Form yanıtları) ----------

function getApplications() {
  var sheet = findResponsesSheet();
  if (!sheet) return { ok: true, headers: [], rows: [], rowMeta: [], note: "Form yanıt sayfası bulunamadı." };

  var values = sheet.getDataRange().getValues();
  if (!values.length) return { ok: true, headers: [], rows: [], rowMeta: [] };

  var allHeaders = values[0].map(function (h) { return String(h); });
  var statusCol = allHeaders.indexOf(STATUS_HEADER); // -1 ise yok
  var tz = Session.getScriptTimeZone();

  // Durum sütununu tablodan gizle; durumu rowMeta'da ayrı döndür
  var headers = allHeaders.filter(function (_, i) { return i !== statusCol; });
  var rows = [], rowMeta = [];
  for (var r = 1; r < values.length; r++) {
    var rv = values[r];
    if (rv.join("").trim() === "") continue;
    var shown = [];
    for (var c = 0; c < rv.length; c++) {
      if (c === statusCol) continue;
      var cell = rv[c];
      shown.push(cell instanceof Date ? Utilities.formatDate(cell, tz, "yyyy-MM-dd HH:mm") : (cell == null ? "" : cell));
    }
    rows.push(shown);
    rowMeta.push({ row: r + 1, status: statusCol >= 0 ? String(rv[statusCol] || "") : "" });
  }
  return { ok: true, headers: headers, rows: rows, rowMeta: rowMeta };
}

// Bir başvurunun onay durumunu ayarlar; "Onaylandı" ise e-posta gönderir.
function setApplicationStatus(rowNum, status) {
  if (!rowNum || rowNum < 2) throw new Error("Geçersiz satır.");
  var sheet = findResponsesSheet();
  if (!sheet) throw new Error("Form yanıt sayfası bulunamadı.");

  var lastCol = sheet.getLastColumn();
  var headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0].map(function (h) { return String(h); });
  var statusCol = headers.indexOf(STATUS_HEADER);
  if (statusCol < 0) {
    statusCol = lastCol; // yeni sütun (0-bazlı index = mevcut sütun sayısı)
    sheet.getRange(1, statusCol + 1).setValue(STATUS_HEADER);
  }
  sheet.getRange(rowNum, statusCol + 1).setValue(status);

  var emailed = false, emailTo = "";
  if (status === "Onaylandı") {
    var rowVals = sheet.getRange(rowNum, 1, 1, sheet.getLastColumn()).getValues()[0];
    emailTo = findEmail(headers, rowVals);
    if (emailTo) {
      sendApprovalEmail(emailTo, findName(headers, rowVals));
      emailed = true;
    }
  }
  return { ok: true, status: status, emailed: emailed, emailTo: emailTo };
}

function findEmail(headers, rowVals) {
  var re = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
  for (var i = 0; i < headers.length; i++) {
    if (/mail|e-?posta/i.test(headers[i])) {
      var v = String(rowVals[i] || "").trim();
      if (re.test(v)) return v;
    }
  }
  for (var j = 0; j < rowVals.length; j++) {
    var s = String(rowVals[j] || "").trim();
    if (re.test(s)) return s;
  }
  return "";
}

function findName(headers, rowVals) {
  for (var i = 0; i < headers.length; i++) {
    if (/ad[ıi].{0,8}soyad|adınız|isim/i.test(headers[i])) {
      var v = String(rowVals[i] || "").trim();
      if (v) return v;
    }
  }
  return "";
}

function sendApprovalEmail(to, name) {
  var greeting = name ? ("Sayın " + name + ",") : "Merhaba,";
  var subject = "Zenith Zirve'26 — Başvurunuz Onaylandı";
  var body =
    greeting + "\n\n" +
    "Zenith Zirve'26 başvurunuz onaylanmıştır. Sizi aramızda görmekten mutluluk duyacağız!\n\n" +
    "Etkinlik Bilgileri:\n" +
    "• Tarih: 27-28 Haziran 2026\n" +
    "• Yer: Eyüpsultan Kültür ve Sanat Merkezi, İstanbul\n\n" +
    "Katılım ve ödeme detaylarıyla ilgili bilgilendirme en kısa sürede tarafınıza iletilecektir.\n\n" +
    "Sorularınız için bu e-postayı yanıtlayabilirsiniz.\n\n" +
    "Saygılarımızla,\n" +
    "Zenith Zirve'26 Organizasyon Ekibi";
  MailApp.sendEmail(to, subject, body);
}

function findResponsesSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var named = PropertiesService.getScriptProperties().getProperty("RESPONSES_SHEET");
  if (named) {
    var s = ss.getSheetByName(named);
    if (s) return s;
  }
  // Speakers/Program dışında, form bağlantılı ilk sayfayı bul
  var sheets = ss.getSheets();
  for (var i = 0; i < sheets.length; i++) {
    var name = sheets[i].getName();
    if (name === "Speakers" || name === "Program") continue;
    if (sheets[i].getFormUrl && sheets[i].getFormUrl()) return sheets[i];
  }
  // bulunamazsa: Speakers/Program olmayan ilk sayfa
  for (var j = 0; j < sheets.length; j++) {
    var n = sheets[j].getName();
    if (n !== "Speakers" && n !== "Program") return sheets[j];
  }
  return null;
}

// ---------- Sayfa yardımcıları ----------

function ensureSheet(name, columns) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    sheet.getRange(1, 1, 1, columns.length).setValues([columns]);
  }
  return sheet;
}

function readObjects(sheet) {
  var values = sheet.getDataRange().getValues();
  if (values.length < 2) return [];
  var headers = values[0].map(function (h) { return String(h).trim(); });
  return values.slice(1)
    .filter(function (r) { return r.join("").trim() !== ""; })
    .map(function (r) {
      var o = {};
      headers.forEach(function (h, i) { o[h] = r[i]; });
      return o;
    });
}

function writeSheet(name, columns, rows) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(name) || ss.insertSheet(name);
  sheet.clearContents();
  sheet.getRange(1, 1, 1, columns.length).setValues([columns]);
  if (rows.length) {
    sheet.getRange(2, 1, rows.length, columns.length).setValues(rows);
  }
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

// ---------- Kurulum yardımcıları (editörden bir kez çalıştırın) ----------

/** Speakers ve Program sayfalarını oluşturur, şifreler yoksa varsayılan atar. */
function setup() {
  ensureSheet("Speakers", SPEAKER_COLS);
  ensureSheet("Program", PROGRAM_COLS);
  var props = PropertiesService.getScriptProperties();
  if (!props.getProperty("ADMIN_PASSWORD")) props.setProperty("ADMIN_PASSWORD", "Vdmin_Z3nith2728");
  if (!props.getProperty("IK_PASSWORD")) props.setProperty("IK_PASSWORD", "IK_Z3nith2728");
  Logger.log("Kurulum tamam. Şifreler: ADMIN_PASSWORD ve IK_PASSWORD ayarlandı (lütfen güçlü değerlerle değiştirin).");
}

/** Şifreleri koddan ayarlamak için: setPasswords('adminSifre','ikSifre') çalıştırın. */
function setPasswords(adminPw, ikPw) {
  var p = PropertiesService.getScriptProperties();
  if (adminPw) p.setProperty("ADMIN_PASSWORD", adminPw);
  if (ikPw) p.setProperty("IK_PASSWORD", ikPw);
  Logger.log("Şifreler güncellendi.");
}
