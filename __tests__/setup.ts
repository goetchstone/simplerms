// __tests__/setup.ts
// server-only throws outside Next.js server context. In unit tests we only
// test pure logic (no DB, no auth), so silencing it here is safe.
vi.mock("server-only", () => ({}));
