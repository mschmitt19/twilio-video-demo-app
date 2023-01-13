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

export const shipRoomStats = async (roomStats: any) => {
  await axios
    .post(`${process.env.NEXT_PUBLIC_LOGGING_ENDPOINT}`, { data: roomStats })
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });
};

export const shipSurveyFeedback = async (feedback: any) => {
  await axios
    .post(`${process.env.NEXT_PUBLIC_SURVEY_ENDPOINT}`, feedback)
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });
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
