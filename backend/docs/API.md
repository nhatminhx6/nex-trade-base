# SwiftUI API guide

Base URL: `http://127.0.0.1:8090/api`

PocketBase uses JSON and bearer tokens. Store the `token` from login in the Keychain and send it as `Authorization: Bearer <token>` for authenticated calls. The collection rules enforce ownership; the client does not need to add an owner filter.

## Register buyer

`POST /collections/users/records`

```json
{
  "email": "buyer@example.com",
  "password": "Nex@1234",
  "passwordConfirm": "Nex@1234",
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
  "password": "Nex@1234"
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
  "quantity_unit": "ton",
  "target_country": "Singapore",
  "trade_intent": "buy",
  "needed_at": "2026-06-30 09:00:00",
  "product_description": "Grade A, export packing preferred.",
  "budget_range": "USD 1.20 - 1.80 / kg",
  "description": "Export-ready suppliers preferred.",
  "contact_name": "Mai Nguyen",
  "contact_phone": "+84900000000",
  "contact_email": "buyer@example.com",
  "status": "submitted",
  "created_by": "CURRENT_USER_ID"
}
```

`trade_intent` is required and must be `buy` or `sell`. `needed_at` is required and stores the selected trade date as `YYYY-MM-DD 00:00:00`. The contact fields are stored as a snapshot on the request, so a case retains the contact details submitted at that time even if the buyer later updates their profile.

For attachments, send `multipart/form-data` and append one or more `attachments` parts.

## List my sourcing requests

`GET /collections/sourcing_requests/records`

The rule returns only the current user's requests unless they are an app admin.

## Update my sourcing request

`PATCH /collections/sourcing_requests/records/{requestId}`

Send the same editable fields used when creating a request, excluding `created_by`. Mobile clients set `status` back to `submitted` when a buyer edits a request, so an already approved post returns to the review queue.

When a buyer edits an approved request, mobile also deletes any `approved_listings` records linked to that request. This unpublishes the old public listing until an admin approves the updated version again. The admin review page also removes any previous listing for the same request before publishing the new approved version.

## Delete my sourcing request

`DELETE /collections/sourcing_requests/records/{requestId}`

The collection rule allows the request owner or an app admin to delete the record.

## Review and publish listings

Open `http://127.0.0.1:8090/admin-review.html` and sign in with an app user whose role is `admin`. The review page approves or rejects submitted requests. Approval carries the required trade intent and trade time into the public listing; buyer contact details remain private on `sourcing_requests`.

Mobile clients load the published feed from:

`GET /collections/approved_listings/records`

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
