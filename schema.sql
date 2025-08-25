-- Enable uuid generation (works on most hosted Postgres)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Accounts (for double-entry)
CREATE TABLE IF NOT EXISTS accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('customer','platform_escrow','fees','provider_settlement'))
);

-- Transactions (immutable)
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  debit_account UUID NOT NULL REFERENCES accounts(id),
  credit_account UUID NOT NULL REFERENCES accounts(id),
  amount_cents BIGINT NOT NULL CHECK (amount_cents > 0),
  currency TEXT NOT NULL,
  external_ref TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK (debit_account <> credit_account)
);

-- Payment intents (mapped to provider)
CREATE TABLE IF NOT EXISTS payment_intents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider TEXT NOT NULL DEFAULT 'stripe',
  provider_id TEXT UNIQUE,
  amount_cents BIGINT NOT NULL,
  currency TEXT NOT NULL,
  status TEXT NOT NULL,
  customer_ref TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Idempotency storage
CREATE TABLE IF NOT EXISTS idempotency_keys (
  key TEXT NOT NULL,
  endpoint TEXT NOT NULL,
  response_json JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (key, endpoint)
);

-- Webhook event dedupe
CREATE TABLE IF NOT EXISTS webhook_events (
  event_id TEXT PRIMARY KEY,
  type TEXT NOT NULL,
  payload_hash TEXT NOT NULL,
  processed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Seed core accounts (once)
INSERT INTO accounts (id, name, type) VALUES
  (gen_random_uuid(), 'Platform Escrow', 'platform_escrow'),
  (gen_random_uuid(), 'Fees', 'fees'),
  (gen_random_uuid(), 'Provider Settlement', 'provider_settlement')
ON CONFLICT DO NOTHING;
