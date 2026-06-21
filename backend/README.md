# NexTrade backend

This folder contains the local PocketBase backend for the NexTrade MVP.

## Requirements

- macOS on Apple Silicon (M1, M2, M3, or later)
- No database, Docker, or additional backend framework is required

## Start locally

```sh
./scripts/start.sh
```

PocketBase starts at [http://127.0.0.1:8090](http://127.0.0.1:8090). Open the admin dashboard at [http://127.0.0.1:8090/_/](http://127.0.0.1:8090/_/).

On the first visit, PocketBase displays a form to create the first superuser account. This account is for the PocketBase dashboard and is separate from the seeded demo admin app user.

## Seed demo data

Stop the running server first, then run:

```sh
./scripts/seed.sh
```

The script applies the MVP schema and creates one buyer, one app admin, two sourcing requests, and three supplier leads. Demo credentials are listed in `docs/schema.md`.

## Reset local data

Stop PocketBase, then run:

```sh
./scripts/reset.sh
```

Confirm the prompt. This permanently removes the local SQLite database, uploaded files, migration history, and generated type definitions. Start the server again to recreate the schema, then run `./scripts/seed.sh` if demo data is needed.

## Project layout

```
backend/
  pocketbase/       PocketBase binary, data, and migrations
  docs/             API and schema documentation
  scripts/          Local development scripts
```

See [docs/API.md](docs/API.md) for SwiftUI-facing endpoints and [docs/schema.md](docs/schema.md) for the complete MVP schema.
See [docs/ACCESS.md](docs/ACCESS.md) for local URLs and development accounts.
