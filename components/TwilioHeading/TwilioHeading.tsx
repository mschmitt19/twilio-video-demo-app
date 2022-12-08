import { MediaObject, MediaFigure, MediaBody, Text } from "@twilio-paste/core";
import React from "react";

interface TwilioHeadingProps {
  heading: string;
}

export default function LandingScreen({ heading }: TwilioHeadingProps) {
  return (
    <MediaObject as="div" verticalAlign="center" marginBottom={"space40"}>
      <MediaFigure as="div" spacing="space40">
        <img
          src="https://hosted-assets-2838-dev.twil.io/twilio.png"
          height="40px"
        />
      </MediaFigure>
      <MediaBody as="div">
        <Text
          as="p"
          fontSize="fontSize70"
          fontWeight="fontWeightMedium"
          color="colorTextBrandInverse"
        >
          {heading}
        </Text>
      </MediaBody>
    </MediaObject>
  );
}
