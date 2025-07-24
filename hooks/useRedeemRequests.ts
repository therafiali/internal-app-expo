import { supabase } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";

export interface RedeemRequest {
  id: string;
  player_id: string;
  team_id: string;
  game_id: string;
  total_amount: number;
  process_status: string;
  created_at?: string;
  updated_at?: string;
  games?: {
    game_name: string;
  };
}

async function fetchRedeemRequestsByStatus(
  status: string[]
): Promise<RedeemRequest[]> {
  const { data, error } = await supabase
    .from("redeem_requests")
    .select(
      `
      *,
      games:game_id(game_name)
      `
    )
    .in("process_status", status)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as RedeemRequest[];
}

export function useRedeemRequests(status: string[]) {
  return useQuery<RedeemRequest[], Error>({
    queryKey: ["redeem_requests", status],
    queryFn: () => fetchRedeemRequestsByStatus(status),
  });
}
