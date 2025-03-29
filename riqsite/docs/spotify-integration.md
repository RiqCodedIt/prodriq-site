# Spotify API Integration

This document explains how to set up and use the Spotify API integration for the featured tracks on the Mixing + Mastering page.

## Setup Instructions

1. **Create a Spotify Developer Account**
   - Go to the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/)
   - Log in with your Spotify account or create a new one
   - Click "Create an App"
   - Fill in the app name (e.g., "PRODRIQ") and app description
   - Click "Create"

2. **Get Your API Credentials**
   - Once your app is created, you'll see your Client ID
   - Click "Show Client Secret" to reveal your Client Secret
   - Copy both values

3. **Configure Environment Variables**
   - Open the `.env` file in the root directory of your project
   - Add your Spotify credentials:
     ```
     VITE_SPOTIFY_CLIENT_ID=your_spotify_client_id
     VITE_SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
     ```
   - Replace `your_spotify_client_id` and `your_spotify_client_secret` with the actual values from the Spotify Developer Dashboard

## Using the Integration

### Track URLs and IDs

The component uses an array of Spotify track URLs that are converted to track IDs:

```javascript
const trackUrls = [
    'https://open.spotify.com/track/3rlbQrNDUyIpF5QPjpFCkV',
    'https://open.spotify.com/track/2hNLyPN3fM0Ds7LASznUkX',
    'https://open.spotify.com/track/7ngZ2kMSW18SHZ7RG3QeOG'
];

const trackIds = trackUrls.map(url => url.split('/track/')[1].split('?')[0]);
```

To change the featured tracks:
1. Replace the URLs in the `trackUrls` array with your desired tracks
2. Make sure the URLs are in the format `https://open.spotify.com/track/[track_id]`

### Track Roles

Each track is assigned a role that describes your contribution:

```javascript
const trackRoles: Record<string, string> = {
    '3rlbQrNDUyIpF5QPjpFCkV': 'Mixed & Mastered by RIQ',
    '2hNLyPN3fM0Ds7LASznUkX': 'Mixed by RIQ',
    '7ngZ2kMSW18SHZ7RG3QeOG': 'Mastered by RIQ'
};
```

When adding new tracks, be sure to:
1. Add the track ID as a key in this object
2. Set the value to your role (e.g., "Mixed by RIQ", "Produced by RIQ")

## Error Handling

If there's an issue with the Spotify API connection, the component will:
- Display an error message to the user
- Log detailed error information to the browser console
- Prompt the user to try again later

Common issues that may trigger an error state:
- Spotify API being temporarily unavailable
- Invalid API credentials in the `.env` file
- Issues with the specified track IDs
- Network connectivity problems

## Troubleshooting

If you encounter issues with the Spotify API integration:

1. **Check your API credentials**
   - Make sure the Client ID and Client Secret in your `.env` file are correct
   - Verify that you've set up your Spotify Developer account properly

2. **Validate your track URLs**
   - Ensure all track URLs are in the correct format
   - Test the URLs by opening them in a browser

3. **Check browser console for errors**
   - The component logs detailed error messages to the console
   - Look for messages starting with "Error fetching tracks" or "Error obtaining Spotify token"

4. **Review API rate limits**
   - The Spotify API has rate limits
   - If you're making too many requests, you might be temporarily blocked 