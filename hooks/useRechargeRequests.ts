import { supabase } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";

export interface RechargeRequest {
  id: string;
  recharge_id?: string;
  player_id: string;
  team_id?: string;
  game_id: string;
  amount: number;
  process_status?: string;
  payment_method_id?: string;
  screenshot_url?: string[] | null;
  notes?: string;
  created_at?: string;
  updated_at?: string;
  // ...add other fields as needed
}

async function fetchRechargeRequestsByStatus(
  status: string
): Promise<RechargeRequest[]> {
  const { data, error } = await supabase
    .from("recharge_requests")
    .select(
      `
      *,
      games:game_id(game_name)
      `
    )
    .in("process_status", [status])
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as RechargeRequest[];
}

export function useRechargeRequests(status: string) {
  return useQuery<RechargeRequest[], Error>({
    queryKey: ["recharge_requests", status],
    queryFn: () => fetchRechargeRequestsByStatus(status),
  });
}
