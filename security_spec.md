# Y-CRAFT Studio — Security Specification

## 1. Data Invariants
1. `waiting_orders/{orderId}` documents may be created by public visitors submitting a project inquiry, **only** with `status == 'waiting'`, strict field types/sizes matching `firebase-blueprint.json`, no extra shadow fields, and server-verified timestamps (`createdAt == request.time`, `updatedAt == request.time`).
2. `waiting_orders/{orderId}` contains client PII (`name`, `contactInfo`, `notes`). **Zero** public or non-owner `get`, `list`, `update`, or `delete` access is permitted.
3. Only the verified owner (`youssefeslam906@gmail.com` with `email_verified == true`) may list, inspect, update status, or delete orders.
4. `waiting_orders` updates may only mutate `status` and `updatedAt` (with `updatedAt == request.time`), keeping `createdAt`, `name`, `contactInfo`, `websiteType`, `notes`, and `lang` immutable.
5. `admins/{adminId}` cannot be self-assigned by any other user; only the verified owner email may read or initialize their own admin record, and `list` is denied.

## 2. "Dirty Dozen" Adversarial Payloads (Must Return `PERMISSION_DENIED`)
1. **Unauthenticated List**: Unauthenticated client calls `list` on `/waiting_orders`.
2. **Non-Owner Authenticated List**: Signed-in user `attacker@gmail.com` (`email_verified: true`) calls `list` on `/waiting_orders`.
3. **Unverified Admin Email Spoof**: Signed-in user `youssefeslam906@gmail.com` with `email_verified: false` calls `list` or `get` on `/waiting_orders`.
4. **Non-Owner Single Document Get**: Signed-in user `other@gmail.com` calls `get` on `/waiting_orders/ord_123`.
5. **Shadow Field Injection on Create**: Visitor creates `/waiting_orders/ord_124` with extra field `isApproved: true`.
6. **Status Bypass on Create**: Visitor creates `/waiting_orders/ord_125` with `status: 'completed'` instead of `'waiting'`.
7. **Timestamp Forgery on Create**: Visitor creates `/waiting_orders/ord_126` with backdated `createdAt`.
8. **ID Poisoning**: Visitor creates `/waiting_orders/bad$id..with..chars` violating `^[a-zA-Z0-9_\-]+$`.
9. **Denial of Wallet Oversized String**: Visitor creates `/waiting_orders/ord_127` with a 5,000-char `notes` field (`> 1000`).
10. **Non-Owner Status Mutation**: Non-owner authenticated user attempts `update` on `/waiting_orders/ord_123`.
11. **Admin Immutable Field Tampering**: Even admin attempts `update` altering `createdAt` or `name` instead of `['status', 'updatedAt']`.
12. **Self-Assigned Admin Escalation**: Attacker creates `/admins/{attackerUid}` trying to grant themselves admin privileges.
