<a  href="https://www.twilio.com">
<img  src="https://static0.twilio.com/marketing/bundles/marketing/img/logos/wordmark-red.svg"  alt="Twilio"  width="250"  />
</a>

# Twilio Video Demo App

TODO - add description/overview

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
