# Talkie Marketing API

Serverless API for marketing/growth functions. Deploys separately to Vercel.

## Endpoints

### POST /api/subscribe
Email signup with spam protection.

**Request:**
```json
{
  "email": "user@example.com",
  "useCase": "dictation",
  "honeypot": "",
  "formLoadTime": 1234567890,
  "utm": {
    "utm_source": "twitter",
    "utm_medium": "social"
  }
}
```

**Response:**
```json
{ "success": true, "message": "You're on the list!" }
```

### POST /api/mockup
Generate iPhone mockup from screenshot.

**Request:**
```json
{
  "image": "base64-encoded-image",
  "model": "17",
  "color": "Black"
}
```

| Param | Type | Default | Options |
|-------|------|---------|---------|
| image | string | required | Base64-encoded PNG/JPEG |
| model | string | "17" | "17", "17-pro", "17-pro-max" |
| color | string | varies | iPhone 17: Black, White, Lavender, Mist Blue, Sage<br>Pro/Max: Silver, Deep Blue, Cosmic Orange |

**Response:** PNG image (binary)

**Example (curl):**
```bash
IMAGE_B64=$(base64 < screenshot.jpg | tr -d '\n')
curl -X POST https://marketing.usetalkie.com/api/mockup \
  -H "Content-Type: application/json" \
  -d "{\"image\":\"$IMAGE_B64\"}" \
  -o mockup.png
```

## iOS Shortcut

Use directly from iPhone share sheet:

1. **Create new Shortcut** in the Shortcuts app
2. Add these actions:
   - **Receive** `Images` from **Share Sheet**
   - **Resize Image** to width `1200` (reduces payload size)
   - **Convert Image** to JPEG (quality 80%)
   - **Base64 Encode** the image
   - **Get Contents of URL**:
     - URL: `https://marketing.usetalkie.com/api/mockup`
     - Method: POST
     - Headers: `Content-Type: application/json`
     - Request Body: JSON with key `image` and value from Base64
   - **Save to Photo Album**

3. Enable "Show in Share Sheet"
4. Now you can share any screenshot → Shortcut → get mockup in Photos

## Deployment

```bash
cd marketing-api
bun install  # or pnpm install
vercel --prod
```

Custom domain: `marketing.usetalkie.com`

## Environment Variables

Set in Vercel dashboard:
- `FORMSPREE_ID` - Formspree form ID for email storage

## CORS

Mockup API allows all origins (`*`) for iOS Shortcut compatibility.
