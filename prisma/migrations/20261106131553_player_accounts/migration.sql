-- CreateTable
CREATE TABLE "player" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "date_of_birth" DATE NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,
    "email_verified_at" TIMESTAMPTZ(3),
    "age_verified_at" TIMESTAMPTZ(3),

    CONSTRAINT "player_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "player_session" (
    "id" TEXT NOT NULL,
    "player_id" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_seen_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMPTZ(3) NOT NULL,
    "revoked_at" TIMESTAMPTZ(3),

    CONSTRAINT "player_session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sign_in_attempt" (
    "id" BIGSERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "succeeded" BOOLEAN NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sign_in_attempt_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "player_email_key" ON "player"("email");

-- CreateIndex
CREATE INDEX "player_session_player_id_idx" ON "player_session"("player_id");

-- CreateIndex
CREATE INDEX "sign_in_attempt_email_created_at_idx" ON "sign_in_attempt"("email", "created_at");

-- AddForeignKey
ALTER TABLE "player_session" ADD CONSTRAINT "player_session_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "player"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- ---------------------------------------------------------------------------
-- Hand-written rules (explain any change in the PR).
-- ---------------------------------------------------------------------------

-- Emails are stored trimmed and lower-case so the unique index treats Ann@x.com and ann@x.com as the same.
ALTER TABLE "player" ADD CONSTRAINT "player_email_normalised" CHECK ("email" = lower(btrim("email")));

-- 18+ only (AGENTS.md rule 6). The app checks this too; the database refuses it regardless.
-- Age is worked out on today's UK calendar date. Someone born on 29 February turns 18 on 1 March
-- in non-leap years, as in UK law.
CREATE FUNCTION player_must_be_adult() RETURNS trigger
LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.date_of_birth > ((now() AT TIME ZONE 'Europe/London')::date - interval '18 years')::date THEN
    RAISE EXCEPTION 'player must be 18 or over' USING ERRCODE = 'check_violation';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER player_must_be_adult BEFORE INSERT OR UPDATE OF date_of_birth ON "player"
  FOR EACH ROW EXECUTE FUNCTION player_must_be_adult();
