import { NextRequest, NextResponse } from 'next/server';

export interface LeadSubmission {
  name: string;
  businessName: string;
  phone: string;
  email: string;
  businessType: string;
  city: string;
  leadSource: string;
  biggestProblem: string;
  interestedInPilot: string;
  submittedAt: string;
}

// In-memory store for demo purposes.
// Replace with Google Sheets API, Supabase, or any backend when ready.
const leads: LeadSubmission[] = [];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const required = ['name', 'businessName', 'phone', 'email', 'businessType', 'city'];
    for (const field of required) {
      if (!body[field] || String(body[field]).trim() === '') {
        return NextResponse.json(
          { success: false, message: `${field} is required` },
          { status: 400 }
        );
      }
    }

    const lead: LeadSubmission = {
      name: String(body.name).trim(),
      businessName: String(body.businessName).trim(),
      phone: String(body.phone).trim(),
      email: String(body.email).trim(),
      businessType: String(body.businessType).trim(),
      city: String(body.city).trim(),
      leadSource: String(body.leadSource || 'Not specified').trim(),
      biggestProblem: String(body.biggestProblem || '').trim(),
      interestedInPilot: String(body.interestedInPilot || 'Not specified').trim(),
      submittedAt: new Date().toISOString(),
    };

    leads.push(lead);

    // TODO: Replace the above with a real integration such as:
    // await appendToGoogleSheet(lead);
    // await sendToWebhook(lead);
    // await saveToDatabase(lead);

    return NextResponse.json(
      {
        success: true,
        message: "Thanks! We'll be in touch within 24 hours.",
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { success: false, message: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}

export async function GET() {
  // Protected in production — add auth before exposing
  return NextResponse.json({ count: leads.length });
}
