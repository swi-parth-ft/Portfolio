# Parth Portfolio AI Worker

This Cloudflare Worker proxies the OpenAI API so your key stays server-side.

## Setup

1) Install Wrangler and login:

```
npm install -g wrangler
wrangler login
```

2) Deploy the worker:

```
cd cloudflare-worker
wrangler deploy
```

3) Set secrets and allowed origins:

```
wrangler secret put OPENAI_API_KEY
wrangler secret put ALLOWED_ORIGINS
```

When prompted for `ALLOWED_ORIGINS`, enter your GitHub Pages origin, for example:

```
https://YOUR_GITHUB_USERNAME.github.io
```

If your site is hosted under a repository path, the origin stays the same.

Optional:

```
wrangler secret put OPENAI_MODEL
```

Example value: `gpt-4o-mini`.

## Connect the frontend

After deployment, Cloudflare will show a URL like:

```
https://parth-portfolio-ai.YOUR_SUBDOMAIN.workers.dev
```

Update the meta tag in `index.html` to match that URL:

```
<meta name="ai-chat-endpoint" content="https://parth-portfolio-ai.YOUR_SUBDOMAIN.workers.dev">
```
