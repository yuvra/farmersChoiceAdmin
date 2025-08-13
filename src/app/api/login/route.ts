import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = 'my_super_secret_key'; // Must match middleware

export async function POST(req: Request) {
  const { username, password } = await req.json();

  // Call AWS Lambda to validate credentials
  const lambdaPayload = {
    username,
    password,
  };

  try {
    const res = await fetch('https://ko36wsdaqazks4nx6zyy7qb3iq0selbh.lambda-url.ap-south-1.on.aws/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // If your lambda is private, include an IAM-authenticated token or API key here
      },
      body: JSON.stringify(lambdaPayload),
    });

    const lambdaResult = await res.json();

    if (res.ok && lambdaResult.valid) {
      const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '2h' });

      const response = NextResponse.json({ success: true });
      response.cookies.set('auth-token', token, {
        httpOnly: true,
        secure: true,
        path: '/',
        maxAge: 60 * 60 * 2,
      });

      return response;
    } else {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }
  } catch (error) {
    console.error('Lambda call failed:', error);
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}
