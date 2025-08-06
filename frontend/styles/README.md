# Autogo

Autogo Website

## Running the Next.js project

The Next.js application and all of its dependencies live inside the `frontend`
folder. Use either Yarn or npm to install modules **from that directory** and
run the project.

### Using npm

```bash
cd frontend
npm install           # install dependencies
npm run dev           # start development server
npm run build         # build for production
npm start             # run the production server
```

### Using Yarn

```bash
cd frontend
yarn                  # install dependencies
yarn dev              # start development server
yarn build            # build for production
yarn start            # run the production server
```

Both methods produce the same result; choose whichever tool you prefer.

## API Authentication

POST and DELETE requests to the API routes (`/api/blog` and `/api/cars`) require
an API key. Set the expected key in the `API_KEY` environment variable and pass
it in the `X-API-Key` header:

```bash
curl -H "X-API-Key: $API_KEY" -X POST ...
```

Requests without a valid key receive a `401 Unauthorized` response.
