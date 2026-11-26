# Portfolio reviews

Deploy worker.mjs as a Cloudflare Worker. Create a D1 database, apply schema.sql, and bind the database to the Worker as REVIEWS. Set data-endpoint on the review form in index.html to the Worker's HTTPS /reviews URL. Configure a rate limit for POST /reviews before opening submissions.

New reviews are pending. To publish one, inspect it in the D1 console and set approved to 1 for that review's id. Only approved reviews appear in the site's feed.
