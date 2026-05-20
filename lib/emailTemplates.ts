import path from 'path';

function escapeHtml(input: string) {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function textToHtmlParagraphs(text: string) {
  const safe = escapeHtml(text);
  // Preserve line breaks in a readable way for email clients.
  return safe.replace(/\r?\n/g, '<br/>');
}

export function buildBrandedEmail(opts: {
  title: string;
  messageText: string;
  toEmail?: string;
  footerText?: string;
}) {
  const primary = '#d4a373';
  const primaryHover = '#b88b5d';
  const bg = '#0a0a0a';
  const panel = '#111111';
  const border = 'rgba(255,255,255,0.10)';
  const muted = 'rgba(255,255,255,0.60)';
  const text = '#ffffff';

  const htmlMessage = textToHtmlParagraphs(opts.messageText);
  const footer = opts.footerText ?? 'Natta Cocinas · Respuesta automática desde el panel de administración';

  const logoPath = path.join(process.cwd(), 'public', 'assets', 'cocinasnattalogo.png');

  const replyMailto = opts.toEmail ? `mailto:${opts.toEmail}` : 'mailto:';

  const html = `<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <meta name="x-apple-disable-message-reformatting" />
    <title>${escapeHtml(opts.title)}</title>
  </head>
  <body style="margin:0;padding:0;background:${bg};color:${text};font-family:Montserrat,Segoe UI,Roboto,Arial,sans-serif;width:100%!important;height:100%!important;">
    <table role="presentation" width="100%" height="100%" cellpadding="0" cellspacing="0" style="background:${bg};padding:48px 16px;height:100%;">
      <tr>
        <td align="center" valign="middle">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:660px;border-radius:18px;overflow:hidden;border:1px solid ${border};background:${panel};">
            <tr>
              <td style="padding:22px 22px 14px 22px;border-bottom:1px solid ${border};">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td align="left" style="vertical-align:middle;">
                      <img src="cid:natta-logo" width="140" alt="Natta Cocinas" style="display:block;border:0;outline:none;text-decoration:none;max-width:140px;height:auto;" />
                    </td>
                    <td align="right" style="vertical-align:middle;">
                      <span style="display:inline-block;padding:8px 12px;border-radius:999px;background:rgba(212,163,115,0.12);border:1px solid rgba(212,163,115,0.25);color:${primary};font-size:12px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;">
                        NATTA
                      </span>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td style="padding:22px;">
                <div style="font-size:18px;font-weight:800;letter-spacing:0.01em;margin:0 0 10px 0;">
                  ${escapeHtml(opts.title)}
                </div>
                <div style="font-size:14px;line-height:1.65;color:rgba(255,255,255,0.78);">
                  ${htmlMessage}
                </div>

                <div style="margin-top:18px;padding:14px 14px;border-radius:14px;border:1px solid rgba(255,255,255,0.08);background:rgba(255,255,255,0.03);color:${muted};font-size:12px;line-height:1.6;">
                  Si tienes dudas, responde a este correo y te atenderemos lo antes posible.
                </div>

                <div style="margin-top:18px;">
                  <a href="${escapeHtml(replyMailto)}"
                     style="display:inline-block;background:${primary};color:#000000;text-decoration:none;font-weight:800;font-size:12px;letter-spacing:0.14em;text-transform:uppercase;padding:12px 16px;border-radius:12px;">
                    Responder
                  </a>
                  <span style="display:inline-block;margin-left:10px;color:${muted};font-size:12px;">
                    (Si el botón no funciona, responde desde tu cliente de correo)
                  </span>
                </div>
              </td>
            </tr>

            <tr>
              <td style="padding:16px 22px;border-top:1px solid ${border};color:rgba(255,255,255,0.35);font-size:11px;line-height:1.5;">
                ${escapeHtml(footer)}
                <div style="margin-top:8px;color:rgba(255,255,255,0.28);">
                  <span style="color:${primaryHover};font-weight:700;">${escapeHtml('Natta')}</span> · ${escapeHtml('Cocinas')}
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  return {
    html,
    attachments: [
      {
        filename: 'cocinasnattalogo.png',
        path: logoPath,
        cid: 'natta-logo',
      },
    ],
  };
}

