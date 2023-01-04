<a  href="https://www.twilio.com">
<img  src="https://static0.twilio.com/marketing/bundles/marketing/img/logos/wordmark-red.svg"  alt="Twilio"  width="250"  />
</a>

# Twilio Video - Feature Demo App

This application demonstrates how you can build a video application with [Twilio Programmable Video JS SDK](https://www.twilio.com/docs/video/javascript-getting-started), [Next JS](https://nextjs.org/), and [Twilio Paste](https://paste.twilio.design/).

📝 **Note:** this application was built off the official [Twilio Paste + Next JS App](https://github.com/twilio-labs/paste/tree/main/packages/paste-nextjs-template) template.

To get up and running locally with this repository, please see the [Local Development](#local-development) section below.

#

## What is it 🧐

The application is broken down into four distinct stages of a typical video chat experience, specifically focusing on:

### [Landing Screen](/components/screens/LandingScreen/LandingScreen.tsx)

- The initial view that is loaded at the base URL
- Provides the ability to create or join a video room
- Form inputs for `Participant Name` (name shown in room) and `Room Name` (Twilio Video Room to join/create)
- If you append the `?roomName=textexample` parameter to the URL, this will autopopulate the `Room Name` field and disable it, requiring only a `Participant Name` to be entered before proceeding to the `Pre-Join Screen`

### [Pre-Join Screen](/components/screens/PreJoinScreen/PreJoinScreen.tsx)

- Preview and configure local devices prior to joining the room
- Optionally enter the video room with camera or microphone enabled/disabled
- Retrieve Access Token scoped to the Video Room name
- [Preflight API](https://www.twilio.com/docs/video/troubleshooting/preflight-api) check runs in the background when the Access Token is returned - `passed` result allows them to join the room, any failure results in disabling the `Join Room` button

### [Active Video Room Screen](/components/screens/ActiveVideoRoom/ActiveVideoRoom.tsx)

- Shown after the `Local Participant` successfully connects to the room
- Grid-based view of the `Local` and `Remote` participants
- Room controls:
  - Toggle microphone on/off
  - Toggle camera on/off
  - Toggle screenshare on/off
  - Configure settings (local devices)
  - Disconnect from room

### [Post-Video Room Screen](/components/screens/PostVideoRoom/PostVideoRoom.tsx)

- The screen that displays when a participant disconnects from the video room (either manually or due to error)
- Currently allows you to redirect back to the `Landing Screen`
- **Optional**: a dedicated space in the user journey to collect survey feedback on the video experience and send to backend data storage for further analysis of performance

#

## Code Organization

The following breakdown highlights what each section of this repository is responsible for.

### [📁 pages](./pages/)

The routes for the application based on [file-system based routing](https://nextjs.org/docs/routing/introduction) provided by the Next.js framework.

- [📁 api](./pages/api/) - the API routes for the application (e.g. Access Token generation); for more information on how API routes work with Next.js, see [this documentation](https://nextjs.org/docs/api-routes/introduction)
- [📄 \_app.tsx](./pages/_app.tsx) - the entry point for the application which contains wrapper components to setup our `Query Client` for [React Query](https://react-query-v3.tanstack.com/) and `Theme Provider` from [Twilio Paste](https://paste.twilio.design/introduction/for-engineers/manual-installation#setting-up-the-theme-provider)
- [📄 index.tsx](./pages/index.tsx) - the base route for the application (`/`); sets up the title of the web page, sets the favicon logo, and renders the [Video Provider](./components/VideoProvider/VideoProvider.tsx) component

### [📁 components](./components/)

The user interface components that comprise the application, with a few specific callouts:

- [📁 screens](./components/screens/) - the parent components representing the four different screens outline in the [What is it](#what-is-it-🧐) section
- [📄 VideoProvider.tsx](./components/VideoProvider/VideoProvider.tsx) - the main logic controller for determining which screen to show based on the global state store
- [📄 styled.ts](./components/styled.ts) - styled components built using the Twilio Paste styling library and CSS

### [📁 lib](./lib/)

The utility folder of the application containing custom hooks, helper functions, middelware API, and type definitions.

- [📁 hooks](./lib/hooks/) - custom hooks used throughout the application to assist with local device gathering and track operations
- [📁 utils](./lib/utils/) - various utility functions
- [📄 api.ts](./lib/api.ts) - middleware functions setup using `axios` and `React Query` (currently only to fetch an Access Token)
- [📄 types.ts](./lib/types.ts) - type definitions

### [📁 store](./store/)

The global state management solution to store and access information across the application. The [Zustand](https://github.com/pmndrs/zustand) library is being utilized here.

#

## Local Development

1. After cloning the repository, install the package dependencies:

   ```
   npm install
   ```

2. Copy the `.env.example` file into a `.env` file, then populate the values with your Twilio account credentials:

   ```
   cp .env.example .env
   ```

   ```
   ACCOUNT_SID=ACxxxxxxxxxxxxxxxxx
   TWILIO_API_KEY=SKxxxxxxxxxxxxxxxxx
   TWILIO_API_SECRET=xxxxxxxxxxxxxxxxx
   ```

3. Run the application:

   ```
   npm run dev
   ```

4. Application should be available at `http://localhost:3000`.

   **Note:** By default, if no `?roomName=` URL Parameter is present, the user needs to enter a `Participant Name` and `Room Name` to connect to. If you append the `?roomName=textexample` parameter to the URL, this will autopopulate the `Room Name` field and disable it, requiring only a `Participant Name` to be entered before proceeding to the `Pre-Join Screen`. Example:

   ```
   http://localhost:3000/?roomName=test
   ```
