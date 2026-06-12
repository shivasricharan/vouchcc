function doPost(e) {
  try {
    const SHEET_NAME = 'Vouch Pilot Requests';
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(SHEET_NAME);

    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      sheet.appendRow([
        'Timestamp',
        'Name',
        'Business Name',
        'Phone / WhatsApp',
        'Email',
        'Business Type',
        'City',
        'Current Lead Source',
        'Biggest Lead Problem',
        'Interested in Pilot',
        'Source Page',
        'Status'
      ]);
    }

    const data = JSON.parse(e.postData.contents || '{}');

    sheet.appendRow([
      new Date(),
      data.name || '',
      data.businessName || '',
      data.phone || '',
      data.email || '',
      data.businessType || '',
      data.city || '',
      data.currentLeadSource || '',
      data.biggestLeadProblem || '',
      data.interestedInPilot || '',
      data.sourcePage || 'VouchCC Website',
      'New'
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        message: 'Saved successfully'
      }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        message: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({
      success: true,
      message: 'Vouch Google Sheets backend is running'
    }))
    .setMimeType(ContentService.MimeType.JSON);
}
