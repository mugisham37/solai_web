import { proxyGenerationStream } from "@/lib/generation/sse-proxy";

export async function POST(request: Request) {
  return proxyGenerationStream("/v1/generation/scenes", {
    method: "POST",
    body: await request.text(),
  });
}
