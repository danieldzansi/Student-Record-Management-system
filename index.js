// index.js
// Supabase project URL and anon key for your "file" project
const SUPABASE_URL = "https://gaxoyceabsilhwcrtbwc.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdheG95Y2VhYnNpbGh3Y3J0YndjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYzNzgxNDIsImV4cCI6MjA3MTk1NDE0Mn0.Zfvh-c37HuWEHehXiNyCVbzdR3fqaDkDWhPwvW3nfug";

let supabase;

// Section switching for dashboard (updated for new layout)
window.showSection = function(section) {
  document.getElementById('dashboard-section').style.display = section === 'dashboard' ? '' : 'none';
  document.getElementById('add-section').style.display = section === 'add' ? '' : 'none';
  document.getElementById('students-section').style.display = section === 'students' ? '' : 'none';
  document.getElementById('search-section').style.display = section === 'search' ? '' : 'none';
  
  if (section === 'students') loadStudents();
  if (section === 'add') loadStudentsAddSection();
  if (section === 'search') clearSearchTable();
  if (section === 'dashboard') loadDashboardStats();
};

// Load students for add-student section
window.loadStudentsAddSection = async function() {
  try {
    if (!supabase) {
      console.error('Supabase client not initialized');
      return;
    }
    const { data, error } = await supabase.from('students').select('*');
    if (error) throw error;
    renderTable(data, '#add-students-table tbody');
    updateDashboardStats(data);
  } catch (error) {
    console.error('Error loading students:', error);
    showError('Error loading students. Please try again.');
  }
};

// Bind the student form after it's loaded
window.bindStudentForm = function() {
  const form = document.getElementById('student-form');
  if (form) {
    form.onsubmit = async function(e) {
      e.preventDefault();
      await addStudent();
    };
  }
};

// Add student function
async function addStudent() {
  try {
    if (!supabase) {
      throw new Error('Supabase client not initialized');
    }
    
         const name = document.getElementById('name').value.trim();
     const email = document.getElementById('email').value.trim();
     const course = document.getElementById('course').value.trim();
     const id = document.getElementById('studentId').value.trim();
     
     // Basic validation
     if (!name || !email || !course || !id) {
       showError('Please fill in all fields');
       return;
     }
     
     // Email validation
     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
     if (!emailRegex.test(email)) {
       showError('Please enter a valid email address');
       return;
     }
     
     // Check if student ID already exists
     const { data: existingStudent } = await supabase
       .from('students')
       .select('student_id')
       .eq('student_id', id)
       .single();
     
     if (existingStudent) {
       showError('Student ID already exists! Please use a different ID.');
       return;
     }
    
         const { error } = await supabase.from('students').insert([{ name, email, course, student_id: id }]);
    if (error) throw error;
    
    // Reset form and show success
    document.getElementById('student-form').reset();
    showSuccess('Student added successfully!');
    
    // Refresh the students list
    loadStudentsAddSection();
    
    // Switch to students view
    showSection('students');
    loadStudents();
     } catch (error) {
     console.error('Error adding student:', error);
     
     // Better error messages
     if (error.code === '23505') {
       showError('Student ID already exists! Please use a different ID.');
     } else if (error.message) {
       showError(`Error: ${error.message}`);
     } else {
       showError('Error adding student. Please try again.');
     }
   }
}

function clearSearchTable() {
  const tbody = document.querySelector('#search-table tbody');
  if (tbody) tbody.innerHTML = '';
}

// Load Supabase client
const script = document.createElement('script');
script.src = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js";
document.head.appendChild(script);

script.onload = () => {
  try {
    supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    console.log('Supabase client initialized successfully');
    
    // Initial load: show dashboard
    showSection('dashboard');
  } catch (error) {
    console.error('Error initializing Supabase:', error);
    showError('Error initializing database connection');
  }
};

// Load all students
window.loadStudents = async function() {
  try {
    if (!supabase) {
      console.error('Supabase client not initialized');
      return;
    }
    const { data, error } = await supabase.from('students').select('*');
    if (error) throw error;
    renderTable(data, '#students-table tbody');
    updateDashboardStats(data);
  } catch (error) {
    console.error('Error loading students:', error);
    showError('Error loading students. Please try again.');
  }
};

// Load dashboard statistics
window.loadDashboardStats = async function() {
  try {
    if (!supabase) {
      console.error('Supabase client not initialized');
      return;
    }
    const { data, error } = await supabase.from('students').select('*');
    if (error) throw error;
    updateDashboardStats(data);
  } catch (error) {
    console.error('Error loading dashboard stats:', error);
  }
};

