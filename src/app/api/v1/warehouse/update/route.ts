// # PUT /api/v1/delhivery/warehouse/update (stub)
// app/api/v1/delhivery/warehouse/update/route.ts
export const runtime = "nodejs";

type WarehouseUpdate = {
  name: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  phone?: string;
  email?: string;
};

export async function PUT(req: Request) {
  const body = (await req.json()) as WarehouseUpdate;
  // TODO: call Delhivery client-warehouse update API here
  return Response.json({ status: "stub", note: "Implement warehouse update", echo: body });
}
