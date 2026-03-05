# Music Connect

A bridge between all music streaming services. Share a song link from any music app and instantly open it in your preferred service.

## How It Works

1. **Share a link** from Spotify, YouTube, Apple Music, or any supported service
2. Music Connect looks up the song across all platforms via the [Songlink/Odesli API](https://odesli.co/)
3. If you've set a **default music app**, the song opens there automatically
4. All other platform links are shown as alternatives

## Quick Start

```bash
# Install dependencies
cd client/MusiConnect
npm install

# Start the app
npx expo start
```

Scan the QR code with Expo Go (mobile) or press `w` for web.

## Usage

### Share Intent (Primary)

Open any music app (Spotify, YouTube, etc.), tap **Share** on a song, and select **Music Connect**. The app will look up the song and open it in your default service.

> Share intent requires a [development build](https://docs.expo.dev/develop/development-builds/introduction/). In Expo Go, use the manual paste flow.

### Manual Paste (Fallback)

Open the app, tap the clipboard icon to paste a link (or type one), and tap **Find Links**.

### Setting Your Default App

Tap the gear icon in the top-right corner to pick your preferred music service. You can also **long-press** any platform in the results to set it as default.

## Development Build

To test the share intent feature on a real device:

```bash
# Android
npx expo run:android

# iOS (macOS only)
npx expo run:ios
```

## Supported Services

Spotify, Apple Music, YouTube Music, YouTube, Tidal, Deezer, Amazon Music, SoundCloud, Pandora, Napster, Audiomack, Anghami, Boomplay, iTunes, Audius, Yandex Music, and more.

## Tech Stack

- **React Native** (Expo SDK 55)
- **Songlink/Odesli API** for cross-platform link resolution
- **expo-share-intent** for receiving shared URLs
- **AsyncStorage** for persisting user preferences

## License

MIT
