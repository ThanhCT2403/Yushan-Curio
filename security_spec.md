# Firestore Security Specification

## 1. Data Invariants
- Every document under `/users/{userId}` belongs strictly to the authenticated, email-verified user whose `request.auth.uid == userId` and `data.uid == request.auth.uid`.
- No unauthenticated access or cross-user `get` / `list` reads are permitted (strict PII isolation for `email` and `displayName`).
- Document IDs must match `^[a-zA-Z0-9_\-]+$` and stay within 128 characters.
- `createdAt` is immutable and must equal `request.time` at creation; `updatedAt` must equal `request.time` on both creation and update.
- `uid` is immutable after creation (`incoming().uid == existing().uid`).
- Arrays (`wishlistIds`, `recentProductIds`) are strictly bounded (`<= 30` and `<= 12`).
- Strict allowlist keys (`keys().hasOnly(...)` on create and `affectedKeys().hasOnly(...)` on update) block any shadow fields such as `role` or `isAdmin`.

## 2. Adversarial Payloads ("Dirty Dozen")
1. **Unauthenticated read**: `get(/users/uid_alice)` with `auth == null` -> `PERMISSION_DENIED`.
2. **Cross-user PII read**: `get(/users/uid_alice)` signed in as `uid_bob` -> `PERMISSION_DENIED`.
3. **Collection list scraping**: `list(/users)` signed in as `uid_alice` -> `PERMISSION_DENIED`.
4. **Unverified email write**: `create(/users/uid_alice)` with `email_verified == false` -> `PERMISSION_DENIED`.
5. **Identity spoofing**: `create(/users/uid_alice)` signed in as `uid_alice` with payload `{ uid: "uid_bob", ... }` -> `PERMISSION_DENIED`.
6. **Shadow field privilege escalation**: `create(/users/uid_alice)` with extra `{ isAdmin: true, role: "admin" }` -> `PERMISSION_DENIED`.
7. **ID poisoning**: `create(/users/invalid$path..id)` -> `PERMISSION_DENIED`.
8. **Forged client timestamp**: `create(/users/uid_alice)` with client `createdAt: "2020-01-01T00:00:00Z"` instead of `request.time` -> `PERMISSION_DENIED`.
9. **Immutable `createdAt` mutation**: `update(/users/uid_alice)` changing `createdAt` -> `PERMISSION_DENIED`.
10. **Immutable `uid` mutation**: `update(/users/uid_alice)` changing `uid` -> `PERMISSION_DENIED`.
11. **Unbounded array exhaustion**: `update(/users/uid_alice)` sending `wishlistIds` with 31 entries -> `PERMISSION_DENIED`.
12. **Type/size poisoning**: `update(/users/uid_alice)` setting `displayName` to a 500-char string or non-string -> `PERMISSION_DENIED`.
