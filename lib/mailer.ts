import nodemailer from 'nodemailer';

function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing env var: ${name}`);
  return value;
}

export function getTransporter() {
  const user = requiredEnv('GMAIL_USER');
  const passRaw = requiredEnv('GMAIL_PASS');
  // Gmail App Passwords sometimes are stored with spaces for readability.
  const pass = passRaw.replace(/\s+/g, '');

  return nodemailer.createTransport({
    service: 'gmail',
    auth: { user, pass },
  });
}

export async function sendEmail(opts: {
  to: string;
  subject: string;
  text?: string;
  html?: string;
  replyTo?: string;
  attachments?: Array<{
    filename?: string;
    path?: string;
    cid?: string;
    content?: any;
    contentType?: string;
  }>;
}) {
  const user = requiredEnv('GMAIL_USER');
  const transporter = getTransporter();

  return transporter.sendMail({
    from: `"Natta Admin" <${user}>`,
    to: opts.to,
    subject: opts.subject,
    text: opts.text,
    html: opts.html,
    replyTo: opts.replyTo,
    attachments: opts.attachments,
  });
}

