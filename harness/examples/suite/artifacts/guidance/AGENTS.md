# Working with Tally

- `client.record(name, properties, { idempotencyKey })`: pass an idempotency
  key whenever the same event could be sent twice.
- `client.list({ cursor })` returns one page. Keep calling with `nextCursor`
  until it is `null`.
