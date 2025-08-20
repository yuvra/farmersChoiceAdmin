// # POST /api/v1/delhivery/warehouse/create (stub)
// app/api/v1/delhivery/warehouse/create/route.ts
export const runtime = "nodejs";

type WarehouseCreate = {
  name: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  email?: string;
};

export async function POST(req: Request) {
  const body = (await req.json()) as WarehouseCreate;
  // TODO: call Delhivery client-warehouse create API here
  return Response.json({ status: "stub", note: "Implement warehouse creation", echo: body });
}
