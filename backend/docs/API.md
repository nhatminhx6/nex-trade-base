# SwiftUI API guide

Base URL: `http://127.0.0.1:8090/api`

PocketBase uses JSON and bearer tokens. Store the `token` from login in the Keychain and send it as `Authorization: Bearer <token>` for authenticated calls. The collection rules enforce ownership; the client does not need to add an owner filter.

## Register buyer

`POST /collections/users/records`

```json
{
  "email": "buyer@example.com",
  "password": "a-strong-password",
  "passwordConfirm": "a-strong-password",
  "name": "Mai Nguyen",
  "phone": "+84900000000",
  "company_name": "Example Imports",
  "role": "buyer"
}
```

The public rule accepts only `buyer` for `role`.

## Login

`POST /collections/users/auth-with-password`

```json
{
  "identity": "buyer@example.com",
  "password": "a-strong-password"
}
```

Use the returned `token` and `record`.

## Get current user

`GET /collections/users/records/{userId}`

Send the bearer token. A non-admin can request only their own record.

## Create a sourcing request

`POST /collections/sourcing_requests/records`

```json
{
  "title": "Mango sourcing for Singapore",
  "product_name": "Cat Chu mango",
  "category": "fruit",
  "quantity": "10 tons per month",
  "target_country": "Singapore",
  "budget_range": "USD 1.20 - 1.80 / kg",
  "description": "Export-ready suppliers preferred.",
  "status": "submitted",
  "created_by": "CURRENT_USER_ID"
}
```

For attachments, send `multipart/form-data` and append one or more `attachments` parts.

## List my sourcing requests

`GET /collections/sourcing_requests/records?sort=-created`

The rule returns only the current user's requests unless they are an app admin.

## Get request detail

`GET /collections/sourcing_requests/records/{requestId}?expand=created_by`

## List supplier leads for a request

`GET /collections/supplier_leads/records?filter=request%3D%27REQUEST_ID%27&sort=-created`

The URL-decoded filter is `request='REQUEST_ID'`.

## Create a message

`POST /collections/messages/records`

```json
{
  "request": "REQUEST_ID",
  "sender": "CURRENT_USER_ID",
  "content": "Could you share the latest quotation?"
}
```

## List messages for a request

`GET /collections/messages/records?filter=request%3D%27REQUEST_ID%27&sort=created&expand=sender`

## Errors and pagination

PocketBase returns validation errors as JSON with HTTP status `400` or `403`. List endpoints return pagination metadata. Add `page` and `perPage` as needed, for example `?page=1&perPage=20`.
