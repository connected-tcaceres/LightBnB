DROP TABLE IF EXISTS users CASCADE;

DROP TABLE IF EXISTS properties CASCADE;

DROP TABLE IF EXISTS reservations CASCADE;

DROP TABLE IF EXISTS property_reviews CASCADE;

CREATE EXTENSION CITEXT;

CREATE TABLE users (
  id serial PRIMARY KEY,
  name text NOT NULL,
  email CITEXT UNIQUE,
  PASSWORD text NOT NULL
);

CREATE TABLE properties (
  id serial PRIMARY KEY,
  owner_id INTEGER NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL,
  thumbnail_photo_url text,
  cover_photo_url text,
  cost_per_night money NOT NULL,
  parking_spaces smallint,
  number_of_bathrooms smallint,
  number_of_bedrooms smallint,
  country text NOT NULL,
  street text NOT NULL,
  city text NOT NULL,
  province text NOT NULL,
  post_code text NOT NULL,
  active boolean DEFAULT TRUE
);

CREATE TABLE reservations (
  id serial PRIMARY KEY,
  start_date date NOT NULL,
  end_date date NOT NULL CONSTRAINT end_after_start CHECK (end_date >= start_date),
  property_id integer NOT NULL REFERENCES properties (id) ON DELETE CASCADE,
  guest_id integer NOT NULL REFERENCES users (id) ON DELETE CASCADE
);

CREATE TABLE property_reviews (
  id serial PRIMARY KEY,
  guest_id integer NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  reservation_id integer NOT NULL REFERENCES reservations (id) ON DELETE CASCADE,
  property_id integer NOT NULL REFERENCES properties (id) ON DELETE CASCADE,
  rating smallint CONSTRAINT rating_values CHECK (rating >= 1
    AND rating <= 5),
  message text
);

