# Agri Inventory Manager

A mobile-first agricultural retail inventory app built with Next.js, Tailwind CSS, and MongoDB.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file from the example:

```bash
copy .env.example .env
```

3. Set your MongoDB connection string in `.env`:

```env
MONGODB_URI="mongodb+srv://<username>:<password>@cluster0.mongodb.net/?retryWrites=true&w=majority"
```

4. Run the development server:

```bash
npm run dev
```

## MongoDB Connection

- Use MongoDB Atlas or any MongoDB database.
- Set `MONGODB_URI` in `.env`.
- Example:

```env
MONGODB_URI="mongodb+srv://admin:secretpassword@cluster0.mongodb.net/agri-inventory?retryWrites=true&w=majority"
```

## Deployment to Vercel

1. Push repository to GitHub.
2. Create a new Vercel project and connect your GitHub repository.
3. In Vercel Settings, add the environment variable:

```env
MONGODB_URI
```

4. Use the Vercel dashboard or the GitHub Actions workflow below to deploy.

### GitHub Actions Auto Deploy

This project includes `.github/workflows/vercel-deploy.yml` for automatic deployment on push to `main` or `master`.

Set the following repository secrets in GitHub:

- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

### Vercel Build Configuration

The `vercel.json` file is configured for Next.js and reads `MONGODB_URI` from Vercel project variables.

## Features

- Global product search
- Category views for Seeds, Fertilizer, Pesticides
- Inline price and stock editing
- Add new products
- AI-style receipt stock deduction interface
- Persistent MongoDB storage with API routes
