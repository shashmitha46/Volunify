-- Volunteer Platform Database Schema
-- This can be used with Supabase or any PostgreSQL database

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    skills TEXT[] DEFAULT '{}',
    interests TEXT[] DEFAULT '{}',
    location VARCHAR(255) DEFAULT '',
    phone VARCHAR(20) DEFAULT '',
    joined_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    profile_image TEXT DEFAULT '',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Services table
CREATE TABLE services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    location_lat DECIMAL(10, 8),
    location_lng DECIMAL(11, 8),
    location_address TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    volunteers_needed INTEGER DEFAULT 0,
    date DATE NOT NULL,
    time TIME NOT NULL,
    organizer VARCHAR(255) NOT NULL,
    requirements TEXT[] DEFAULT '{}',
    image TEXT DEFAULT '',
    created_by UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Messages table
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
    receiver_id UUID REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Volunteer registrations table (many-to-many relationship)
CREATE TABLE volunteer_registrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    service_id UUID REFERENCES services(id) ON DELETE CASCADE,
    registered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, service_id)
);

-- Indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_services_category ON services(category);
CREATE INDEX idx_services_date ON services(date);
CREATE INDEX idx_services_location ON services(location_lat, location_lng);
CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_messages_receiver ON messages(receiver_id);
CREATE INDEX idx_volunteer_registrations_user ON volunteer_registrations(user_id);
CREATE INDEX idx_volunteer_registrations_service ON volunteer_registrations(service_id);

-- Row Level Security (RLS) policies for Supabase
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE volunteer_registrations ENABLE ROW LEVEL SECURITY;

-- Users can read all profiles but only update their own
CREATE POLICY "Users can view all profiles" ON users
    FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON users
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Services are publicly readable, authenticated users can create
CREATE POLICY "Anyone can view services" ON services
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create services" ON services
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update own services" ON services
    FOR UPDATE USING (auth.uid() = created_by);

-- Messages are private between sender and receiver
CREATE POLICY "Users can view own messages" ON messages
    FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can send messages" ON messages
    FOR INSERT WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can update own sent messages" ON messages
    FOR UPDATE USING (auth.uid() = sender_id);

-- Volunteer registrations
CREATE POLICY "Users can view own registrations" ON volunteer_registrations
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own registrations" ON volunteer_registrations
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own registrations" ON volunteer_registrations
    FOR DELETE USING (auth.uid() = user_id);

-- Functions for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for automatic timestamp updates
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();