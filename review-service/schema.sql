CREATE TABLE IF NOT EXISTS reviews (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  context TEXT NOT NULL,
  body TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  approved INTEGER NOT NULL DEFAULT 0 CHECK (approved IN (0, 1))
) STRICT;
CREATE INDEX IF NOT EXISTS reviews_visibility ON reviews (approved, id DESC);
