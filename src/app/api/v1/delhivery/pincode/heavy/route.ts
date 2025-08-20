export const runtime = "nodejs";

// ---- Config ----
const TOKEN = process.env.DELHIVERY_API_TOKEN as string;
if (!TOKEN) throw new Error("DELHIVERY_API_TOKEN missing in .env.local");

// Default base → staging. Change `BASE_HEAVY` to production when ready.
const BASE_HEAVY = "https://staging-express.delhivery.com";

const PIN_RE = /^\d{6}$/;
const assertPin = (p: string) => {
  if (!PIN_RE.test(p)) throw new Error("Invalid pincode (must be 6 digits)");
};

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const pincode = searchParams.get("pincode") ?? "";
  const productType = searchParams.get("product_type") ?? "Heavy";

  assertPin(pincode);
  if (productType !== "Heavy") {
    return Response.json({ error: 'product_type must be "Heavy"' }, { status: 422 });
  }

  const apiUrl = new URL(`${BASE_HEAVY}/api/dc/fetch/serviceability/pincode`);
  apiUrl.searchParams.set("pincode", pincode);
  apiUrl.searchParams.set("product_type", "Heavy");

  const upstream = await fetch(apiUrl.toString(), {
    headers: { Authorization: `Token ${TOKEN}`, Accept: "application/json" },
    cache: "no-store",
  });

  if (!upstream.ok) {
    const text = await upstream.text();
    return new Response(text || "Delhivery error", { status: upstream.status });
  }

  const data = (await upstream.json()) as any;
  const out: any = { pin: pincode, raw: data };
  const status = String(data?.status ?? "").toUpperCase();
  if (status === "NSZ") out.serviceable = false;
  if (data && typeof data === "object" && "payment_type" in data) {
    out.payment_type = data.payment_type;
  }
  return Response.json(out);
}
