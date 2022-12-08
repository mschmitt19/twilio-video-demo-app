import type { NextApiRequest, NextApiResponse } from "next";
import * as Twilio from "twilio";

type ResponseData = {
  token?: string;
  message?: string;
};

export default (req: NextApiRequest, res: NextApiResponse<ResponseData>) => {
  const { identity, roomName } = req.query;

  if (roomName) {
    // Authorize the agent Frontend to connect to VIDEO
    const videoGrant = new Twilio.jwt.AccessToken.VideoGrant({
      room: String(roomName),
    });

    const tokenIdentity = identity ?? "guest";

    // Create an access token which
    const token = new Twilio.jwt.AccessToken(
      `${process.env.ACCOUNT_SID}`,
      `${process.env.TWILIO_API_KEY}`,
      `${process.env.TWILIO_API_SECRET}`,
      { identity: String(tokenIdentity) }
    );

    token.addGrant(videoGrant);

    res.status(200).json({ token: token.toJwt() });
  } else {
    res.status(400).json({
      message: "missing parameters - must send identity and roomName",
    });
  }
};
