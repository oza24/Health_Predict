# Google Maps Setup Instructions

## Required Environment Variables

Create a `.env.local` file in the root directory with the following content:

```
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_actual_api_key_here
```

## Getting a Google Maps API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the following APIs:
   - Maps JavaScript API
   - Places API
   - Geocoding API
4. Create credentials (API Key)
5. Restrict the API key to your domain for security
6. Copy the API key and replace `your_actual_api_key_here` in the `.env.local` file

## Required APIs

Make sure these APIs are enabled in your Google Cloud project:
- **Maps JavaScript API** - For displaying the map
- **Places API** - For searching nearby facilities
- **Geocoding API** - For address conversion

## Security Note

Never commit your `.env.local` file to version control. It's already included in `.gitignore`.
