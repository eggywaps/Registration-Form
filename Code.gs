// Google Apps Script backend for Christmas Party Registration.
// Create a Google Sheet, open Extensions > Apps Script, paste this code, and deploy as a Web App.
// Execute as: Me | Who has access: Anyone
const SHEET_NAME = "Attendees";

function sheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) {
    sh = ss.insertSheet(SHEET_NAME);
    sh.appendRow(["ID", "Full Name", "Created At", "Device ID"]);
  }
  return sh;
}

function output_(e, data) {
  const callback = (e && e.parameter && e.parameter.callback) || "";
  const json = JSON.stringify(data);
  if (callback && /^[A-Za-z_$][0-9A-Za-z_$]*$/.test(callback)) {
    return ContentService.createTextOutput(callback + "(" + json + ");")
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  return ContentService.createTextOutput(json).setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  const p = (e && e.parameter) || {};
  const action = p.action || "list";
  const sh = sheet_();
  const rows = sh.getDataRange().getValues();

  if (action === "register") {
    const name = String(p.name || "").trim().replace(/\s+/g, " ");
    if (!name) return output_(e, {ok:false, message:"Name is required."});
    const duplicate = rows.slice(1).some(r => String(r[1]).trim().toLowerCase() === name.toLowerCase());
    if (duplicate) return output_(e, {ok:true, duplicate:true, message:"Name already exists."});
    const id = Utilities.getUuid();
    const createdAt = new Date().toISOString();
    sh.appendRow([id, name, createdAt, String(p.deviceId || "")]);
    return output_(e, {ok:true, id:id, name:name, createdAt:createdAt});
  }

  if (action === "list") {
    const attendees = rows.slice(1).filter(r => r[1]).map(r => ({
      id:String(r[0]), name:String(r[1]), createdAt:String(r[2])
    }));
    return output_(e, {ok:true, attendees:attendees});
  }

  return output_(e, {ok:false, message:"Unknown action."});
}