# NexTrade MVP schema

PocketBase provides the built-in `users` auth collection. The migration adds the fields below and creates the remaining collections.

## `users` (auth)

Built-in auth fields include `email`, password credentials, verification state, and timestamps.

| Field | Type | Notes |
| --- | --- | --- |
| `name` | text | Optional |
| `phone` | text | Optional |
| `company_name` | text | Optional |
| `role` | select | `buyer`, `supplier`, or `admin` |
| `avatar` | file | Optional, one image, max 5 MB |
| `is_verified` | bool | Defaults to `false` |

Public registration creates only `buyer` users. A user can read and update their own profile; an app admin can read and manage all profiles. The update rule prevents a non-admin from changing their own role or verification state.

## `sourcing_requests`

| Field | Type | Notes |
| --- | --- | --- |
| `title` | text | Required |
| `product_name` | text | Required |
| `category` | select | `fruit`, `vegetable`, `seafood`, `coffee`, `rice`, `cashew`, `spice`, `other` |
| `quantity`, `target_country`, `budget_range` | text | Optional |
| `quantity_unit` | select | Optional: `kg`, `ton`, `container`, `carton`, or `piece` |
| `trade_intent` | select | Required: `buy` or `sell` |
| `needed_at` | text | Required trade date, stored as `YYYY-MM-DD 00:00:00` |
| `product_description` | text | Optional product-specific description shown to reviewers and copied to the public listing |
| `contact_name`, `contact_phone`, `contact_email` | text, text, email | Optional contact snapshot for the submitted case |
| `description` | editor | Optional |
| `status` | select | `draft`, `submitted`, `reviewing`, `sourcing`, `quoted`, `completed`, `cancelled` |
| `created_by` | relation → users | Required |
| `attachments` | files | Optional, up to 10 files, max 10 MB each |

Authenticated users can create requests only for themselves and can access, update, or delete their own records. App admins can access and manage every record.

## `supplier_leads`

## `approved_listings`

Public-safe listings created when an app admin approves a sourcing request. They contain title, product, category, quantity, target market, required trade intent/time, budget, and description, plus the source request relation. Buyer name, phone, and email are deliberately excluded. If a buyer edits an approved request, the mobile app sets the request back to `submitted` and deletes the linked public listing so the edited post waits for admin approval again.

`published_at` is an optional text timestamp in `YYYY-MM-DD HH:mm:ss`, written at approval time and used as the public listing date.

`request` is a required relation to `sourcing_requests`. `supplier_name` is required. Optional text fields are `contact_name`, `phone`, `country`, `address`, `quoted_price`, and `moq`; `email` and `website` use their respective validation types; `notes` is an editor field. `status` is one of `new`, `contacted`, `verified`, `rejected`, or `shortlisted`. `created_by` is an optional relation to `users`.

Request owners can read their leads. Only app admins can create, update, or delete them.

## `messages`

`request` and `sender` are required relations to `sourcing_requests` and `users`. `content` is required text and `attachments` accepts up to 10 optional files. A request owner can read and create messages for their request; app admins can access all messages.

## `payments`

`user` is a required relation to `users`; `request` is optional. `amount` is a required number. `currency` is `VND` or `USD`; `status` is `pending`, `paid`, `failed`, or `refunded`; `note` is optional text. A user can read only their payments, while app admins manage all payment records.

## Demo users

| Role | Email | Password |
| --- | --- | --- |
| Buyer | `buyer.demo@nextrade.local` | `Nex@1234` |
| App admin | `admin.demo@nextrade.local` | `Nex@1234` |

These are local development credentials only. The app admin is not the PocketBase dashboard superuser.
