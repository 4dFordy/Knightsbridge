-- CreateEnum
CREATE TYPE "AuditActorType" AS ENUM ('PLAYER', 'STAFF', 'SYSTEM');

-- CreateTable
CREATE TABLE "audit_log" (
    "id" BIGSERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actor_type" "AuditActorType" NOT NULL,
    "actor_id" TEXT,
    "action" TEXT NOT NULL,
    "entity_type" TEXT,
    "entity_id" TEXT,
    "before" JSONB,
    "after" JSONB,
    "meta" JSONB,
    "prev_hash" TEXT NOT NULL DEFAULT '',
    "hash" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "audit_log_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "audit_log_entity_type_entity_id_idx" ON "audit_log"("entity_type", "entity_id");

-- CreateIndex
CREATE INDEX "audit_log_actor_type_actor_id_idx" ON "audit_log"("actor_type", "actor_id");

-- CreateIndex
CREATE INDEX "audit_log_created_at_idx" ON "audit_log"("created_at");

-- ---------------------------------------------------------------------------
-- Append-only audit log (AGENTS.md rule 17). Written by hand: explain any change in the PR.
-- ---------------------------------------------------------------------------

-- The text that is hashed for each row. jsonb::text is canonical (keys sorted, whitespace normalised).
CREATE FUNCTION audit_log_row_text(r audit_log) RETURNS text
LANGUAGE sql IMMUTABLE AS $$
  SELECT concat_ws('|',
    r.id::text,
    to_char(r.created_at AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'),
    r.actor_type::text,
    coalesce(r.actor_id, ''),
    r.action,
    coalesce(r.entity_type, ''),
    coalesce(r.entity_id, ''),
    coalesce(r.before::text, ''),
    coalesce(r.after::text, ''),
    coalesce(r.meta::text, ''),
    r.prev_hash)
$$;

CREATE FUNCTION audit_log_row_hash(r audit_log) RETURNS text
LANGUAGE sql IMMUTABLE AS $$
  SELECT encode(sha256(convert_to(audit_log_row_text(r), 'UTF8')), 'hex')
$$;

-- Before each insert: take the chain lock, give the row the next id and the database's own clock time,
-- link it to the previous row and seal it with its hash. The lock is held until commit, so rows are
-- chained in id order even when many are written at once.
CREATE FUNCTION audit_log_before_insert() RETURNS trigger
LANGUAGE plpgsql AS $$
DECLARE
  last_hash text;
BEGIN
  PERFORM pg_advisory_xact_lock(hashtext('innit.audit_log.chain'));
  NEW.id := nextval(pg_get_serial_sequence('audit_log', 'id'));
  NEW.created_at := clock_timestamp();
  SELECT hash INTO last_hash FROM audit_log ORDER BY id DESC LIMIT 1;
  NEW.prev_hash := coalesce(last_hash, repeat('0', 64));
  NEW.hash := audit_log_row_hash(NEW);
  RETURN NEW;
END;
$$;

CREATE TRIGGER audit_log_seal BEFORE INSERT ON audit_log
  FOR EACH ROW EXECUTE FUNCTION audit_log_before_insert();

-- Refuse every update, delete and truncate.
CREATE FUNCTION audit_log_refuse_change() RETURNS trigger
LANGUAGE plpgsql AS $$
BEGIN
  RAISE EXCEPTION 'audit_log is append-only: % is not allowed', TG_OP
    USING ERRCODE = 'restrict_violation';
END;
$$;

CREATE TRIGGER audit_log_no_update_or_delete BEFORE UPDATE OR DELETE ON audit_log
  FOR EACH ROW EXECUTE FUNCTION audit_log_refuse_change();

CREATE TRIGGER audit_log_no_truncate BEFORE TRUNCATE ON audit_log
  FOR EACH STATEMENT EXECUTE FUNCTION audit_log_refuse_change();

-- Checks the whole chain. Returns the id of the first row that doesn't match, or NULL if intact.
CREATE FUNCTION audit_log_first_broken_id() RETURNS bigint
LANGUAGE sql STABLE AS $$
  SELECT id FROM (
    SELECT a.id, a.hash, a.prev_hash,
           audit_log_row_hash(a) AS expected_hash,
           coalesce(lag(a.hash) OVER (ORDER BY a.id), repeat('0', 64)) AS expected_prev
    FROM audit_log a
  ) c
  WHERE c.hash <> c.expected_hash OR c.prev_hash <> c.expected_prev
  ORDER BY id
  LIMIT 1
$$;

-- First entry: the log itself was created.
INSERT INTO audit_log (actor_type, actor_id, action, entity_type)
VALUES ('SYSTEM', 'migration', 'audit_log.created', 'audit_log');
