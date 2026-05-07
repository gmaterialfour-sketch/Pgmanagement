-- V2__enable_postgis.sql

CREATE EXTENSION IF NOT EXISTS postgis;

-- Add a geometry column to pgs table
ALTER TABLE pgs ADD COLUMN location_geom GEOGRAPHY(Point, 4326);

-- Populate the geometry column from lat/lng
UPDATE pgs SET location_geom = ST_SetSRID(ST_MakePoint(lng, lat), 4326)::geography;

-- Create a spatial index
CREATE INDEX idx_pgs_location_geom ON pgs USING GIST(location_geom);

-- Create a trigger to keep lat/lng and location_geom in sync
CREATE OR REPLACE FUNCTION sync_pg_location_geom()
RETURNS TRIGGER AS $$
BEGIN
    NEW.location_geom := ST_SetSRID(ST_MakePoint(NEW.lng, NEW.lat), 4326)::geography;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_sync_pg_location
BEFORE INSERT OR UPDATE OF lat, lng ON pgs
FOR EACH ROW EXECUTE FUNCTION sync_pg_location_geom();
