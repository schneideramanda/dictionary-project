import { API_BASE_URL } from '@/lib/config';
import { NextRequest, NextResponse } from 'next/server';

const HOP_BY_HOP_REQUEST_HEADERS = new Set(['host', 'connection', 'content-length']);

async function proxy(req: NextRequest, segments: string[]) {
  const path = segments.join('/');
  const search = req.nextUrl.search;
  const targetUrl = `${API_BASE_URL}/${path}${search}`;

  const headers = new Headers();
  req.headers.forEach((value, key) => {
    if (!HOP_BY_HOP_REQUEST_HEADERS.has(key.toLowerCase())) {
      headers.set(key, value);
    }
  });

  const hasBody = !['GET', 'HEAD'].includes(req.method);

  const expressRes = await fetch(targetUrl, {
    method: req.method,
    headers,
    body: hasBody ? await req.text() : undefined,
    redirect: 'manual',
    cache: 'no-store',
  });

  const resHeaders = new Headers(expressRes.headers);
  resHeaders.delete('content-encoding');
  resHeaders.delete('content-length');

  const body = await expressRes.arrayBuffer();

  return new NextResponse(body, {
    status: expressRes.status,
    headers: resHeaders,
  });
}

type RouteParams = { params: Promise<{ path: string[] }> };

export async function GET(req: NextRequest, { params }: RouteParams) {
  const { path } = await params;
  return proxy(req, path);
}

export async function POST(req: NextRequest, { params }: RouteParams) {
  const { path } = await params;
  return proxy(req, path);
}

export async function PUT(req: NextRequest, { params }: RouteParams) {
  const { path } = await params;
  return proxy(req, path);
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  const { path } = await params;
  return proxy(req, path);
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  const { path } = await params;
  return proxy(req, path);
}
