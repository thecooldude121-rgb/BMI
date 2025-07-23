# Google Calendar Integration Setup

This guide will help you set up Google Calendar integration for MeetingAI to display upcoming meetings and provide join buttons.

## Prerequisites

- Google Cloud Platform account
- Google Calendar API access
- Admin access to your Google Workspace (if using organization calendar)

## Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Note your Project ID

## Step 2: Enable Calendar API

1. In the Google Cloud Console, go to **APIs & Services > Library**
2. Search for "Google Calendar API"
3. Click on "Google Calendar API" and click **Enable**

## Step 3: Create Service Account

1. Go to **APIs & Services > Credentials**
2. Click **Create Credentials > Service Account**
3. Fill in the service account details:
   - **Service account name**: `meetingai-calendar`
   - **Service account ID**: `meetingai-calendar`
   - **Description**: `Service account for MeetingAI calendar integration`
4. Click **Create and Continue**
5. Skip the optional steps and click **Done**

## Step 4: Generate Service Account Key

1. In the **Credentials** page, find your service account
2. Click on the service account email
3. Go to the **Keys** tab
4. Click **Add Key > Create New Key**
5. Choose **JSON** format
6. Click **Create** - this will download a JSON file

## Step 5: Share Calendar with Service Account

1. Open [Google Calendar](https://calendar.google.com/)
2. In the left sidebar, find the calendar you want to integrate
3. Click the three dots next to the calendar name
4. Select **Settings and sharing**
5. Scroll down to **Share with specific people**
6. Click **Add people**
7. Enter the service account email (from the JSON file: `client_email`)
8. Set permission to **See all event details**
9. Click **Send**

## Step 6: Configure Environment Variables

You have two options to configure the service account credentials:

### Option A: JSON File Path
1. Place the downloaded JSON file in a secure location
2. Set the environment variable:
   ```bash
   GOOGLE_SERVICE_ACCOUNT_KEY_FILE=/path/to/your/service-account-key.json
   ```

### Option B: JSON String (Recommended for Replit)
1. Open the downloaded JSON file
2. Copy the entire JSON content
3. Set the environment variable:
   ```bash
   GOOGLE_SERVICE_ACCOUNT_CREDENTIALS='{"type":"service_account","project_id":"your-project-id",...}'
   ```

## Step 7: Test Integration

1. Restart your application
2. Navigate to the Meetings page
3. Check the right sidebar for upcoming meetings
4. Verify that meetings from your Google Calendar appear

## Troubleshooting

### Common Issues

1. **"Calendar API has not been used in project"**
   - Make sure you enabled the Google Calendar API in step 2

2. **"Insufficient Permission"**
   - Ensure the service account has access to the calendar (step 5)
   - Check that the calendar is shared with the correct service account email

3. **"No events showing"**
   - Verify the service account email is added to your calendar
   - Check that you have events in the next 7 days
   - Ensure events are not private/confidential

4. **"Authentication Error"**
   - Verify the JSON credentials are correctly formatted
   - Check that the environment variable is properly set

### Security Considerations

- Keep service account credentials secure
- Use environment variables, never commit credentials to code
- Regularly rotate service account keys
- Grant minimal required permissions

## API Limits

Google Calendar API has usage limits:
- 1,000,000 queries per day
- 100 queries per 100 seconds per user

For most use cases, these limits are sufficient. The app refreshes calendar data every 5 minutes to stay within limits.

## Next Steps

Once Google Calendar integration is working:
1. Consider adding Outlook/Exchange integration
2. Implement meeting creation from the app
3. Add calendar sync for recorded meetings
4. Set up notifications for upcoming meetings