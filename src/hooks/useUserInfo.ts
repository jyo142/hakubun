import { WaniKaniAPI } from "../api/WaniKaniApi";
import { useQuery } from "@tanstack/react-query";

export const useUserInfo = () => {
  return useQuery({
    queryKey: ["user-info"],
    queryFn: WaniKaniAPI.getUser,
    // stale time of 4 hours
    staleTime: 4 * 60 * (60 * 1000),
    // garbage collection time of 5 hours
    gcTime: 5 * 60 * (60 * 1000),
  });
};
