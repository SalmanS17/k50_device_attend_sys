
-- Create employees table
CREATE TABLE public.employees (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  department TEXT NOT NULL,
  designation TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create attendance table
CREATE TABLE public.attendance (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  check_time TIMESTAMP WITH TIME ZONE NOT NULL,
  device TEXT NOT NULL DEFAULT 'K50',
  status TEXT NOT NULL DEFAULT 'on-time',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, check_time)
);

-- Create indexes for performance
CREATE INDEX idx_attendance_user_id ON public.attendance(user_id);
CREATE INDEX idx_attendance_check_time ON public.attendance(check_time);
CREATE INDEX idx_attendance_status ON public.attendance(status);

-- Enable RLS
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;

-- Public read access (attendance dashboard is viewable by all)
CREATE POLICY "Anyone can view employees" ON public.employees FOR SELECT USING (true);
CREATE POLICY "Anyone can view attendance" ON public.attendance FOR SELECT USING (true);

-- Only authenticated users (admins) can modify data
CREATE POLICY "Authenticated users can insert employees" ON public.employees FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update employees" ON public.employees FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete employees" ON public.employees FOR DELETE TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert attendance" ON public.attendance FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update attendance" ON public.attendance FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete attendance" ON public.attendance FOR DELETE TO authenticated USING (true);

-- Enable realtime for attendance
ALTER PUBLICATION supabase_realtime ADD TABLE public.attendance;

-- Seed employee data
INSERT INTO public.employees (user_id, name, department, designation) VALUES
  ('1', 'Ali Khan', 'Accounts', 'Senior Accountant'),
  ('2', 'Sara Ahmed', 'Engineering', 'Software Engineer'),
  ('3', 'Hassan Raza', 'HR', 'HR Manager'),
  ('4', 'Fatima Noor', 'Operations', 'Operations Lead'),
  ('5', 'Omar Sheikh', 'Marketing', 'Marketing Analyst'),
  ('6', 'Ayesha Malik', 'Engineering', 'Frontend Developer'),
  ('7', 'Bilal Tariq', 'Sales', 'Sales Executive'),
  ('8', 'Zainab Hussain', 'Accounts', 'Junior Accountant'),
  ('9', 'Usman Ghani', 'Engineering', 'Backend Developer'),
  ('10', 'Mariam Iqbal', 'HR', 'Recruiter'),
  ('11', 'Kamran Siddiqui', 'Operations', 'Logistics Coordinator'),
  ('12', 'Nadia Farooq', 'Marketing', 'Content Writer'),
  ('13', 'Tahir Abbas', 'Engineering', 'DevOps Engineer'),
  ('14', 'Sana Javed', 'Sales', 'Account Manager'),
  ('15', 'Rizwan Ali', 'Accounts', 'Finance Director');
