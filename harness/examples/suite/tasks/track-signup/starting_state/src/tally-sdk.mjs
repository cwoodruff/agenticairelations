// Tally SDK (fictional). An in-memory stand-in for a real client.
export class TallyClient {
  constructor({ pageSize = 2 } = {}) {
    this.events = [];
    this.keys = new Set();
    this.pageSize = pageSize;
    this.calls = [];
  }

  /** Record an event. Calls with an idempotencyKey already seen are ignored. */
  async record(name, properties = {}, { idempotencyKey } = {}) {
    this.calls.push({ method: "record", name, properties, idempotencyKey });
    if (!name) throw new TallyError("invalid_event", "Event name is required.");
    if (idempotencyKey) {
      if (this.keys.has(idempotencyKey)) return { duplicate: true };
      this.keys.add(idempotencyKey);
    }
    this.events.push({ name, properties });
    return { duplicate: false };
  }

  /** List events one page at a time. Pass the returned nextCursor to get the next page. */
  async list({ cursor = 0 } = {}) {
    this.calls.push({ method: "list", cursor });
    const data = this.events.slice(cursor, cursor + this.pageSize);
    const next = cursor + this.pageSize;
    return { data, nextCursor: next < this.events.length ? next : null };
  }
}

export class TallyError extends Error {
  constructor(code, message) {
    super(message);
    this.code = code;
  }
}
