import { runPreflight } from "twilio-video";

export async function runPreflightTest(token: string) {
  try {
    const preflightTest = runPreflight(token);

    preflightTest.on("progress", (progress) => {
      console.log("progress ", progress);
    });

    preflightTest.on("completed", (report) => {
      console.log("completed", report);
    });

    preflightTest.on("failed", (error) => {
      console.log("failed", error);
    });
  } catch (error) {
    console.log("catch block error", error);
  }
}
