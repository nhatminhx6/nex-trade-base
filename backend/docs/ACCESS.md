# Local access reference

Use this page for local NexTrade development only. All URLs assume PocketBase is running with `./scripts/start.sh` from the `backend` directory.

## Local URLs

| Service | URL | Purpose |
| --- | --- | --- |
| PocketBase API | http://127.0.0.1:8090/api/ | REST API used by the SwiftUI app |
| Health check | http://127.0.0.1:8090/api/health | Confirms that PocketBase is running |
| Admin dashboard | http://127.0.0.1:8090/_/ | Manage collections, records, API rules, and settings |

## PocketBase dashboard account

Use this account only at the admin dashboard (`/_/`). It is a PocketBase superuser and can manage all backend data.

```text
Email: admin@nextrade.local
Password: somaxDMqtmfdANSApIaehQCA
```

## Demo app accounts

Use these accounts for the SwiftUI app or the PocketBase API login endpoint. They do not log in to the PocketBase dashboard.

| Account | Email | Password | App role |
| --- | --- | --- | --- |
| Demo buyer | `buyer.demo@nextrade.local` | `DemoPass123!` | `buyer` |
| Demo app admin | `admin.demo@nextrade.local` | `DemoPass123!` | `admin` |

## Login endpoint for the app

```text
POST http://127.0.0.1:8090/api/collections/users/auth-with-password
```

Example request body:

```json
{
  "identity": "buyer.demo@nextrade.local",
  "password": "DemoPass123!"
}
```

The response contains a bearer token for authenticated API requests.

## Start the backend

```sh
cd backend
./scripts/start.sh
```

Do not use these local credentials in production.
