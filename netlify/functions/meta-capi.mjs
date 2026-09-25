// Meta Conversions API (CAPI) bridge for dtnizamabdullayev.com
//
// Receives the browser events sent by src/components/MetaPixel.astro (same
// event_id as the Pixel, so Meta de-duplicates them), adds the visitor's IP and
// user agent, hashes personal data with SHA-256 and forwards it to Meta.
//
// Netlify environment variables (Site configuration → Environment variables):
//   META_CAPI_TOKEN       required — Events Manager → dataset → Settings →
//                         Conversions API → "Generate access token".
//                         Until it is set, this function does nothing (204).
//   META_TEST_EVENT_CODE  optional — only while testing in Events Manager → Test events.
//   META_GRAPH_VERSION    optional — defaults to v23.0.
import { createHash } from 'node:crypto';

const PIXEL_ID = process.env.META_PIXEL_ID || '1879222660061391';
const ALLOWED_EVENTS = new Set(['PageView', 'Contact', 'Lead', 'ViewContent']);
const ALLOWED_HOSTS = new Set(['dtnizamabdullayev.com', 'www.dtnizamabdullayev.com']);

const sha256 = (value) => createHash('sha256').update(value).digest('hex');
const norm = (value) => (typeof value === 'string' ? value.trim().toLowerCase() : '');

export default async (req, context) => {
  if (req.method !== 'POST') return new Response('Method Not Allowed', { status: 405 });

  const token = process.env.META_CAPI_TOKEN;
  if (!token) return new Response(null, { status: 204 }); // not configured yet: skip quietly

  let body;
  try {
    body = await req.json();
  } catch {
    return new Response('Bad Request', { status: 400 });
  }

  const eventName = String(body?.event_name || '');
  if (!ALLOWED_EVENTS.has(eventName)) return new Response('Bad Request', { status: 400 });

  const sourceUrl = String(body?.event_source_url || '');
  try {
    if (!ALLOWED_HOSTS.has(new URL(sourceUrl).hostname)) return new Response('Forbidden', { status: 403 });
  } catch {
    return new Response('Bad Request', { status: 400 });
  }

  const input = body?.user_data || {};
  const userData = {
    client_ip_address: context?.ip || req.headers.get('x-nf-client-connection-ip') || undefined,
    client_user_agent: req.headers.get('user-agent') || undefined,
  };
  if (typeof input.fbp === 'string' && input.fbp) userData.fbp = input.fbp;
  if (typeof input.fbc === 'string' && input.fbc) userData.fbc = input.fbc;

  const phone = typeof input.ph === 'string' ? input.ph.replace(/\D/g, '') : '';
  if (phone.length >= 7) userData.ph = [sha256(phone)];

  const nameParts = norm(input.name).split(/\s+/).filter(Boolean);
  if (nameParts.length) userData.fn = [sha256(nameParts[0])];
  if (nameParts.length > 1) userData.ln = [sha256(nameParts[nameParts.length - 1])];

  const customData = {};
  for (const [key, value] of Object.entries(body?.custom_data || {})) {
    if (typeof value === 'string' && value.length <= 200) customData[key] = value;
  }

  const eventId = String(body?.event_id || '').slice(0, 100);
  const payload = {
    data: [
      {
        event_name: eventName,
        event_time: Math.floor(Date.now() / 1000),
        ...(eventId ? { event_id: eventId } : {}),
        action_source: 'website',
        event_source_url: sourceUrl,
        user_data: userData,
        custom_data: customData,
      },
    ],
  };
  if (process.env.META_TEST_EVENT_CODE) payload.test_event_code = process.env.META_TEST_EVENT_CODE;

  const version = process.env.META_GRAPH_VERSION || 'v23.0';
  try {
    const res = await fetch(
      `https://graph.facebook.com/${version}/${PIXEL_ID}/events?access_token=${encodeURIComponent(token)}`,
      { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) },
    );
    if (!res.ok) console.error('Meta CAPI error', res.status, await res.text());
    return new Response(null, { status: res.ok ? 204 : 502 });
  } catch (err) {
    console.error('Meta CAPI request failed', err);
    return new Response(null, { status: 502 });
  }
};
