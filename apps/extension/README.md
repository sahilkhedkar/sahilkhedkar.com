# YouTube Music "Now Playing" Chrome Extension

This Chrome Extension (Manifest V3) automatically syncs your currently playing song on [YouTube Music](https://music.youtube.com) to your portfolio website in real-time.

## Features

- **Automatic Song Detection**: Reads song title, artist, album art, and video ID using YouTube Music's MediaSession API and HTML5 audio/video state.
- **Efficient & Low Overhead**: Uses DOM mutation observers, playback event listeners, and low-frequency heartbeats rather than aggressive polling.
- **Secure Authentication**: All sync requests from your computer to your website backend are authenticated using `NOW_PLAYING_UPDATE_TOKEN`.
- **Status Badge**: Displays a live playback badge (▶ live green, ⏸ paused, or blank when idle) on the Chrome toolbar icon.
- **Automatic Lifecycle Sync**: Sends stopped/paused signals when tracks pause, tabs close, or browser exits.

## Building the Extension

To build the extension bundle from source:

```bash
cd apps/extension
bun run build
```

This compiles TypeScript and outputs the production bundle to `apps/extension/dist/`.

## Loading into Google Chrome

1. Open Google Chrome and navigate to `chrome://extensions/`.
2. Enable **Developer mode** in the top-right corner.
3. Click **Load unpacked**.
4. Select the `apps/extension/dist` folder inside this repository:
   `/home/sahil/Developer/sahilkhedkar.com/apps/extension/dist`
5. The extension "Now Playing on sahilkhedkar.com" will now appear in your toolbar!

## Configuring the Extension

1. Click the extension icon in your Chrome toolbar to open the popup.
2. Enter your **API Endpoint URL**:
   - Local development: `http://localhost:1234/api/now-playing`
   - Production: `https://sahilkhedkar.com/api/now-playing`
3. Enter your **Secret Update Token**:
   - Must match the `NOW_PLAYING_UPDATE_TOKEN` set in your website's `.env.local` or hosting environment variables.
4. Click **Test Connection** to verify that your backend endpoint and token work.
5. Click **Save Settings**.
6. Open [music.youtube.com](https://music.youtube.com) and start playing any song. Your portfolio website will immediately update for all visitors!
