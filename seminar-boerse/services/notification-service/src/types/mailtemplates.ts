export function enrollmentConfirmedMail(
  userName: string,
  seminarName: string,
  seminarId: Number
) {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <style>
      body { font-family: Arial, sans-serif; background:#f7f9fc; margin:0; padding:0; }
      .container { max-width:600px; margin:40px auto; background:#fff; border-radius:12px;
                   box-shadow:0 4px 12px rgba(0,0,0,0.1); overflow:hidden; }
      .header { background:#28a745; color:#fff; padding:20px; text-align:center; }
      .header h1 { margin:0; font-size:22px; }
      .content { padding:30px; color:#333; line-height:1.6; }
      .button { display:inline-block; margin-top:20px; padding:12px 24px;
                background:#28a745; color:#fff; text-decoration:none; font-weight:bold; border-radius:8px; }
      .footer { background:#f0f0f0; text-align:center; padding:15px; font-size:12px; color:#777; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header"><h1>Anmeldung bestätigt 🎓</h1></div>
      <div class="content">
        <p>Hallo ${userName},</p>
        <p>deine Anmeldung zum Seminar <strong>${seminarName}</strong> wurde erfolgreich bestätigt.</p>
        <p>Wir freuen uns auf deine Teilnahme!</p>
        <a class="button" href="https://seminar.nak.de/seminars/${seminarId}">Seminar ansehen</a>
      </div>
      <div class="footer">
        <p>Dies ist eine automatische Nachricht der Seminarbörse. Bitte nicht direkt antworten.</p>
      </div>
    </div>
  </body>
  </html>
  `;
}
export function enrollmentCancelledMail(
  userName: string,
  seminarName: string,
  seminarId: Number
) {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <style>
      body { font-family: Arial, sans-serif; background:#f7f9fc; margin:0; padding:0; }
      .container { max-width:600px; margin:40px auto; background:#fff; border-radius:12px;
                   box-shadow:0 4px 12px rgba(0,0,0,0.1); overflow:hidden; }
      .header { background:#dc3545; color:#fff; padding:20px; text-align:center; }
      .header h1 { margin:0; font-size:22px; }
      .content { padding:30px; color:#333; line-height:1.6; }
      .button { display:inline-block; margin-top:20px; padding:12px 24px;
                background:#dc3545; color:#fff; text-decoration:none; font-weight:bold; border-radius:8px; }
      .footer { background:#f0f0f0; text-align:center; padding:15px; font-size:12px; color:#777; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header"><h1>Abmeldung bestätigt ❌</h1></div>
      <div class="content">
        <p>Hallo ${userName},</p>
        <p>du hast dich erfolgreich vom Seminar <strong>${seminarName}</strong> abgemeldet.</p>
        <p>Falls dies ein Irrtum war, kannst du dich jederzeit erneut anmelden, solange Plätze verfügbar sind.</p>
        <a class="button" href="https://seminar.nak.de/seminars/${seminarId}">Zur Seminarübersicht</a>
      </div>
      <div class="footer">
        <p>Dies ist eine automatische Nachricht der Seminarbörse. Bitte nicht direkt antworten.</p>
      </div>
    </div>
  </body>
  </html>
  `;
}
