import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/mailer';
import { buildBrandedEmail } from '@/lib/emailTemplates';

export const runtime = 'nodejs';

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const to = String(body?.to ?? '').trim();
    const subject = String(body?.subject ?? '').trim();
    const text = body?.text != null ? String(body.text) : undefined;
    const htmlRaw = body?.html != null ? String(body.html) : undefined;
    const replyTo = body?.replyTo != null ? String(body.replyTo).trim() : undefined;

    if (!to || !isValidEmail(to)) {
      return NextResponse.json({ ok: false, error: 'Email destinatario inválido' }, { status: 400 });
    }
    if (!subject) {
      return NextResponse.json({ ok: false, error: 'Falta asunto' }, { status: 400 });
    }
    if (!text && !htmlRaw) {
      return NextResponse.json({ ok: false, error: 'Falta contenido (text o html)' }, { status: 400 });
    }
    if (replyTo && !isValidEmail(replyTo)) {
      return NextResponse.json({ ok: false, error: 'Reply-To inválido' }, { status: 400 });
    }

    const correoEmpresa = process.env.GMAIL_USER?.trim() || 'infonattacocinas@gmail.com';
    const replyToFinal = replyTo || correoEmpresa;

    let html = htmlRaw;
    let attachments: any[] | undefined;
    if (!html && text) {
      const branded = buildBrandedEmail({
        title: subject,
        messageText: text,
        correoRespuesta: correoEmpresa,
      });
      html = branded.html;
      attachments = branded.attachments;
    }

    const info = await sendEmail({ to, subject, text, html, replyTo: replyToFinal, attachments });
    return NextResponse.json({ ok: true, messageId: info.messageId });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message ?? 'Error enviando el correo' },
      { status: 500 },
    );
  }
}

