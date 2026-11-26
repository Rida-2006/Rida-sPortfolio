# Portfolio reviews

Deploy `worker.mjs` to the existing Cloudflare Worker and keep its existing D1 database bound as `REVIEWS`. For a fresh database, apply `schema.sql` before deployment. The form in `index.html` uses the Worker's `/reviews` URL.

From this repository root, sign in to Wrangler with the Cloudflare account that owns the existing Worker, then deploy:

```sh
npx wrangler login
npx wrangler deploy --config review-service/wrangler.toml
```

The tracked configuration targets the existing Worker and `rida-review` database. Verify the deployment by loading the portfolio’s Reviews section in a fresh browser session.

The public feed includes existing and new comments, including entries previously held for moderation. The existing schema works without a migration. After a successful submission the Worker returns the saved review so the page can display it immediately. To remove a published review, locate its ID in the D1 console and delete that row.

If the site is deployed before the Worker update, the previous Worker still accepts submissions for moderation. The site shows the author a copy in their browser until it appears in the public feed.