// Update dashboard statistics
function updateDashboardStats(students) {
  const totalStudents = document.getElementById('total-students');
  const activeStudents = document.getElementById('active-students');
  
  if (totalStudents && activeStudents) {
    const total = students ? students.length : 0;
    const active = students ? students.filter(s => s.email && s.email.trim() !== '').length : 0;
    
    totalStudents.textContent = total;
    activeStudents.textContent = active;
  }
}

// Search student by ID
window.searchStudent = async function() {
  try {
    if (!supabase) {
      console.error('Supabase client not initialized');
      return;
    }
    
    const id = document.getElementById('searchId').value.trim();
    if (!id) {
      showError('Please enter a student ID to search');
      return;
    }
    
         const { data, error } = await supabase.from('students').select('*').eq('student_id', id);
    if (error) throw error;
    
    if (data && data.length > 0) {
      renderTable(data, '#search-table tbody');
    } else {
      showError('No student found with that ID');
      clearSearchTable();
    }
  } catch (error) {
    console.error('Error searching student:', error);
    showError('Error searching for student. Please try again.');
  }
};

// Update student
window.updateStudent = async function(id) {
  try {
    if (!supabase) {
      console.error('Supabase client not initialized');
      return;
    }
    
    // Get current student data
    const { data: currentStudent } = await supabase
      .from('students')
      .select('*')
      .eq('student_id', id)
      .single();
    
    if (!currentStudent) {
      showError('Student not found');
      return;
    }
    
  // Prompt for new values (including ID)
  const newName = prompt('Enter new name:', currentStudent.name);
  if (newName === null) return; // cancel
    
  const newEmail = prompt('Enter new email:', currentStudent.email);
  if (newEmail === null) return;
    
  const newCourse = prompt('Enter new course:', currentStudent.course);
  if (newCourse === null) return;

  const newId = prompt('Enter new student ID:', currentStudent.student_id);
  if (newId === null) return;
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
      showError('Please enter a valid email address');
      return;
    }
    
    const trimmedId = newId.trim();
    if (!trimmedId) {
      showError('Student ID cannot be empty');
      return;
    }
    
    // If ID changed, ensure it's unique
    if (trimmedId !== id) {
      const { data: existing } = await supabase
        .from('students')
        .select('student_id')
        .eq('student_id', trimmedId)
        .maybeSingle();
      if (existing) {
        showError('That Student ID is already in use. Choose a different ID.');
        return;
      }
    }
    
    // Update the student
  const { error } = await supabase
      .from('students')
      .update({ 
    name: newName.trim(), 
    email: newEmail.trim(), 
    course: newCourse.trim(),
    student_id: trimmedId
      })
      .eq('student_id', id);
    
    if (error) throw error;
    
  showSuccess('Student updated successfully!');
    loadStudents();
    loadStudentsAddSection();
  } catch (error) {
    console.error('Error updating student:', error);
    showError('Error updating student. Please try again.');
  }
};

// Delete student
window.deleteStudent = async function(id) {
  try {
    if (!supabase) {
      console.error('Supabase client not initialized');
      return;
    }
    
    if (!confirm('Are you sure you want to delete this student?')) return;
    
         const { error } = await supabase.from('students').delete().eq('student_id', id);
    if (error) throw error;
    
    showSuccess('Student deleted successfully!');
    loadStudents();
    loadStudentsAddSection();
  } catch (error) {
    console.error('Error deleting student:', error);
    showError('Error deleting student. Please try again.');
  }
};

// Render table (for both all and search)
function renderTable(students, selector) {
  const tbody = document.querySelector(selector);
  if (!tbody) return;
  
  tbody.innerHTML = '';
  
     if (!students || students.length === 0) {
     tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: #666; padding: 2rem;">No students found</td></tr>';
     return;
   }
  
     students.forEach(s => {
     const row = document.createElement('tr');
     row.innerHTML = `
       <td>${escapeHtml(s.name)}</td>
       <td>${escapeHtml(s.email)}</td>
       <td>${escapeHtml(s.course)}</td>
       <td>${escapeHtml(s.student_id)}</td>
       <td>
         <button onclick="updateStudent('${escapeHtml(s.student_id)}')" class="btn-update">Update</button>
         <button onclick="deleteStudent('${escapeHtml(s.student_id)}')" class="btn-delete">Delete</button>
       </td>
     `;
     tbody.appendChild(row);
   });
}

// Utility functions
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function showError(message) {
  alert(`Error: ${message}`);
}

function showSuccess(message) {
  alert(`Success: ${message}`);
}
