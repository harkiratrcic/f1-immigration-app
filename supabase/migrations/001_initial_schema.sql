-- F1 Immigration inc. Database Schema for Supabase
-- Migration: Initial schema setup

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- User roles enum
CREATE TYPE user_role AS ENUM ('ADMIN', 'STAFF');

-- Form status enum
CREATE TYPE form_status AS ENUM ('draft', 'sent', 'opened', 'pending', 'submitted', 'completed', 'cancelled');

-- Invite status enum
CREATE TYPE invite_status AS ENUM ('sent', 'opened', 'expired', 'completed');

-- Users table for firm staff
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    role user_role DEFAULT 'STAFF',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Clients table
CREATE TABLE clients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50),
    country VARCHAR(100),
    uci VARCHAR(20),
    notes TEXT,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Form templates table
CREATE TABLE form_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    fields JSONB NOT NULL,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Form instances table (specific forms sent to clients)
CREATE TABLE form_instances (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    template_id UUID REFERENCES form_templates(id),
    form_type VARCHAR(100) NOT NULL,
    token VARCHAR(255) UNIQUE NOT NULL,
    status form_status DEFAULT 'draft',
    opened_at TIMESTAMP WITH TIME ZONE,
    submitted_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Form responses table (client submissions)
CREATE TABLE form_responses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    form_instance_id UUID NOT NULL REFERENCES form_instances(id) ON DELETE CASCADE,
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    data JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Invites table (tracking form invitations)
CREATE TABLE invites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    form_instance_id UUID NOT NULL REFERENCES form_instances(id) ON DELETE CASCADE,
    token VARCHAR(255) NOT NULL,
    form_type VARCHAR(100) NOT NULL,
    status invite_status DEFAULT 'sent',
    message TEXT,
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    opened_at TIMESTAMP WITH TIME ZONE,
    expired_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_clients_email ON clients(email);
CREATE INDEX idx_clients_uci ON clients(uci);
CREATE INDEX idx_form_instances_client ON form_instances(client_id);
CREATE INDEX idx_form_instances_token ON form_instances(token);
CREATE INDEX idx_form_instances_status ON form_instances(status);
CREATE INDEX idx_form_responses_form_instance ON form_responses(form_instance_id);
CREATE INDEX idx_form_responses_client ON form_responses(client_id);
CREATE INDEX idx_invites_client ON invites(client_id);
CREATE INDEX idx_invites_token ON invites(token);
CREATE INDEX idx_invites_status ON invites(status);

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_form_templates_updated_at BEFORE UPDATE ON form_templates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_form_instances_updated_at BEFORE UPDATE ON form_instances FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_invites_updated_at BEFORE UPDATE ON invites FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE form_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE form_instances ENABLE ROW LEVEL SECURITY;
ALTER TABLE form_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE invites ENABLE ROW LEVEL SECURITY;

-- Policies for authenticated users (staff access)
CREATE POLICY "Staff can read all data" ON users FOR SELECT USING (true);
CREATE POLICY "Staff can read all clients" ON clients FOR SELECT USING (true);
CREATE POLICY "Staff can insert clients" ON clients FOR INSERT WITH CHECK (true);
CREATE POLICY "Staff can update clients" ON clients FOR UPDATE USING (true);
CREATE POLICY "Staff can delete clients" ON clients FOR DELETE USING (true);

CREATE POLICY "Staff can read all form templates" ON form_templates FOR SELECT USING (true);
CREATE POLICY "Staff can insert form templates" ON form_templates FOR INSERT WITH CHECK (true);
CREATE POLICY "Staff can update form templates" ON form_templates FOR UPDATE USING (true);

CREATE POLICY "Staff can read all form instances" ON form_instances FOR SELECT USING (true);
CREATE POLICY "Staff can insert form instances" ON form_instances FOR INSERT WITH CHECK (true);
CREATE POLICY "Staff can update form instances" ON form_instances FOR UPDATE USING (true);

CREATE POLICY "Staff can read all form responses" ON form_responses FOR SELECT USING (true);
CREATE POLICY "Staff can insert form responses" ON form_responses FOR INSERT WITH CHECK (true);

CREATE POLICY "Staff can read all invites" ON invites FOR SELECT USING (true);
CREATE POLICY "Staff can insert invites" ON invites FOR INSERT WITH CHECK (true);
CREATE POLICY "Staff can update invites" ON invites FOR UPDATE USING (true);

-- Public policies for form submission (using token-based access)
CREATE POLICY "Allow public form access by token" ON form_instances
    FOR SELECT USING (true);

CREATE POLICY "Allow public form submission by token" ON form_instances
    FOR UPDATE USING (true);

CREATE POLICY "Allow public form response submission" ON form_responses
    FOR INSERT WITH CHECK (true);

-- Insert default admin user (you'll need to update this with real data)
INSERT INTO users (email, name, role) VALUES
('admin@f1immigration.com', 'F1 Immigration Admin', 'ADMIN');

-- Insert default form templates
INSERT INTO form_templates (name, type, description, fields) VALUES
(
    'Work Permit Application',
    'work_permit',
    'Standard work permit application form',
    '{
        "personal": ["full_name", "date_of_birth", "nationality", "passport_number"],
        "contact": ["email", "phone", "address"],
        "employment": ["job_title", "employer", "start_date", "salary"],
        "documents": ["passport", "job_offer", "education_certificates"]
    }'::jsonb
),
(
    'Permanent Residence Application',
    'pr_application',
    'Permanent residence application form',
    '{
        "personal": ["full_name", "date_of_birth", "nationality", "marital_status"],
        "contact": ["email", "phone", "current_address", "permanent_address"],
        "immigration": ["entry_date", "current_status", "uci_number"],
        "family": ["spouse_details", "dependent_details"],
        "documents": ["passport", "proof_of_funds", "police_clearance", "medical_exam"]
    }'::jsonb
),
(
    'Super Visa Application',
    'super_visa',
    'Super visa application for parents and grandparents',
    '{
        "personal": ["full_name", "date_of_birth", "relationship_to_sponsor"],
        "sponsor": ["sponsor_name", "sponsor_income", "sponsor_address"],
        "documents": ["passport", "insurance_proof", "invitation_letter", "income_proof"]
    }'::jsonb
);