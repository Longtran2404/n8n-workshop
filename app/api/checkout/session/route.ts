import { NextRequest, NextResponse } from 'next/server';

// POST /api/checkout/session
export async function POST(req: NextRequest) {
  // TODO: create payment session (item|membership)
  return NextResponse.json({ sessionId: 'mock-session-id' });
}
