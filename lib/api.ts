import { useQuery } from "react-query";
import axios from "axios";

export const getAccessToken = async (
  roomName: string | undefined,
  identity?: string | undefined
) => {
  const { data } = await axios.get(
    `/api/token?roomName=${roomName}&identity=${identity}`
  );
  return data;
};

export const useGetToken = (
  roomName: string | undefined,
  identity?: string | undefined
) => {
  return useQuery(
    ["token", roomName, identity],
    async () => {
      const data = await getAccessToken(roomName, identity);
      return data;
    },
    {
      enabled: !roomName?.includes("undefined"),
    }
  );
};
