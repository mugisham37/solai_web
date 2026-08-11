import type { OrderStatus } from "@/types/dashboard";
import type { EscrowStageIndex } from "@/types/escrow";

/** Map order status onto MoneyFlow’s four-stage escrow strip. */
export function escrowStageForOrder(status: OrderStatus): EscrowStageIndex {
  switch (status) {
    case "held":
    case "problem":
      return 1;
    case "transit":
      return 2;
    case "paid":
      return 3;
  }
}
