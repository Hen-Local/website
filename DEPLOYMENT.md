# Publish `henlocal.com` with GitHub Pages

The repository already contains a GitHub Actions workflow that builds and deploys the site whenever `main` changes.

## 1. Create the GitHub repository

Create a repository in the `Hen-Local` organization, for example `Hen-Local/henlocal.com`. A public repository works with GitHub Free.

From this folder, commit and push the site:

```bash
git add .
git commit -m "Launch 很 Local website"
git remote add origin https://github.com/Hen-Local/henlocal.com.git
git push -u origin main
```

If the repository already has an `origin`, replace the `git remote add` command with:

```bash
git remote set-url origin https://github.com/Hen-Local/henlocal.com.git
```

## 2. Turn on GitHub Pages

In the GitHub repository:

1. Open **Settings → Pages**.
2. Under **Build and deployment**, choose **GitHub Actions** as the source.
3. Under **Custom domain**, enter `henlocal.com` and select **Save**.
4. Wait for the **Deploy website to GitHub Pages** workflow to finish under the **Actions** tab.

## 3. Configure meeting inquiries

GitHub Pages is a static host. The inquiry form therefore submits JSON to the
self-hosted `contact-inquiry-service` running on the VPS.

1. Deploy the inquiry service and confirm that
   `https://forms.pitun.cc/healthz` returns `{"ok":true}`.
2. In GitHub, open **Settings → Secrets and variables → Actions → Variables**.
3. Add `CONTACT_FORM_ENDPOINT` with:

   ```text
   https://forms.pitun.cc/api/inquiries
   ```

4. Run the Pages workflow again, or push a new commit.

For local preview, copy `.env.example` to `.env.local`, set the same endpoint,
and restart the development server. The endpoint is public configuration;
database and administrator credentials remain only on the VPS.

## 4. Point GoDaddy DNS to GitHub Pages

In GoDaddy, open **Domain Portfolio → henlocal.com → DNS**. Remove conflicting parking or forwarding records for `@` and `www`, but do not remove email-related MX or TXT records.

Add these records:

| Type | Name | Value | TTL |
| --- | --- | --- | --- |
| A | `@` | `185.199.108.153` | Default |
| A | `@` | `185.199.109.153` | Default |
| A | `@` | `185.199.110.153` | Default |
| A | `@` | `185.199.111.153` | Default |
| CNAME | `www` | `Hen-Local.github.io` | Default |

GitHub recommends configuring both the apex and `www` versions. With both records present, GitHub Pages redirects `www.henlocal.com` to `henlocal.com`.

## 5. Finish HTTPS setup

DNS can take up to 24 hours to propagate. Return to **Settings → Pages** after GitHub finishes checking the domain, then enable **Enforce HTTPS**. The certificate option can take a little longer to appear.

## 6. Recommended domain verification

To prevent another repository from claiming the domain, verify it for the `Hen-Local` organization under **Organization Settings → Pages → Add a domain**. GitHub will give you a TXT record to add in GoDaddy. Keep that TXT record after verification.

## Updating the website

Edit the site, commit the changes, and push `main`. The included workflow rebuilds and republishes the site automatically.

## References

- [GitHub: Managing a custom domain for GitHub Pages](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site)
- [GitHub: Verifying a custom domain](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/verifying-your-custom-domain-for-github-pages)
- [GoDaddy: Add or edit an A record](https://www.godaddy.com/help/add-or-edit-an-a-record-42546)
