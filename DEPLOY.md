# Tikka Bar — deploy to `tikka-bar.elevaro.website`

Production URL: **https://tikka-bar.elevaro.website**

Source of truth for content: `elevaro-solutions/landing-pages` → `restaurants/tikka-bar/`.  
Deploy artifact: **`elevaro-solutions/tikka-bar`** (separate repo — only site files at repo root).

## Why a separate repo?

Hostinger Git pulls the **repository root** into the subdomain `public_html`. The monorepo also contains the gallery and other restaurants, so it is not a good fit for a single-restaurant subdomain.

## 1. Create the deploy repository on GitHub

1. Open [github.com/new](https://github.com/new)
2. Owner: `elevaro-solutions`
3. Repository name: `tikka-bar`
4. Public or private (either works with deploy key)
5. **Do not** add README, `.gitignore`, or license — keep it empty
6. Create repository

## 2. GitHub token for auto-sync

1. GitHub → **Settings → Developer settings → Personal access tokens**
2. Create a fine-grained token (or classic with `repo` scope)
3. Repository access: **`elevaro-solutions/tikka-bar`** (read/write)
4. In **`elevaro-solutions/landing-pages`** → **Settings → Secrets and variables → Actions**
5. New secret: `TIKKA_BAR_DEPLOY_TOKEN` = the token

After the next push to `main` that touches `restaurants/tikka-bar/`, the workflow **Sync Tikka Bar deploy repo** copies the folder into `elevaro-solutions/tikka-bar`.

Manual run: **Actions → Sync Tikka Bar deploy repo → Run workflow**.

## 3. Subdomain in Hostinger (hPanel)

1. [hPanel](https://hpanel.hostinger.com/) → **Websites**
2. Select hosting for `elevaro.website` (or add site if DNS-only today)
3. **Domains → Subdomains** → Create subdomain: `tikka-bar`
4. Document root is usually `public_html/tikka-bar` or `domains/tikka-bar.elevaro.website/public_html` — note the path

### DNS (if subdomain DNS is not created automatically)

In **DNS** for `elevaro.website`:

| Type | Name      | Value              |
|------|-----------|--------------------|
| A    | `tikka-bar` | Hostinger server IP |

TTL: Auto / 14400. Propagation can take up to a few hours.

## 4. Connect Git on Hostinger

1. hPanel → **Advanced → Git**
2. Choose site/domain: **`tikka-bar.elevaro.website`**
3. **Create repository**
   - URL: `git@github.com:elevaro-solutions/tikka-bar.git` (SSH) or HTTPS
   - Branch: `main`
   - Install path: subdomain `public_html` (must be **empty** before first deploy)
4. Copy the **SSH public key** from Hostinger
5. GitHub → `elevaro-solutions/tikka-bar` → **Settings → Deploy keys → Add deploy key**
   - Paste Hostinger key, title e.g. `Hostinger tikka-bar`
6. Back in hPanel → **Pull** / **Deploy** once to verify

### Auto-deploy on push

1. In Hostinger Git settings, enable **Auto Deployment** and copy the **Webhook URL**
2. GitHub → `elevaro-solutions/tikka-bar` → **Settings → Webhooks → Add webhook**
   - Payload URL: Hostinger webhook
   - Content type: `application/json`
   - Events: **Just the push event**

Flow: edit in `landing-pages` → Action syncs to `tikka-bar` repo → webhook deploys to Hostinger.

## 5. SSL

Hostinger usually issues Let's Encrypt for new subdomains within minutes after DNS resolves. Check **SSL** in hPanel if `https://` does not work.

## 6. Verify

- https://tikka-bar.elevaro.website/
- https://tikka-bar.elevaro.website/menu.html
- Order links still go to `https://uzeats.com/restaurant/tikka-bar`

## Local export (optional)

Without GitHub Actions, from repo root:

```bash
./scripts/export-tikka-bar.sh /tmp/tikka-bar-export
cd /tmp/tikka-bar-export && git init && git add . && git commit -m "Deploy Tikka Bar"
# git remote add origin git@github.com:elevaro-solutions/tikka-bar.git
# git push -u origin main
```
