# Deploy henlocal.com to Cloudflare Workers

The site is built with vinext and deployed as one Cloudflare Worker. Static
pages, assets, and the `/api/inquiry` email endpoint are served by the same
Worker.

## 1. Add the domain to Cloudflare

1. Create a Cloudflare account and choose **Onboard a domain**.
2. Enter `henlocal.com` and select the **Free** plan.
3. Let Cloudflare scan the current DNS records.
4. Before changing nameservers, verify that any records you still need are
   present. Do not lose mail-related MX or TXT records.
5. If DNSSEC is enabled at GoDaddy, turn it off temporarily.
6. In GoDaddy, replace the current GoDaddy nameservers with the two nameservers
   Cloudflare assigns to the domain.
7. Wait until Cloudflare shows the domain status as **Active**.

After the switch, DNS is managed in Cloudflare rather than in GoDaddy. GoDaddy
remains the registrar.

## 2. Enable email delivery

1. In Cloudflare, open **Compute → Email Service → Email Routing**.
2. Under **Destination Addresses**, add the private inbox that should receive
   website inquiries.
3. Open Cloudflare's verification email and verify the address.
4. Enable Email Routing for `henlocal.com` and allow Cloudflare to add the
   required MX and TXT records.
5. Use an address on the domain for Worker mail, such as
   `website@henlocal.com`.

The private destination address is stored as an encrypted Worker secret and is
never included in browser code or the public repository.

## 3. Create a Cloudflare API token

1. Open **My Profile → API Tokens → Create Token**.
2. Use the **Edit Cloudflare Workers** template.
3. Limit the token to the account and `henlocal.com` zone when possible.
4. Copy the token immediately.
5. Copy the account ID from the Cloudflare account overview.

## 4. Configure GitHub deployment secrets

In `Hen-Local/website`, open:

**Settings → Secrets and variables → Actions → New repository secret**

Add:

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

The workflow in `.github/workflows/deploy-cloudflare.yml` builds and deploys
every push to `main`.

## 5. Deploy the Worker

Push this Cloudflare version to `main`, or run the workflow manually from the
GitHub **Actions** tab.

The first deployment creates a Worker named `hen-local-website`.

For a manual deployment:

```bash
npx wrangler login
npm install
npm run deploy
```

If Wrangler asks for an account, select the account containing `henlocal.com`.

## 6. Add encrypted email settings

After the first Worker deployment:

1. Open **Workers & Pages → hen-local-website → Settings → Variables and
   Secrets**.
2. Add these as encrypted secrets:

| Secret | Value |
| --- | --- |
| `CONTACT_TO_EMAIL` | The destination inbox verified in Email Routing |
| `CONTACT_FROM_EMAIL` | `website@henlocal.com` |

Do not put either value in a `NEXT_PUBLIC_` variable.

For local development, copy `.dev.vars.example` to `.dev.vars` and enter test
values. `.dev.vars` is ignored by Git.

## 7. Connect the custom domain

1. Open **Workers & Pages → hen-local-website → Settings → Domains & Routes**.
2. Choose **Add → Custom domain**.
3. Add `henlocal.com`.
4. Add `www.henlocal.com`.
5. The Worker redirects `www.henlocal.com` to `henlocal.com`.

Delete conflicting GitHub Pages A/CNAME records before adding the Worker custom
domains. Cloudflare creates the required DNS records and certificates.

## 8. Test before disabling GitHub Pages

1. Open `https://henlocal.com`.
2. Submit a test inquiry.
3. Confirm the email arrives and that replying targets the visitor's email.
4. Test the Chinese and English forms.
5. Only after these checks pass, disable GitHub Pages in the repository under
   **Settings → Pages**.

## Updating the website

Edit the site and push `main`. GitHub Actions deploys the new version to
Cloudflare Workers. Cloudflare secrets remain attached to the Worker and are
not stored in GitHub.
