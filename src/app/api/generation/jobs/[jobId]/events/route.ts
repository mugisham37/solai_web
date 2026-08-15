import { proxyGenerationStream } from "@/lib/generation/sse-proxy";

/**
 * Reattaches to a generation already running on the server.
 *
 * The seller backgrounding the tab or losing signal kills the original
 * response, not the job; replaying from `lastEventId` picks the stream back up
 * where it stopped instead of charging them for a second run.
 */
export async function GET(
  request: Request,
  context: { params: Promise<{ jobId: string }> },
) {
  const { jobId } = await context.params;
  const lastEventId = new URL(request.url).searchParams.get("lastEventId") ?? "0";
  return proxyGenerationStream(
    `/v1/generation/jobs/${encodeURIComponent(jobId)}/events?lastEventId=${encodeURIComponent(lastEventId)}`,
    { method: "GET", headers: { "Last-Event-ID": lastEventId } },
  );
}
