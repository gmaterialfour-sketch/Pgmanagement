-- V1__initial_schema.sql

CREATE TABLE users (
    id VARCHAR(255) PRIMARY KEY,
    phone VARCHAR(20) NOT NULL UNIQUE,
    name VARCHAR(255),
    role VARCHAR(20) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);

CREATE TABLE pgs (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    lat DOUBLE PRECISION NOT NULL,
    lng DOUBLE PRECISION NOT NULL,
    owner_id VARCHAR(255),
    owner_name VARCHAR(255),
    rent INTEGER NOT NULL,
    deposit INTEGER NOT NULL,
    food_rating DOUBLE PRECISION,
    safety_rating DOUBLE PRECISION,
    overall_rating DOUBLE PRECISION,
    amenities TEXT[],
    verified BOOLEAN DEFAULT FALSE,
    place_id VARCHAR(255),
    description TEXT,
    google_rating DOUBLE PRECISION,
    google_reviews JSONB,
    google_fetched_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);

CREATE TABLE room_inventory (
    id VARCHAR(255) PRIMARY KEY,
    pg_id VARCHAR(255) NOT NULL REFERENCES pgs(id),
    type VARCHAR(50) NOT NULL,
    total INTEGER NOT NULL,
    occupied INTEGER NOT NULL,
    price INTEGER,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);

CREATE TABLE bookings (
    id VARCHAR(255) PRIMARY KEY,
    pg_id VARCHAR(255) NOT NULL REFERENCES pgs(id),
    user_id VARCHAR(255) NOT NULL REFERENCES users(id),
    room_type VARCHAR(50) NOT NULL,
    status VARCHAR(20) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);

CREATE TABLE verifications (
    id VARCHAR(255) PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL REFERENCES users(id),
    document_type VARCHAR(50) NOT NULL,
    document_url TEXT NOT NULL,
    status VARCHAR(20) NOT NULL,
    rejection_reason TEXT,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);

CREATE TABLE nearby_infrastructure (
    id VARCHAR(255) PRIMARY KEY,
    pg_id VARCHAR(255) NOT NULL REFERENCES pgs(id),
    type VARCHAR(100) NOT NULL,
    name VARCHAR(255) NOT NULL,
    distance_km DOUBLE PRECISION NOT NULL
);

-- Indexes for performance
CREATE INDEX idx_pgs_location ON pgs(lat, lng);
CREATE INDEX idx_pgs_owner ON pgs(owner_id);
CREATE INDEX idx_bookings_user ON bookings(user_id);
CREATE INDEX idx_room_inventory_pg ON room_inventory(pg_id);
