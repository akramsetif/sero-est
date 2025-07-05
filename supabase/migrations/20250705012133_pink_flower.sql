/*
  # SERO-EST Database Schema

  1. New Tables
    - `users` - User management with roles and authentication
    - `projets` - Project management with document links
    - `phases` - Project phases configuration
    - `stations` - Total station equipment management
    - `rapports` - Daily survey reports
    - `action_logs` - Activity logging for admin actions
    - `fichiers_drive` - Google Drive file references

  2. Security
    - Enable RLS on all tables
    - Add policies for role-based access control
    - Secure data access based on user roles

  3. Features
    - User authentication with username/password
    - Role-based authorization (admin, topographe, responsable)
    - Complete audit trail
    - Document management integration
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  nom text NOT NULL,
  mot_de_passe text NOT NULL,
  role text NOT NULL CHECK (role IN ('topographe', 'admin', 'responsable')),
  actif boolean DEFAULT true,
  date_creation timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Projets table
CREATE TABLE IF NOT EXISTS projets (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  nom text NOT NULL,
  description text,
  description_complete text,
  date_debut date NOT NULL,
  date_fin date,
  statut text NOT NULL CHECK (statut IN ('actif', 'termine', 'suspendu')) DEFAULT 'actif',
  liens_stations text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Fichiers Drive table
CREATE TABLE IF NOT EXISTS fichiers_drive (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  projet_id uuid REFERENCES projets(id) ON DELETE CASCADE,
  nom text NOT NULL,
  lien text NOT NULL,
  type text NOT NULL CHECK (type IN ('fiche', 'plan', 'station')),
  created_at timestamptz DEFAULT now()
);

-- Phases table
CREATE TABLE IF NOT EXISTS phases (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  nom text NOT NULL UNIQUE,
  type text NOT NULL CHECK (type IN ('standard', 'autre')) DEFAULT 'standard',
  created_at timestamptz DEFAULT now()
);

-- Stations table
CREATE TABLE IF NOT EXISTS stations (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  nom text NOT NULL,
  modele text NOT NULL,
  numero text NOT NULL,
  statut text NOT NULL CHECK (statut IN ('disponible', 'en_utilisation', 'maintenance')) DEFAULT 'disponible',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Rapports table
CREATE TABLE IF NOT EXISTS rapports (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  user_name text NOT NULL,
  date date NOT NULL,
  projet_id uuid REFERENCES projets(id) ON DELETE CASCADE,
  projet_nom text NOT NULL,
  phase_id uuid REFERENCES phases(id),
  phase_nom text NOT NULL,
  phase_autre text,
  type_structure text NOT NULL CHECK (type_structure IN ('pile', 'culee')),
  numero_structure text NOT NULL,
  taches text[] DEFAULT '{}',
  station_id uuid REFERENCES stations(id),
  station_nom text NOT NULL,
  remarques text DEFAULT '',
  statut text NOT NULL CHECK (statut IN ('enregistree', 'imprimee', 'envoyee_bcs', 'recue_bcs')) DEFAULT 'enregistree',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Action logs table
CREATE TABLE IF NOT EXISTS action_logs (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  user_name text NOT NULL,
  action text NOT NULL,
  details text,
  timestamp timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE projets ENABLE ROW LEVEL SECURITY;
ALTER TABLE fichiers_drive ENABLE ROW LEVEL SECURITY;
ALTER TABLE phases ENABLE ROW LEVEL SECURITY;
ALTER TABLE stations ENABLE ROW LEVEL SECURITY;
ALTER TABLE rapports ENABLE ROW LEVEL SECURITY;
ALTER TABLE action_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can read all users" ON users
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Only admins can insert users" ON users
  FOR INSERT TO authenticated 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Only admins can update users" ON users
  FOR UPDATE TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Only admins can delete users" ON users
  FOR DELETE TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for projets table
CREATE POLICY "All authenticated users can read projets" ON projets
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Only admins can manage projets" ON projets
  FOR ALL TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for fichiers_drive table
CREATE POLICY "All authenticated users can read fichiers" ON fichiers_drive
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Only admins can manage fichiers" ON fichiers_drive
  FOR ALL TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for phases table
CREATE POLICY "All authenticated users can read phases" ON phases
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Only admins can manage phases" ON phases
  FOR ALL TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for stations table
CREATE POLICY "All authenticated users can read stations" ON stations
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Only admins can manage stations" ON stations
  FOR ALL TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for rapports table
CREATE POLICY "Users can read all rapports" ON rapports
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Topographes can insert their own rapports" ON rapports
  FOR INSERT TO authenticated 
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can update rapport status" ON rapports
  FOR UPDATE TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role IN ('admin', 'responsable')
    )
  );

-- RLS Policies for action_logs table
CREATE POLICY "Only admins can read action logs" ON action_logs
  FOR SELECT TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "All authenticated users can insert action logs" ON action_logs
  FOR INSERT TO authenticated 
  WITH CHECK (user_id = auth.uid());

-- Insert initial data
INSERT INTO users (nom, mot_de_passe, role, actif) VALUES
  ('Akram', 'akram2025', 'admin', true),
  ('Akram', 'akram123', 'topographe', true),
  ('Bachir', 'bachir123', 'topographe', true),
  ('Mohammed', 'mohammed123', 'topographe', true),
  ('Salah', 'salah123', 'topographe', true)
ON CONFLICT DO NOTHING;

INSERT INTO phases (nom, type) VALUES
  ('Fond feuille de la semelle', 'standard'),
  ('BP de la semelle', 'standard'),
  ('Coffrage de la semelle', 'standard'),
  ('Coffrage les fûts', 'standard'),
  ('Coffrage chevettre et dés d''appui', 'standard'),
  ('Les appareils d''appui', 'standard'),
  ('Coffrage poutre couronnement', 'standard'),
  ('Autre', 'autre')
ON CONFLICT DO NOTHING;

INSERT INTO stations (nom, modele, numero, statut) VALUES
  ('TS 07', 'Station Totale TS 07', 'TS007', 'disponible'),
  ('TS 06 PLUS', 'Station Totale TS 06 PLUS', 'TS006P', 'disponible'),
  ('TS 11', 'Station Totale TS 11', 'TS011', 'disponible')
ON CONFLICT DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_rapports_user_id ON rapports(user_id);
CREATE INDEX IF NOT EXISTS idx_rapports_projet_id ON rapports(projet_id);
CREATE INDEX IF NOT EXISTS idx_rapports_date ON rapports(date);
CREATE INDEX IF NOT EXISTS idx_fichiers_drive_projet_id ON fichiers_drive(projet_id);
CREATE INDEX IF NOT EXISTS idx_action_logs_user_id ON action_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_action_logs_timestamp ON action_logs(timestamp);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projets_updated_at BEFORE UPDATE ON projets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_stations_updated_at BEFORE UPDATE ON stations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_rapports_updated_at BEFORE UPDATE ON rapports
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();