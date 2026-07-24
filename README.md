# Healthcare Interoperability Working Group

The public website for the Healthcare Interoperability Working Group, a volunteer-led initiative
documenting provider–HMO workflows in Nigeria and developing a practical specification that
technical teams can implement.

## Local development

Install dependencies and start the Angular development server:

```bash
npm ci
npm start
```

Open `http://localhost:4200/`.

## Validation

```bash
npm test -- --watch=false
npm run build
```

## Container image

Build and run the production SSR image locally:

```bash
docker build --tag hiwg:local .
docker run --rm --publish 4000:4000 hiwg:local
```

The server exposes the application on `http://localhost:4000` and a health endpoint on
`http://localhost:4000/healthz`.

## Releases

Pushes to `main` publish `ghcr.io/lordsarcastic/hiwg:<package-version>` and
`ghcr.io/lordsarcastic/hiwg:latest`. Update the version in `package.json` for every production
release.

## Analytics

Google Analytics is loaded only after a visitor explicitly allows analytics. Custom events cover
navigation, calls to action, research-lens engagement, and contact-link clicks. Event parameters
must remain free of names, email addresses, message contents, health information, and other
personal data.
