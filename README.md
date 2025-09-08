# Student Record Management System

A modern, responsive web dashboard for managing student records using Supabase as the backend. Easily add, view, search, update, and delete student records with a clean UI.

## Features
- Add new student (Name, Email, Course, ID)
- View all students
- Search for a student by ID
- Update student details (Name, Email, Course, ID)
- Delete a student’s record
- Dashboard quick stats (total/active students)
- Responsive design for desktop and mobile

## Technologies Used
- HTML, CSS, JavaScript (Vanilla)
- Supabase (PostgreSQL backend)
- Git & GitHub for version control

## Setup Instructions
1. **Clone the repository:**
   ```sh
   git clone https://github.com/danieldzansi/Student-Record-Management-system.git
   ```
2. **Configure Supabase:**
   - Create a Supabase project and table named `students` with columns:
     - `name` (text)
     - `email` (text)
     - `course` (text)
     - `student_id` (text, unique)
   - Copy your Supabase URL and anon key into `index.js`.
3. **Run locally:**
   - Open `index.html` in your browser.

## Usage
- Use the dashboard to add, view, search, update, and delete student records.
- All changes are synced with your Supabase backend.

## Responsive Design
- Works on desktop, tablet, and mobile.
- Tables scroll horizontally on small screens.

## Copyright
© Developed by Group 106

---
For questions or contributions, open an issue or pull request on GitHub.
