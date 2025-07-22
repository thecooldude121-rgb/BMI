/*
  # Create Custom Fields System

  1. New Tables
    - `custom_field_definitions`
      - Field definitions with validation rules
      - Support for various field types
    
    - `custom_field_values`
      - Actual field values linked to entities

  2. Security
    - Enable RLS on both tables
    - Proper access policies for field management
*/

-- Create enums
CREATE TYPE field_type AS ENUM ('text', 'number', 'email', 'phone', 'date', 'datetime', 'select', 'multiselect', 'boolean', 'textarea', 'url');
CREATE TYPE entity_type AS ENUM ('lead', 'contact', 'deal', 'account', 'task', 'activity');

-- Create custom_field_definitions table
CREATE TABLE IF NOT EXISTS custom_field_definitions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  label text NOT NULL,
  field_type field_type NOT NULL,
  entity_type entity_type NOT NULL,
  required boolean DEFAULT false,
  options jsonb DEFAULT '[]',
  default_value jsonb,
  validation_rules jsonb DEFAULT '{}',
  position integer NOT NULL DEFAULT 0,
  is_active boolean DEFAULT true,
  created_by uuid NOT NULL REFERENCES profiles(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(name, entity_type)
);

-- Create custom_field_values table
CREATE TABLE IF NOT EXISTS custom_field_values (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  field_definition_id uuid NOT NULL REFERENCES custom_field_definitions(id) ON DELETE CASCADE,
  entity_type entity_type NOT NULL,
  entity_id uuid NOT NULL,
  value jsonb NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(field_definition_id, entity_id)
);

-- Enable RLS
ALTER TABLE custom_field_definitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_field_values ENABLE ROW LEVEL SECURITY;

-- RLS Policies for custom_field_definitions
CREATE POLICY "Users can read field definitions"
  ON custom_field_definitions
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage field definitions"
  ON custom_field_definitions
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'manager')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'manager')
    )
  );

-- RLS Policies for custom_field_values
CREATE POLICY "Users can read field values"
  ON custom_field_values
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can manage field values"
  ON custom_field_values
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update field values"
  ON custom_field_values
  FOR UPDATE
  TO authenticated
  USING (true);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_custom_field_definitions_entity_type ON custom_field_definitions(entity_type);
CREATE INDEX IF NOT EXISTS idx_custom_field_definitions_active ON custom_field_definitions(is_active);
CREATE INDEX IF NOT EXISTS idx_custom_field_definitions_position ON custom_field_definitions(entity_type, position);

CREATE INDEX IF NOT EXISTS idx_custom_field_values_entity ON custom_field_values(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_custom_field_values_field ON custom_field_values(field_definition_id);

-- Create triggers
CREATE TRIGGER update_custom_field_definitions_updated_at
  BEFORE UPDATE ON custom_field_definitions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_custom_field_values_updated_at
  BEFORE UPDATE ON custom_field_values
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();