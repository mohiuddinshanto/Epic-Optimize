import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  company: z.string().optional(),
  service: z.string().min(1, 'Please select a service'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  honeypot: z.string().optional(),
});

// Basic in-memory rate limiting for Next.js Edge / Node runtime
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 5;

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown-ip';
    const now = Date.now();
    const timestamps = (rateLimitMap.get(ip) || []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS);

    if (timestamps.length >= MAX_REQUESTS) {
      return NextResponse.json(
        {
          success: false,
          error:
            'Too many requests. Please wait a few minutes before trying again or email us directly at epicoptimize@gmail.com.',
        },
        { status: 429 }
      );
    }

    timestamps.push(now);
    rateLimitMap.set(ip, timestamps);

    const body = await request.json();
    const parseResult = contactSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          success: false,
          errors: parseResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { name, email, company, service, message, honeypot } = parseResult.data;

    // Honeypot trap: if filled, silently succeed without sending email to trap bots
    if (honeypot && honeypot.trim().length > 0) {
      return NextResponse.json(
        { success: true, message: 'Message sent successfully.' },
        { status: 200 }
      );
    }

    const resendApiKey = process.env.RESEND_API_KEY;
    const recipient = process.env.CONTACT_TO_EMAIL || 'epicoptimize@gmail.com';

    if (resendApiKey && !resendApiKey.startsWith('re_12345')) {
      try {
        const resendRes = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${resendApiKey}`,
          },
          body: JSON.stringify({
            from: 'Epic Optimize <inquiry@epicoptimize.com>',
            to: recipient,
            subject: `[New Inquiry] ${name} - ${service}`,
            text: `Name: ${name}\nEmail: ${email}\nCompany: ${company || 'N/A'}\nService: ${service}\n\nProject Brief:\n${message}`,
          }),
        });

        if (!resendRes.ok) {
          console.error('Failed to send via Resend', await resendRes.text());
        }
      } catch (e) {
        console.error('Error dispatching email via Resend:', e);
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Inquiry received. The Epic Optimize team will reach out within 12-24 hours.',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Next.js API route error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'An unexpected error occurred. Please contact epicoptimize@gmail.com directly.',
      },
      { status: 500 }
    );
  }
}
