/** Wire constants shared by the SSE proxy (server) and its consumer (browser). */

/** Identifies the job behind a stream, so a dropped connection can reattach
 * to it instead of paying for a second generation. */
export const JOB_ID_HEADER = "X-Solai-Generation-Job-Id";
