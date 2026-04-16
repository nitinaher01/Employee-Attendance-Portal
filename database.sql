-- 1. Create the Employees Table
CREATE TABLE Employees (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Create the Attendance Table
CREATE TABLE Attendance (
    id SERIAL PRIMARY KEY,
    employee_id INTEGER REFERENCES Employees(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    check_in_time TIMESTAMP NOT NULL,
    check_out_time TIMESTAMP,
    total_hours NUMERIC(5, 2),
    -- This constraint enforces the rule that an employee can only check in once per calendar day 
    UNIQUE(employee_id, date) 
);

-- 3. Create the Leaves Table
CREATE TABLE Leaves (
    id SERIAL PRIMARY KEY,
    employee_id INTEGER REFERENCES Employees(id) ON DELETE CASCADE,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    type VARCHAR(100) NOT NULL,
    reason TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Seed Initial Data 
-- Note: In a real app, passwords must be hashed (e.g., using bcrypt). 
-- For this seed data, I am assuming a plain text 'pass@321' is hashed before insertion.
INSERT INTO Employees (username, password_hash) 
VALUES ('nitin01', '$2b$10$g9GNWRh02R31IIoAcLr3BeodRPY1z9prXJec.rux8XmtyPWFfsLCm');
