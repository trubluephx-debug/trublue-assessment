# TruBlue Home Safety Assessment
### Ready-to-Deploy Package

---

## What's in this folder

```
trublue-assessment/
├── src/
│   ├── App.jsx          ← The full assessment app
│   └── main.jsx         ← App entry point (don't edit)
├── netlify/
│   └── functions/
│       └── generate-report.js  ← Secure API proxy (don't edit)
├── public/
│   └── favicon.svg      ← Browser tab icon
├── index.html           ← Page shell (don't edit)
├── package.json         ← Project config (don't edit)
├── vite.config.js       ← Build config (don't edit)
├── netlify.toml         ← Netlify config (don't edit)
└── README.md            ← This file
```

---

## How to Deploy (No Coding Required)

### Step 1 — Create a free Netlify account
Go to **netlify.com** → Sign Up (use Google or email — it's free)

### Step 2 — Connect your project
In the Netlify dashboard, click **"Add new site" → "Import an existing project"**

- If using GitHub: push this folder to a GitHub repo, then connect it
- If uploading directly: use **"Deploy manually"** — but NOTE: manual drag-and-drop does NOT support serverless functions. You must use GitHub or the Netlify CLI for full functionality.

**Recommended: Use GitHub**
1. Create a free account at github.com
2. Click "New repository" → name it `trublue-assessment` → upload all files
3. In Netlify, choose "Import from GitHub" and select that repo
4. Netlify auto-detects the settings from netlify.toml — just click Deploy

### Step 3 — Add your API key (REQUIRED)
Without this step, the Generate Report button will not work.

1. Go to **console.anthropic.com** → create a free account
2. Click **API Keys → Create Key** → copy the key (starts with `sk-ant-...`)
3. In your Netlify dashboard: **Site Settings → Environment Variables → Add variable**
   - Key: `ANTHROPIC_API_KEY`
   - Value: paste your key here
4. Click **Save**, then go to **Deploys → Trigger deploy** to restart

### Step 4 — Get your live URL
Netlify gives you a URL like `https://amazing-name-abc123.netlify.app`

To rename it: **Site Settings → General → Change site name**
Example: `https://trublue-assessment.netlify.app`

---

## Embedding in Leadpages

Once deployed, copy this code into a Leadpages HTML widget:

```html
<iframe
  src="https://YOUR-SITE-NAME.netlify.app"
  width="100%"
  height="950px"
  style="border:none; border-radius:12px;"
  title="TruBlue Home Safety Assessment">
</iframe>
```

Replace `YOUR-SITE-NAME` with your actual Netlify URL.

---

## Embedding in Other Platforms

**Wix:** Add Elements → Embed & Social → Embed a Website → paste URL

**Google Sites:** Insert → Embed → paste URL

**Carrd:** Add element → Embed → HTML → paste the iframe code above

**Any website:** Paste the iframe code above into any HTML block

---

## Need Help?

If something isn't working, the most common fixes are:
1. API key not added in Netlify environment variables (Step 3 above)
2. Used drag-and-drop deploy instead of GitHub (functions won't work with drag-and-drop)
3. Forgot to trigger a redeploy after adding the API key

---

*TruBlue Home Safety Assessment · Built with React + Vite · Powered by Anthropic Claude*
