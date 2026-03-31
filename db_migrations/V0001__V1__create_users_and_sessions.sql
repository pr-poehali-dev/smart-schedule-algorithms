CREATE TABLE IF NOT EXISTS t_p75248420_smart_schedule_algor.users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('student', 'teacher', 'admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS t_p75248420_smart_schedule_algor.sessions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES t_p75248420_smart_schedule_algor.users(id),
  token TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '30 days')
);

CREATE INDEX IF NOT EXISTS idx_sessions_token ON t_p75248420_smart_schedule_algor.sessions(token);
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON t_p75248420_smart_schedule_algor.sessions(user_id);
