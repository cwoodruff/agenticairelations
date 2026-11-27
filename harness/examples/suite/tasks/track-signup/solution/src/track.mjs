export async function trackSignup(client, userId) {
  return client.record('signup', { userId }, { idempotencyKey: `signup:${userId}` });
}
