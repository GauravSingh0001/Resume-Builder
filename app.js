// Global State
const state = {
  resumeData: {},
  activeTemplate: 'modern',
  theme: 'light',
  lastSaved: null,
  atsScore: 0,
  autoSaveTimeout: null
};

// Dummy Data
const dummyData = {
  personalInfo: {
    name: "Sarah Chen",
    email: "sarah.chen@email.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    linkedin: "linkedin.com/in/sarahchen",
    portfolio: "sarahchen.dev"
  },
  summary: "Full-stack developer with 5+ years of experience building scalable web applications using modern JavaScript frameworks. Specialized in React, Node.js, and cloud infrastructure. Passionate about creating efficient, user-friendly solutions and mentoring junior developers.",
  education: [
    {
      degree: "B.S. in Computer Science",
      school: "Stanford University",
      location: "Stanford, CA",
      graduationDate: "2019",
      gpa: "3.8"
    }
  ],
  experience: [
    {
      title: "Senior Software Engineer",
      company: "TechCorp Inc.",
      location: "San Francisco, CA",
      startDate: "2021-03",
      endDate: "Present",
      current: true,
      description: "• Led development of microservices architecture serving 2M+ users daily\n• Improved API response time by 40% through database optimization and caching strategies\n• Mentored team of 3 junior developers and conducted code reviews\n• Implemented CI/CD pipeline reducing deployment time by 60%"
    },
    {
      title: "Software Engineer",
      company: "StartupXYZ",
      location: "San Francisco, CA",
      startDate: "2019-06",
      endDate: "2021-02",
      current: false,
      description: "• Developed responsive web applications using React and Redux\n• Built RESTful APIs with Node.js and Express serving 100K+ requests/day\n• Collaborated with design team to implement pixel-perfect UI components\n• Reduced page load time by 50% through performance optimization"
    }
  ],
  technicalSkills: "JavaScript (ES6+), React & Redux, Node.js & Express, Python & Django, PostgreSQL & MongoDB, AWS (EC2, S3, Lambda), Docker & Kubernetes, Git & GitHub, REST APIs & GraphQL, HTML5 & CSS3",
  softSkills: "Team Leadership, Problem Solving, Communication, Agile/Scrum, Project Management, Mentoring",
  projects: [
    {
      name: "E-commerce Platform",
      description: "Built full-stack e-commerce solution with shopping cart, payment integration, and admin dashboard. Handled 10K+ monthly transactions.",
      technologies: "React, Node.js, MongoDB, Stripe API",
      link: "github.com/sarahchen/ecommerce"
    },
    {
      name: "Real-time Chat Application",
      description: "Developed real-time messaging app with WebSocket support, user authentication, and message persistence. Supports 1000+ concurrent users.",
      technologies: "React, Socket.io, Redis, PostgreSQL",
      link: "github.com/sarahchen/chat-app"
    }
  ],
  certifications: [
    {
      name: "AWS Solutions Architect Associate",
      issuer: "Amazon Web Services",
      date: "2023"
    },
    {
      name: "MongoDB Certified Developer",
      issuer: "MongoDB University",
      date: "2022"
    }
  ]
};

// Action verbs for ATS scoring
const actionVerbs = [
  "Led", "Developed", "Implemented", "Improved", "Built", "Designed",
  "Managed", "Created", "Optimized", "Achieved", "Collaborated",
  "Mentored", "Reduced", "Increased"
];

// Initialize App
function initApp() {
  // Load theme from memory or default to light
  const savedTheme = localStorage.getItem('rbp_theme') || state.theme || 'light';
  applyTheme(savedTheme);
  
  // Load dummy data on first visit
  loadDummyData();
  
  // Setup event listeners
  setupEventListeners();
  
  // Update preview
  updatePreview();
  
  // Calculate initial ATS score
  calculateATSScore();
}

// Load Dummy Data
function loadDummyData() {
  state.resumeData = JSON.parse(JSON.stringify(dummyData));
  populateForm();
}

// Populate Form with Data
function populateForm() {
  const data = state.resumeData;
  
  // Personal Info
  document.getElementById('name').value = data.personalInfo?.name || '';
  document.getElementById('email').value = data.personalInfo?.email || '';
  document.getElementById('phone').value = data.personalInfo?.phone || '';
  document.getElementById('location').value = data.personalInfo?.location || '';
  document.getElementById('linkedin').value = data.personalInfo?.linkedin || '';
  document.getElementById('portfolio').value = data.personalInfo?.portfolio || '';
  
  // Summary
  document.getElementById('summary').value = data.summary || '';
  updateCharCount('summary');
  
  // Skills
  document.getElementById('technical-skills').value = data.technicalSkills || '';
  document.getElementById('soft-skills').value = data.softSkills || '';
  
  // Education
  const educationList = document.getElementById('education-list');
  educationList.innerHTML = '';
  if (data.education && data.education.length > 0) {
    data.education.forEach((edu, index) => {
      addEducationEntry(edu, index);
    });
  }
  
  // Experience
  const experienceList = document.getElementById('experience-list');
  experienceList.innerHTML = '';
  if (data.experience && data.experience.length > 0) {
    data.experience.forEach((exp, index) => {
      addExperienceEntry(exp, index);
    });
  }
  
  // Projects
  const projectsList = document.getElementById('projects-list');
  projectsList.innerHTML = '';
  if (data.projects && data.projects.length > 0) {
    data.projects.forEach((proj, index) => {
      addProjectEntry(proj, index);
    });
  }
  
  // Certifications
  const certsList = document.getElementById('certifications-list');
  certsList.innerHTML = '';
  if (data.certifications && data.certifications.length > 0) {
    data.certifications.forEach((cert, index) => {
      addCertificationEntry(cert, index);
    });
  }
}

// Add Education Entry
function addEducationEntry(data = {}, index = null) {
  const list = document.getElementById('education-list');
  const id = index !== null ? index : Date.now();
  
  const entry = document.createElement('div');
  entry.className = 'entry-card';
  entry.dataset.id = id;
  entry.innerHTML = `
    <div class="entry-header">
      <span class="entry-title">Education ${list.children.length + 1}</span>
      <button type="button" class="btn-remove" onclick="removeEntry('education', ${id})" aria-label="Remove education">✕</button>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">Degree</label>
        <input type="text" class="form-control" data-field="degree" value="${data.degree || ''}" placeholder="e.g., B.S. in Computer Science">
      </div>
      <div class="form-group">
        <label class="form-label">School</label>
        <input type="text" class="form-control" data-field="school" value="${data.school || ''}" placeholder="e.g., Stanford University">
      </div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">Location</label>
        <input type="text" class="form-control" data-field="location" value="${data.location || ''}" placeholder="e.g., Stanford, CA">
      </div>
      <div class="form-group">
        <label class="form-label">Graduation Date</label>
        <input type="text" class="form-control" data-field="graduationDate" value="${data.graduationDate || ''}" placeholder="e.g., 2019">
      </div>
    </div>
    <div class="form-group">
      <label class="form-label">GPA (optional)</label>
      <input type="text" class="form-control" data-field="gpa" value="${data.gpa || ''}" placeholder="e.g., 3.8">
    </div>
  `;
  
  list.appendChild(entry);
  attachInputListeners(entry);
}

// Add Experience Entry
function addExperienceEntry(data = {}, index = null) {
  const list = document.getElementById('experience-list');
  const id = index !== null ? index : Date.now();
  
  const entry = document.createElement('div');
  entry.className = 'entry-card';
  entry.dataset.id = id;
  entry.innerHTML = `
    <div class="entry-header">
      <span class="entry-title">Experience ${list.children.length + 1}</span>
      <button type="button" class="btn-remove" onclick="removeEntry('experience', ${id})" aria-label="Remove experience">✕</button>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">Job Title</label>
        <input type="text" class="form-control" data-field="title" value="${data.title || ''}" placeholder="e.g., Senior Software Engineer">
      </div>
      <div class="form-group">
        <label class="form-label">Company</label>
        <input type="text" class="form-control" data-field="company" value="${data.company || ''}" placeholder="e.g., TechCorp Inc.">
      </div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">Location</label>
        <input type="text" class="form-control" data-field="location" value="${data.location || ''}" placeholder="e.g., San Francisco, CA">
      </div>
      <div class="form-group">
        <label class="form-label">Start Date</label>
        <input type="month" class="form-control" data-field="startDate" value="${data.startDate || ''}">
      </div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">End Date</label>
        <input type="month" class="form-control" data-field="endDate" value="${data.current ? '' : data.endDate || ''}" ${data.current ? 'disabled' : ''}>
      </div>
      <div class="form-group">
        <label class="form-label" style="display: flex; align-items: center; gap: 8px;">
          <input type="checkbox" data-field="current" ${data.current ? 'checked' : ''} onchange="toggleCurrentJob(this)">
          Currently working here
        </label>
      </div>
    </div>
    <div class="form-group">
      <label class="form-label">Description (use bullet points)</label>
      <textarea class="form-control" data-field="description" rows="4" placeholder="• Led development of...\n• Improved performance by...\n• Mentored team of...">${data.description || ''}</textarea>
    </div>
  `;
  
  list.appendChild(entry);
  attachInputListeners(entry);
}

// Add Project Entry
function addProjectEntry(data = {}, index = null) {
  const list = document.getElementById('projects-list');
  const id = index !== null ? index : Date.now();
  
  const entry = document.createElement('div');
  entry.className = 'entry-card';
  entry.dataset.id = id;
  entry.innerHTML = `
    <div class="entry-header">
      <span class="entry-title">Project ${list.children.length + 1}</span>
      <button type="button" class="btn-remove" onclick="removeEntry('projects', ${id})" aria-label="Remove project">✕</button>
    </div>
    <div class="form-group">
      <label class="form-label">Project Name</label>
      <input type="text" class="form-control" data-field="name" value="${data.name || ''}" placeholder="e.g., E-commerce Platform">
    </div>
    <div class="form-group">
      <label class="form-label">Description</label>
      <textarea class="form-control" data-field="description" rows="3" placeholder="Brief description of the project...">${data.description || ''}</textarea>
    </div>
    <div class="form-group">
      <label class="form-label">Technologies</label>
      <input type="text" class="form-control" data-field="technologies" value="${data.technologies || ''}" placeholder="e.g., React, Node.js, MongoDB">
    </div>
    <div class="form-group">
      <label class="form-label">Link (optional)</label>
      <input type="url" class="form-control" data-field="link" value="${data.link || ''}" placeholder="e.g., github.com/user/project">
    </div>
  `;
  
  list.appendChild(entry);
  attachInputListeners(entry);
}

// Add Certification Entry
function addCertificationEntry(data = {}, index = null) {
  const list = document.getElementById('certifications-list');
  const id = index !== null ? index : Date.now();
  
  const entry = document.createElement('div');
  entry.className = 'entry-card';
  entry.dataset.id = id;
  entry.innerHTML = `
    <div class="entry-header">
      <span class="entry-title">Certification ${list.children.length + 1}</span>
      <button type="button" class="btn-remove" onclick="removeEntry('certifications', ${id})" aria-label="Remove certification">✕</button>
    </div>
    <div class="form-group">
      <label class="form-label">Certification Name</label>
      <input type="text" class="form-control" data-field="name" value="${data.name || ''}" placeholder="e.g., AWS Solutions Architect">
    </div>
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">Issuing Organization</label>
        <input type="text" class="form-control" data-field="issuer" value="${data.issuer || ''}" placeholder="e.g., Amazon Web Services">
      </div>
      <div class="form-group">
        <label class="form-label">Date</label>
        <input type="text" class="form-control" data-field="date" value="${data.date || ''}" placeholder="e.g., 2023">
      </div>
    </div>
  `;
  
  list.appendChild(entry);
  attachInputListeners(entry);
}

// Remove Entry
function removeEntry(type, id) {
  const listId = `${type}-list`;
  const list = document.getElementById(listId);
  const entry = list.querySelector(`[data-id="${id}"]`);
  if (entry) {
    entry.remove();
    collectFormData();
    updatePreview();
    calculateATSScore();
    triggerAutoSave();
  }
}

// Toggle Current Job
function toggleCurrentJob(checkbox) {
  const card = checkbox.closest('.entry-card');
  const endDateInput = card.querySelector('[data-field="endDate"]');
  if (checkbox.checked) {
    endDateInput.value = 'Present';
    endDateInput.disabled = true;
  } else {
    endDateInput.value = '';
    endDateInput.disabled = false;
  }
  collectFormData();
  updatePreview();
  triggerAutoSave();
}

// Attach Input Listeners
function attachInputListeners(element) {
  const inputs = element.querySelectorAll('input, textarea, select');
  inputs.forEach(input => {
    input.addEventListener('input', () => {
      collectFormData();
      updatePreview();
      calculateATSScore();
      triggerAutoSave();
    });
    
    input.addEventListener('focus', () => {
      const section = input.closest('.form-section-block');
      if (section) {
        document.querySelectorAll('.form-section-block').forEach(s => s.classList.remove('active'));
        section.classList.add('active');
        section.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });
  });
}

// Collect Form Data
function collectFormData() {
  const data = {
    personalInfo: {
      name: document.getElementById('name').value,
      email: document.getElementById('email').value,
      phone: document.getElementById('phone').value,
      location: document.getElementById('location').value,
      linkedin: document.getElementById('linkedin').value,
      portfolio: document.getElementById('portfolio').value
    },
    summary: document.getElementById('summary').value,
    technicalSkills: document.getElementById('technical-skills').value,
    softSkills: document.getElementById('soft-skills').value,
    education: [],
    experience: [],
    projects: [],
    certifications: []
  };
  
  // Collect Education
  document.querySelectorAll('#education-list .entry-card').forEach(card => {
    const edu = {};
    card.querySelectorAll('[data-field]').forEach(input => {
      edu[input.dataset.field] = input.value;
    });
    data.education.push(edu);
  });
  
  // Collect Experience
  document.querySelectorAll('#experience-list .entry-card').forEach(card => {
    const exp = {};
    card.querySelectorAll('[data-field]').forEach(input => {
      if (input.type === 'checkbox') {
        exp[input.dataset.field] = input.checked;
      } else {
        exp[input.dataset.field] = input.value;
      }
    });
    data.experience.push(exp);
  });
  
  // Collect Projects
  document.querySelectorAll('#projects-list .entry-card').forEach(card => {
    const proj = {};
    card.querySelectorAll('[data-field]').forEach(input => {
      proj[input.dataset.field] = input.value;
    });
    data.projects.push(proj);
  });
  
  // Collect Certifications
  document.querySelectorAll('#certifications-list .entry-card').forEach(card => {
    const cert = {};
    card.querySelectorAll('[data-field]').forEach(input => {
      cert[input.dataset.field] = input.value;
    });
    data.certifications.push(cert);
  });
  
  state.resumeData = data;
}

// Update Character Count
function updateCharCount(id) {
  const textarea = document.getElementById(id);
  const counter = document.getElementById(`${id}-count`);
  if (textarea && counter) {
    const count = textarea.value.length;
    counter.textContent = `${count} / 500`;
  }
}

// Update Preview
function updatePreview() {
  const preview = document.getElementById('resume-preview');
  const data = state.resumeData;
  const template = state.activeTemplate;
  
  let html = '';
  
  if (template === 'modern') {
    html = generateModernTemplate(data);
  } else if (template === 'professional') {
    html = generateProfessionalTemplate(data);
  } else if (template === 'minimal') {
    html = generateMinimalTemplate(data);
  } else if (template === 'creative') {
    html = generateCreativeTemplate(data);
  } else if (template === 'classic') {
    html = generateClassicTemplate(data);
  }
  
  preview.innerHTML = html;
}

// Generate Modern Template
function generateModernTemplate(data) {
  return `
    <div class="resume-sidebar">
      <div class="resume-header">
        <h1 class="resume-name">${data.personalInfo?.name || 'Your Name'}</h1>
        <div class="resume-contact">
          ${data.personalInfo?.email ? `<div class="resume-contact-item">📧 ${data.personalInfo.email}</div>` : ''}
          ${data.personalInfo?.phone ? `<div class="resume-contact-item">📱 ${data.personalInfo.phone}</div>` : ''}
          ${data.personalInfo?.location ? `<div class="resume-contact-item">📍 ${data.personalInfo.location}</div>` : ''}
          ${data.personalInfo?.linkedin ? `<div class="resume-contact-item">🔗 ${data.personalInfo.linkedin}</div>` : ''}
          ${data.personalInfo?.portfolio ? `<div class="resume-contact-item">🌐 ${data.personalInfo.portfolio}</div>` : ''}
        </div>
      </div>
      
      ${data.technicalSkills || data.softSkills ? `
      <div class="resume-section">
        <h2 class="resume-section-title">Skills</h2>
        ${data.technicalSkills ? `
        <div style="margin-bottom: 12px;">
          <div style="font-weight: 600; margin-bottom: 6px; font-size: 10px;">Technical</div>
          <div class="resume-skills">
            ${data.technicalSkills.split(',').map(s => `<span class="resume-skill">${s.trim()}</span>`).join('')}
          </div>
        </div>
        ` : ''}
        ${data.softSkills ? `
        <div>
          <div style="font-weight: 600; margin-bottom: 6px; font-size: 10px;">Soft Skills</div>
          <div class="resume-skills">
            ${data.softSkills.split(',').map(s => `<span class="resume-skill">${s.trim()}</span>`).join('')}
          </div>
        </div>
        ` : ''}
      </div>
      ` : ''}
      
      ${data.certifications && data.certifications.length > 0 && data.certifications[0].name ? `
      <div class="resume-section">
        <h2 class="resume-section-title">Certifications</h2>
        ${data.certifications.map(cert => cert.name ? `
        <div class="resume-entry">
          <div class="resume-entry-title">${cert.name}</div>
          <div class="resume-entry-company">${cert.issuer || ''}</div>
          <div class="resume-entry-date">${cert.date || ''}</div>
        </div>
        ` : '').join('')}
      </div>
      ` : ''}
    </div>
    
    <div class="resume-main">
      ${data.summary ? `
      <div class="resume-section">
        <h2 class="resume-section-title">Professional Summary</h2>
        <div class="resume-summary">${data.summary}</div>
      </div>
      ` : ''}
      
      ${data.experience && data.experience.length > 0 && data.experience[0].title ? `
      <div class="resume-section">
        <h2 class="resume-section-title">Experience</h2>
        ${data.experience.map(exp => exp.title ? `
        <div class="resume-entry">
          <div class="resume-entry-header">
            <div>
              <div class="resume-entry-title">${exp.title}</div>
              <div class="resume-entry-company">${exp.company || ''}</div>
            </div>
            <div style="text-align: right;">
              <div class="resume-entry-date">${exp.startDate || ''} - ${exp.current ? 'Present' : exp.endDate || ''}</div>
              <div class="resume-entry-location">${exp.location || ''}</div>
            </div>
          </div>
          ${exp.description ? `<div class="resume-entry-description">${exp.description}</div>` : ''}
        </div>
        ` : '').join('')}
      </div>
      ` : ''}
      
      ${data.education && data.education.length > 0 && data.education[0].degree ? `
      <div class="resume-section">
        <h2 class="resume-section-title">Education</h2>
        ${data.education.map(edu => edu.degree ? `
        <div class="resume-entry">
          <div class="resume-entry-header">
            <div>
              <div class="resume-entry-title">${edu.degree}</div>
              <div class="resume-entry-company">${edu.school || ''}</div>
            </div>
            <div style="text-align: right;">
              <div class="resume-entry-date">${edu.graduationDate || ''}</div>
              <div class="resume-entry-location">${edu.location || ''}</div>
            </div>
          </div>
          ${edu.gpa ? `<div style="font-size: 10px; color: #666;">GPA: ${edu.gpa}</div>` : ''}
        </div>
        ` : '').join('')}
      </div>
      ` : ''}
      
      ${data.projects && data.projects.length > 0 && data.projects[0].name ? `
      <div class="resume-section">
        <h2 class="resume-section-title">Projects</h2>
        ${data.projects.map(proj => proj.name ? `
        <div class="resume-entry">
          <div class="resume-entry-title">${proj.name}</div>
          ${proj.description ? `<div class="resume-entry-description">${proj.description}</div>` : ''}
          ${proj.technologies ? `<div style="font-size: 9px; color: #666; margin-top: 4px;"><strong>Technologies:</strong> ${proj.technologies}</div>` : ''}
          ${proj.link ? `<div style="font-size: 9px; color: #21808d; margin-top: 2px;">${proj.link}</div>` : ''}
        </div>
        ` : '').join('')}
      </div>
      ` : ''}
    </div>
  `;
}

// Generate Professional Template
function generateProfessionalTemplate(data) {
  return `
    <div class="resume-header">
      <h1 class="resume-name">${data.personalInfo?.name || 'Your Name'}</h1>
      <div class="resume-contact">
        ${data.personalInfo?.email ? `<div class="resume-contact-item">${data.personalInfo.email}</div>` : ''}
        ${data.personalInfo?.phone ? `<div class="resume-contact-item">${data.personalInfo.phone}</div>` : ''}
        ${data.personalInfo?.location ? `<div class="resume-contact-item">${data.personalInfo.location}</div>` : ''}
        ${data.personalInfo?.linkedin ? `<div class="resume-contact-item">${data.personalInfo.linkedin}</div>` : ''}
        ${data.personalInfo?.portfolio ? `<div class="resume-contact-item">${data.personalInfo.portfolio}</div>` : ''}
      </div>
    </div>
    
    ${data.summary ? `
    <div class="resume-section">
      <h2 class="resume-section-title">Professional Summary</h2>
      <div class="resume-summary">${data.summary}</div>
    </div>
    ` : ''}
    
    ${data.experience && data.experience.length > 0 && data.experience[0].title ? `
    <div class="resume-section">
      <h2 class="resume-section-title">Professional Experience</h2>
      ${data.experience.map(exp => exp.title ? `
      <div class="resume-entry">
        <div class="resume-entry-header">
          <div>
            <div class="resume-entry-title">${exp.title}</div>
            <div class="resume-entry-company">${exp.company || ''}</div>
          </div>
          <div style="text-align: right;">
            <div class="resume-entry-date">${exp.startDate || ''} - ${exp.current ? 'Present' : exp.endDate || ''}</div>
            <div class="resume-entry-location">${exp.location || ''}</div>
          </div>
        </div>
        ${exp.description ? `<div class="resume-entry-description">${exp.description}</div>` : ''}
      </div>
      ` : '').join('')}
    </div>
    ` : ''}
    
    ${data.education && data.education.length > 0 && data.education[0].degree ? `
    <div class="resume-section">
      <h2 class="resume-section-title">Education</h2>
      ${data.education.map(edu => edu.degree ? `
      <div class="resume-entry">
        <div class="resume-entry-header">
          <div>
            <div class="resume-entry-title">${edu.degree}</div>
            <div class="resume-entry-company">${edu.school || ''}</div>
          </div>
          <div style="text-align: right;">
            <div class="resume-entry-date">${edu.graduationDate || ''}</div>
            <div class="resume-entry-location">${edu.location || ''}</div>
          </div>
        </div>
        ${edu.gpa ? `<div style="font-size: 10px; color: #666;">GPA: ${edu.gpa}</div>` : ''}
      </div>
      ` : '').join('')}
    </div>
    ` : ''}
    
    ${data.technicalSkills || data.softSkills ? `
    <div class="resume-section">
      <h2 class="resume-section-title">Skills</h2>
      ${data.technicalSkills ? `<div style="margin-bottom: 8px;"><strong style="font-size: 10px;">Technical:</strong> ${data.technicalSkills}</div>` : ''}
      ${data.softSkills ? `<div><strong style="font-size: 10px;">Soft Skills:</strong> ${data.softSkills}</div>` : ''}
    </div>
    ` : ''}
    
    ${data.projects && data.projects.length > 0 && data.projects[0].name ? `
    <div class="resume-section">
      <h2 class="resume-section-title">Projects</h2>
      ${data.projects.map(proj => proj.name ? `
      <div class="resume-entry">
        <div class="resume-entry-title">${proj.name}</div>
        ${proj.description ? `<div class="resume-entry-description">${proj.description}</div>` : ''}
        ${proj.technologies ? `<div style="font-size: 9px; color: #666; margin-top: 4px;"><strong>Technologies:</strong> ${proj.technologies}</div>` : ''}
        ${proj.link ? `<div style="font-size: 9px; color: #1e3a8a; margin-top: 2px;">${proj.link}</div>` : ''}
      </div>
      ` : '').join('')}
    </div>
    ` : ''}
    
    ${data.certifications && data.certifications.length > 0 && data.certifications[0].name ? `
    <div class="resume-section">
      <h2 class="resume-section-title">Certifications</h2>
      ${data.certifications.map(cert => cert.name ? `
      <div class="resume-entry">
        <div class="resume-entry-title">${cert.name}</div>
        <div class="resume-entry-company">${cert.issuer || ''} • ${cert.date || ''}</div>
      </div>
      ` : '').join('')}
    </div>
    ` : ''}
  `;
}

// Generate Minimal Template
function generateMinimalTemplate(data) {
  return `
    <div class="resume-header">
      <h1 class="resume-name">${data.personalInfo?.name || 'Your Name'}</h1>
      <div class="resume-contact">
        ${data.personalInfo?.email ? `<span>${data.personalInfo.email}</span>` : ''}
        ${data.personalInfo?.phone ? `<span>${data.personalInfo.phone}</span>` : ''}
        ${data.personalInfo?.location ? `<span>${data.personalInfo.location}</span>` : ''}
        ${data.personalInfo?.linkedin ? `<span>${data.personalInfo.linkedin}</span>` : ''}
        ${data.personalInfo?.portfolio ? `<span>${data.personalInfo.portfolio}</span>` : ''}
      </div>
    </div>
    
    ${data.summary ? `
    <div class="resume-section">
      <h2 class="resume-section-title">Summary</h2>
      <div class="resume-summary">${data.summary}</div>
    </div>
    ` : ''}
    
    ${data.experience && data.experience.length > 0 && data.experience[0].title ? `
    <div class="resume-section">
      <h2 class="resume-section-title">Experience</h2>
      ${data.experience.map(exp => exp.title ? `
      <div class="resume-entry">
        <div class="resume-entry-header">
          <div>
            <div class="resume-entry-title">${exp.title}</div>
            <div class="resume-entry-company">${exp.company || ''}</div>
          </div>
          <div style="text-align: right;">
            <div class="resume-entry-date">${exp.startDate || ''} - ${exp.current ? 'Present' : exp.endDate || ''}</div>
            <div class="resume-entry-location">${exp.location || ''}</div>
          </div>
        </div>
        ${exp.description ? `<div class="resume-entry-description">${exp.description}</div>` : ''}
      </div>
      ` : '').join('')}
    </div>
    ` : ''}
    
    ${data.education && data.education.length > 0 && data.education[0].degree ? `
    <div class="resume-section">
      <h2 class="resume-section-title">Education</h2>
      ${data.education.map(edu => edu.degree ? `
      <div class="resume-entry">
        <div class="resume-entry-header">
          <div>
            <div class="resume-entry-title">${edu.degree}</div>
            <div class="resume-entry-company">${edu.school || ''}</div>
          </div>
          <div style="text-align: right;">
            <div class="resume-entry-date">${edu.graduationDate || ''}</div>
            <div class="resume-entry-location">${edu.location || ''}</div>
          </div>
        </div>
        ${edu.gpa ? `<div style="font-size: 10px; color: #666;">GPA: ${edu.gpa}</div>` : ''}
      </div>
      ` : '').join('')}
    </div>
    ` : ''}
    
    ${data.technicalSkills || data.softSkills ? `
    <div class="resume-section">
      <h2 class="resume-section-title">Skills</h2>
      ${data.technicalSkills ? `<div style="margin-bottom: 8px;">${data.technicalSkills}</div>` : ''}
      ${data.softSkills ? `<div>${data.softSkills}</div>` : ''}
    </div>
    ` : ''}
    
    ${data.projects && data.projects.length > 0 && data.projects[0].name ? `
    <div class="resume-section">
      <h2 class="resume-section-title">Projects</h2>
      ${data.projects.map(proj => proj.name ? `
      <div class="resume-entry">
        <div class="resume-entry-title">${proj.name}</div>
        ${proj.description ? `<div class="resume-entry-description">${proj.description}</div>` : ''}
        ${proj.technologies ? `<div style="font-size: 9px; color: #666; margin-top: 4px;">${proj.technologies}</div>` : ''}
        ${proj.link ? `<div style="font-size: 9px; margin-top: 2px;">${proj.link}</div>` : ''}
      </div>
      ` : '').join('')}
    </div>
    ` : ''}
    
    ${data.certifications && data.certifications.length > 0 && data.certifications[0].name ? `
    <div class="resume-section">
      <h2 class="resume-section-title">Certifications</h2>
      ${data.certifications.map(cert => cert.name ? `
      <div class="resume-entry">
        <div class="resume-entry-title">${cert.name}</div>
        <div class="resume-entry-company">${cert.issuer || ''} • ${cert.date || ''}</div>
      </div>
      ` : '').join('')}
    </div>
    ` : ''}
  `;
}

// Generate Creative Template
function generateCreativeTemplate(data) {
  return `
    <div class="resume-header">
      <h1 class="resume-name">${data.personalInfo?.name || 'Your Name'}</h1>
      <div class="resume-contact">
        ${data.personalInfo?.email ? `<div class="resume-contact-item">${data.personalInfo.email}</div>` : ''}
        ${data.personalInfo?.phone ? `<div class="resume-contact-item">${data.personalInfo.phone}</div>` : ''}
        ${data.personalInfo?.location ? `<div class="resume-contact-item">${data.personalInfo.location}</div>` : ''}
        ${data.personalInfo?.linkedin ? `<div class="resume-contact-item">${data.personalInfo.linkedin}</div>` : ''}
        ${data.personalInfo?.portfolio ? `<div class="resume-contact-item">${data.personalInfo.portfolio}</div>` : ''}
      </div>
    </div>
    
    ${data.summary ? `
    <div class="resume-section">
      <h2 class="resume-section-title">About Me</h2>
      <div class="resume-summary">${data.summary}</div>
    </div>
    ` : ''}
    
    ${data.experience && data.experience.length > 0 && data.experience[0].title ? `
    <div class="resume-section">
      <h2 class="resume-section-title">Work Experience</h2>
      ${data.experience.map(exp => exp.title ? `
      <div class="resume-entry">
        <div class="resume-entry-header">
          <div>
            <div class="resume-entry-title">${exp.title}</div>
            <div class="resume-entry-company">${exp.company || ''}</div>
          </div>
          <div style="text-align: right;">
            <div class="resume-entry-date">${exp.startDate || ''} - ${exp.current ? 'Present' : exp.endDate || ''}</div>
            <div class="resume-entry-location">${exp.location || ''}</div>
          </div>
        </div>
        ${exp.description ? `<div class="resume-entry-description">${exp.description}</div>` : ''}
      </div>
      ` : '').join('')}
    </div>
    ` : ''}
    
    ${data.education && data.education.length > 0 && data.education[0].degree ? `
    <div class="resume-section">
      <h2 class="resume-section-title">Education</h2>
      ${data.education.map(edu => edu.degree ? `
      <div class="resume-entry">
        <div class="resume-entry-header">
          <div>
            <div class="resume-entry-title">${edu.degree}</div>
            <div class="resume-entry-company">${edu.school || ''}</div>
          </div>
          <div style="text-align: right;">
            <div class="resume-entry-date">${edu.graduationDate || ''}</div>
            <div class="resume-entry-location">${edu.location || ''}</div>
          </div>
        </div>
        ${edu.gpa ? `<div style="font-size: 10px; color: #666;">GPA: ${edu.gpa}</div>` : ''}
      </div>
      ` : '').join('')}
    </div>
    ` : ''}
    
    ${data.technicalSkills || data.softSkills ? `
    <div class="resume-section">
      <h2 class="resume-section-title">Skills & Expertise</h2>
      ${data.technicalSkills ? `
      <div style="margin-bottom: 12px;">
        <div style="font-weight: 600; margin-bottom: 6px; font-size: 10px;">Technical Skills</div>
        <div class="resume-skills">
          ${data.technicalSkills.split(',').map(s => `<span class="resume-skill">${s.trim()}</span>`).join('')}
        </div>
      </div>
      ` : ''}
      ${data.softSkills ? `
      <div>
        <div style="font-weight: 600; margin-bottom: 6px; font-size: 10px;">Soft Skills</div>
        <div class="resume-skills">
          ${data.softSkills.split(',').map(s => `<span class="resume-skill">${s.trim()}</span>`).join('')}
        </div>
      </div>
      ` : ''}
    </div>
    ` : ''}
    
    ${data.projects && data.projects.length > 0 && data.projects[0].name ? `
    <div class="resume-section">
      <h2 class="resume-section-title">Featured Projects</h2>
      ${data.projects.map(proj => proj.name ? `
      <div class="resume-entry">
        <div class="resume-entry-title">${proj.name}</div>
        ${proj.description ? `<div class="resume-entry-description">${proj.description}</div>` : ''}
        ${proj.technologies ? `<div style="font-size: 9px; color: #666; margin-top: 4px;"><strong>Tech Stack:</strong> ${proj.technologies}</div>` : ''}
        ${proj.link ? `<div style="font-size: 9px; color: #7c3aed; margin-top: 2px;">${proj.link}</div>` : ''}
      </div>
      ` : '').join('')}
    </div>
    ` : ''}
    
    ${data.certifications && data.certifications.length > 0 && data.certifications[0].name ? `
    <div class="resume-section">
      <h2 class="resume-section-title">Certifications</h2>
      ${data.certifications.map(cert => cert.name ? `
      <div class="resume-entry">
        <div class="resume-entry-title">${cert.name}</div>
        <div class="resume-entry-company">${cert.issuer || ''} • ${cert.date || ''}</div>
      </div>
      ` : '').join('')}
    </div>
    ` : ''}
  `;
}

// Generate Classic Template
function generateClassicTemplate(data) {
  
  // Helper to convert bullet points in description to an HTML list
  const formatDescription = (desc) => {
    if (!desc) return '';
    // Split by newlines, remove the bullet '•', trim, and filter empty lines
    const listItems = desc.split('\n')
      .map(line => line.replace(/•/g, '').trim())
      .filter(line => line.length > 0)
      .map(line => `<li>${line}</li>`)
      .join('');
    return `<ul>${listItems}</ul>`;
  };

  // Helper for skills
  const formatSkills = (skills, title) => {
    if (!skills || skills.trim() === '') return '';
    return `
    <div class="skill-category">
      <h4>${title}</h4>
      <p>${skills.trim()}</p>
    </div>
    `;
  };

  // Helper to ensure URLs have a protocol
  const formatLink = (link) => {
    if (!link) return '';
    if (link.startsWith('http://') || link.startsWith('https://')) {
      return link;
    }
    return `https://${link}`;
  };

  return `
    <div class="container">
      <div class="header">
        <h1>${data.personalInfo?.name || 'Your Name'}</h1>
        
        <div class="contact-info">
          ${data.personalInfo?.phone ? `<span>📞 ${data.personalInfo.phone}</span>` : ''}
          ${data.personalInfo?.email ? ` | <span>📧 <a href="mailto:${data.personalInfo.email}">${data.personalInfo.email}</a></span>` : ''}
          ${data.personalInfo?.location ? ` | <span>🏠 ${data.personalInfo.location}</span>` : ''}
        </div>
        <div class="contact-info" style="margin-top: 5px;">
          ${data.personalInfo?.linkedin ? `
          <span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style="vertical-align: middle; margin-right: 3px;">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" fill="#0077B5"/>
            </svg>
            <a href="${formatLink(data.personalInfo.linkedin)}" target="_blank" rel="noopener noreferrer">${data.personalInfo.linkedin}</a>
          </span>` : ''}
          ${data.personalInfo?.portfolio ? `
          ${data.personalInfo.linkedin ? ' | ' : ''}
          <span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style="vertical-align: middle; margin-right: 3px;">
               <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" fill="#000000"/>
            </svg>
            <a href="${formatLink(data.personalInfo.portfolio)}" target="_blank" rel="noopener noreferrer">${data.personalInfo.portfolio}</a>
          </span>` : ''}
        </div>
      </div>

      <div class="content">
        ${data.summary ? `
        <div class="section">
          <h2 class="section-title">Professional Summary</h2>
          <p class="objective">${data.summary}</p>
        </div>
        ` : ''}

        ${data.education && data.education.length > 0 && data.education[0].degree ? `
        <div class="section">
          <h2 class="section-title">Education</h2>
          ${data.education.map(edu => edu.degree ? `
          <div class="entry">
            <div class="entry-header">
              <div>
                <div class="entry-title">${edu.degree}</div>
                <div class="entry-subtitle">${edu.school || ''}${edu.location ? `, ${edu.location}` : ''}</div>
              </div>
              <div class="entry-date">${edu.graduationDate || ''}</div>
            </div>
          </div>
          ` : '').join('')}
        </div>
        ` : ''}

        ${data.experience && data.experience.length > 0 && data.experience[0].title ? `
        <div class="section">
          <h2 class="section-title">Work Experience</h2>
          ${data.experience.map(exp => exp.title ? `
          <div class="entry">
            <div class="entry-header">
              <div>
                <div class="entry-title">${exp.title}</div>
                <div class="entry-subtitle">${exp.company || ''}${exp.location ? `, ${exp.location}` : ''}</div>
              </div>
              <div class="entry-date">${exp.startDate || ''} - ${exp.current ? 'Present' : exp.endDate || ''}</div>
            </div>
            ${exp.description ? `<div class="entry-content">${formatDescription(exp.description)}</div>` : ''}
          </div>
          ` : '').join('')}
        </div>
        ` : ''}

        ${data.projects && data.projects.length > 0 && data.projects[0].name ? `
        <div class="section">
          <h2 class="section-title">Projects</h2>
          ${data.projects.map(proj => proj.name ? `
          <div class="entry">
            <div class="entry-header">
              <div>
                <div class="entry-title">${proj.name}</div>
                <div class="entry-subtitle">${proj.technologies || ''}</div>
              </div>
              ${proj.link ? `<div class="entry-date"><a href="${formatLink(proj.link)}" target="_blank">${proj.link}</a></div>` : ''}
            </div>
            ${proj.description ? `<div class="entry-content">${formatDescription(proj.description)}</div>` : ''}
          </div>
          ` : '').join('')}
        </div>
        ` : ''}
        
        ${data.technicalSkills || data.softSkills ? `
        <div class="section">
          <h2 class="section-title">Skills</h2>
          <div class="skills-grid">
            ${formatSkills(data.technicalSkills, 'Technical Skills:')}
            ${formatSkills(data.softSkills, 'Soft Skills:')}
          </div>
        </div>
        ` : ''}

        ${data.certifications && data.certifications.length > 0 && data.certifications[0].name ? `
        <div class="section">
          <h2 class="section-title">Certifications</h2>
          <ul class="cert-list">
            ${data.certifications.map(cert => cert.name ? `
            <li>
              <div class="cert-name">${cert.name}</div>
              <div class="cert-org">${cert.issuer || ''}</div>
              <div class="cert-date">Completed: ${cert.date || ''}</div>
            </li>
            ` : '').join('')}
          </ul>
        </div>
        ` : ''}
      </div>
    </div>
  `;
}


// Calculate ATS Score
function calculateATSScore() {
  let score = 0;
  const suggestions = [];
  const data = state.resumeData;
  
  // Completeness (40 points)
  if (data.personalInfo?.name && data.personalInfo?.email && data.personalInfo?.phone && data.personalInfo?.location) {
    score += 10;
  } else {
    suggestions.push('Complete all personal information fields (+10 points)');
  }
  
  if (data.education && data.education.length > 0 && data.education[0].degree) {
    score += 8;
  } else {
    suggestions.push('Add at least one education entry (+8 points)');
  }
  
  if (data.experience && data.experience.length > 0 && data.experience[0].title) {
    score += 10;
  } else {
    suggestions.push('Add at least one work experience entry (+10 points)');
  }
  
  if ((data.technicalSkills && data.technicalSkills.split(',').length >= 5) || (data.softSkills && data.softSkills.split(',').length >= 3)) {
    score += 8;
  } else {
    suggestions.push('Add more skills (5+ technical, 3+ soft skills) (+8 points)');
  }
  
  if (data.personalInfo?.email && data.personalInfo?.phone) {
    score += 4;
  } else {
    suggestions.push('Add both email and phone number (+4 points)');
  }
  
  // Content Quality (30 points)
  let expDescLength = 0;
  if (data.experience && data.experience.length > 0) {
    data.experience.forEach(exp => {
      if (exp.description) expDescLength += exp.description.length;
    });
  }
  if (expDescLength > 200) {
    score += 10;
  } else if (expDescLength > 100) {
    score += 5;
    suggestions.push('Add more detailed experience descriptions (+5 points)');
  } else {
    suggestions.push('Add detailed experience descriptions with metrics (+10 points)');
  }
  
  if (data.projects && data.projects.length > 0 && data.projects[0].name && data.projects[0].description) {
    score += 8;
  } else {
    suggestions.push('Add project descriptions (+8 points)');
  }
  
  if (data.certifications && data.certifications.length > 0 && data.certifications[0].name) {
    score += 6;
  } else {
    suggestions.push('Add certifications to boost credibility (+6 points)');
  }
  
  if ((data.personalInfo?.linkedin || data.personalInfo?.portfolio)) {
    score += 6;
  } else {
    suggestions.push('Add LinkedIn or portfolio links (+6 points)');
  }
  
  // ATS Optimization (30 points)
  score += 10; // Standard headers are always used in templates
  
  // Check for clean formatting (no special characters in key fields)
  let hasCleanFormatting = true;
  if (data.personalInfo?.name && /[^a-zA-Z\s.-]/.test(data.personalInfo.name)) hasCleanFormatting = false;
  if (hasCleanFormatting) {
    score += 8;
  } else {
    suggestions.push('Use clean formatting (avoid special characters) (+8 points)');
  }
  
  // Check for action verbs and keywords
  let hasActionVerbs = false;
  if (data.experience && data.experience.length > 0) {
    data.experience.forEach(exp => {
      if (exp.description) {
        actionVerbs.forEach(verb => {
          if (exp.description.includes(verb)) hasActionVerbs = true;
        });
      }
    });
  }
  if (hasActionVerbs) {
    score += 12;
  } else {
    suggestions.push('Use action verbs (Led, Developed, Improved, etc.) (+12 points)');
  }
  
  // Update score display
  state.atsScore = Math.min(score, 100);
  updateScoreDisplay(suggestions);
}

// Update Score Display
function updateScoreDisplay(suggestions) {
  const scoreValue = document.getElementById('score-value');
  const scoreCircle = document.getElementById('score-circle');
  const scoreSuggestions = document.getElementById('score-suggestions');
  
  scoreValue.textContent = state.atsScore;
  
  // Update circle progress
  const circumference = 339.292;
  const offset = circumference - (state.atsScore / 100) * circumference;
  scoreCircle.style.strokeDashoffset = offset;
  
  // Update color based on score
  let color;
  if (state.atsScore >= 86) {
    color = '#21808d'; // Green
  } else if (state.atsScore >= 71) {
    color = '#f59e0b'; // Yellow
  } else if (state.atsScore >= 41) {
    color = '#e68161'; // Orange
  } else {
    color = '#ff5459'; // Red
  }
  scoreCircle.style.stroke = color;
  
  // Update suggestions
  if (state.atsScore >= 86) {
    scoreSuggestions.innerHTML = '<p style="color: #21808d; font-weight: 600;">🎉 Excellent! Your resume is highly ATS-compatible!</p>';
  } else if (suggestions.length > 0) {
    scoreSuggestions.innerHTML = '<p><strong>Suggestions to improve:</strong></p><ul>' + 
      suggestions.slice(0, 3).map(s => `<li>${s}</li>`).join('') + 
      '</ul>';
  } else {
    scoreSuggestions.innerHTML = '<p>Keep improving your resume!</p>';
  }
}

// Trigger Auto-Save
function triggerAutoSave() {
  if (state.autoSaveTimeout) {
    clearTimeout(state.autoSaveTimeout);
  }
  state.autoSaveTimeout = setTimeout(() => {
    // Note: localStorage is not available in sandboxed environment
    // This is a placeholder for auto-save functionality
    // In a real application, this would save to a backend server
  }, 2000);
}

// Save to Memory (simulating localStorage)
function saveProgress() {
  try {
    // Store in state for the current session
    state.lastSaved = new Date().toISOString();
    updateLastSavedDisplay();
    showNotification('Resume saved successfully!', 'success');
  } catch (error) {
    showNotification('Error saving resume. Please try again.', 'error');
  }
}

// Load from Memory
function loadProgress() {
  try {
    // In this implementation, data persists in memory during the session
    if (state.resumeData && state.resumeData.personalInfo) {
      showNotification('Resume data is already loaded!', 'info');
    } else {
      showNotification('No saved data found.', 'info');
    }
  } catch (error) {
    showNotification('Error loading resume.', 'error');
  }
}

// Clear All Data
function clearAllData() {
  showConfirmModal(
    'Clear All Data',
    'Are you sure you want to clear all resume data? This action cannot be undone.',
    () => {
      // Reset to empty state
      state.resumeData = {
        personalInfo: {},
        summary: '',
        education: [],
        experience: [],
        technicalSkills: '',
        softSkills: '',
        projects: [],
        certifications: []
      };
      state.lastSaved = null;
      
      // Clear form
      document.getElementById('resume-form').reset();
      document.getElementById('education-list').innerHTML = '';
      document.getElementById('experience-list').innerHTML = '';
      document.getElementById('projects-list').innerHTML = '';
      document.getElementById('certifications-list').innerHTML = '';
      
      updatePreview();
      calculateATSScore();
      updateLastSavedDisplay();
      showNotification('All data cleared successfully!', 'success');
    }
  );
}

// Update Last Saved Display
function updateLastSavedDisplay() {
  const display = document.getElementById('last-saved');
  if (state.lastSaved) {
    const date = new Date(state.lastSaved);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000 / 60);
    
    let timeText;
    if (diff < 1) {
      timeText = 'Just now';
    } else if (diff < 60) {
      timeText = `${diff} minute${diff > 1 ? 's' : ''} ago`;
    } else {
      const hours = Math.floor(diff / 60);
      timeText = `${hours} hour${hours > 1 ? 's' : ''} ago`;
    }
    
    display.textContent = `Last saved: ${timeText}`;
  } else {
    display.textContent = '';
  }
}

// Generate PDF
function generatePDF() {
  const button = document.getElementById('download-pdf');
  const text = document.getElementById('pdf-text');
  const loader = document.getElementById('pdf-loader');
  const preview = document.getElementById('resume-preview');
  
  // Disable button and show loader
  button.disabled = true;
  text.style.display = 'none';
  loader.style.display = 'inline-block';
  
  const name = state.resumeData.personalInfo?.name || 'Resume';
  const filename = `Resume_${name.replace(/\s+/g, '_')}.pdf`;
  
  const opt = {
    margin: 10,
    filename: filename,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };
  
  html2pdf().set(opt).from(preview).save().then(() => {
    button.disabled = false;
    text.style.display = 'inline';
    loader.style.display = 'none';
    showNotification('PDF downloaded successfully!', 'success');
  }).catch(error => {
    button.disabled = false;
    text.style.display = 'inline';
    loader.style.display = 'none';
    showNotification('Error generating PDF. Please try again.', 'error');
  });
}

// Switch Template
function switchTemplate(templateId) {
  state.activeTemplate = templateId;
  
  // Update active state
  document.querySelectorAll('.template-card').forEach(card => {
    card.classList.remove('active');
  });
  document.querySelector(`[data-template="${templateId}"]`).classList.add('active');
  
  // Update preview
  const preview = document.getElementById('resume-preview');
  preview.className = `resume-preview template-${templateId}`;
  updatePreview();
}

// Toggle Theme
function toggleTheme() {
  state.theme = state.theme === 'light' ? 'dark' : 'light';
  applyTheme(state.theme);
}

// Apply Theme
function applyTheme(theme) {
  document.documentElement.setAttribute('data-color-scheme', theme);
  const icon = document.getElementById('theme-icon');
  icon.textContent = theme === 'light' ? '🌙' : '☀️';
}

// Show Notification
function showNotification(message, type = 'info') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  
  container.appendChild(toast);
  
  setTimeout(() => {
    toast.remove();
  }, 3000);
}

// Show Confirm Modal
function showConfirmModal(title, message, onConfirm) {
  const modal = document.getElementById('confirm-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalMessage = document.getElementById('modal-message');
  const confirmBtn = document.getElementById('modal-confirm');
  const cancelBtn = document.getElementById('modal-cancel');
  
  modalTitle.textContent = title;
  modalMessage.textContent = message;
  modal.style.display = 'flex';
  
  const handleConfirm = () => {
    onConfirm();
    modal.style.display = 'none';
    confirmBtn.removeEventListener('click', handleConfirm);
    cancelBtn.removeEventListener('click', handleCancel);
  };
  
  const handleCancel = () => {
    modal.style.display = 'none';
    confirmBtn.removeEventListener('click', handleConfirm);
    cancelBtn.removeEventListener('click', handleCancel);
  };
  
  confirmBtn.addEventListener('click', handleConfirm);
  cancelBtn.addEventListener('click', handleCancel);
  
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      handleCancel();
    }
  });
}

// Setup Event Listeners
function setupEventListeners() {
  // Theme toggle
  document.getElementById('theme-toggle').addEventListener('click', toggleTheme);
  
  // Save/Load/Clear buttons
  document.getElementById('save-btn').addEventListener('click', saveProgress);
  document.getElementById('load-btn').addEventListener('click', loadProgress);
  document.getElementById('clear-btn').addEventListener('click', clearAllData);
  
  // PDF Download
  document.getElementById('download-pdf').addEventListener('click', generatePDF);
  
  // Template selector
  document.querySelectorAll('.template-card').forEach(card => {
    card.addEventListener('click', () => {
      switchTemplate(card.dataset.template);
    });
  });
  
  // Add entry buttons
  document.getElementById('add-education').addEventListener('click', () => addEducationEntry());
  document.getElementById('add-experience').addEventListener('click', () => addExperienceEntry());
  document.getElementById('add-project').addEventListener('click', () => addProjectEntry());
  document.getElementById('add-certification').addEventListener('click', () => addCertificationEntry());
  
  // Personal info and summary inputs
  ['name', 'email', 'phone', 'location', 'linkedin', 'portfolio', 'summary', 'technical-skills', 'soft-skills'].forEach(id => {
    const element = document.getElementById(id);
    if (element) {
      element.addEventListener('input', () => {
        collectFormData();
        updatePreview();
        calculateATSScore();
        triggerAutoSave();
        
        if (id === 'summary') {
          updateCharCount(id);
        }
      });
      
      element.addEventListener('focus', () => {
        const section = element.closest('.form-section-block');
        if (section) {
          document.querySelectorAll('.form-section-block').forEach(s => s.classList.remove('active'));
          section.classList.add('active');
        }
      });
    }
  });
  
  // Section collapse/expand
  document.querySelectorAll('.section-toggle').forEach(toggle => {
    toggle.addEventListener('click', () => {
      const content = toggle.closest('.form-section-block').querySelector('.section-content');
      const isCollapsed = content.classList.contains('collapsed');
      
      if (isCollapsed) {
        content.style.maxHeight = content.scrollHeight + 'px';
        content.classList.remove('collapsed');
        toggle.textContent = '−';
      } else {
        content.style.maxHeight = content.scrollHeight + 'px';
        setTimeout(() => {
          content.style.maxHeight = '0';
        }, 10);
        content.classList.add('collapsed');
        toggle.textContent = '+';
      }
    });
  });
  
  // Set initial max-height for sections
  document.querySelectorAll('.section-content').forEach(content => {
    content.style.maxHeight = content.scrollHeight + 'px';
  });
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

// === Product-Ready Additions (Phase 1) ===

// Toasts
function showToast(message, type = 'info', timeout = 3500) {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = `toast toast--${type}`;
  toast.setAttribute('role', 'status');
  toast.innerHTML = `<span>${message}</span><button class="toast__close" aria-label="Dismiss">×</button>`;
  container.appendChild(toast);
  const remove = () => { toast.remove(); };
  toast.querySelector('.toast__close').addEventListener('click', remove);
  setTimeout(remove, timeout);
}


// Validation
function validateEmail(v){ return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()); }
function validatePhone(v){ return /^[+\d][\d\s().-]{6,}$/.test(v.trim()); }
function validateURL(v){ try { new URL(v.startsWith('http')? v : 'https://' + v); return true; } catch { return v.trim()===''; } }

function validateField(el) {
  const id = el.id;
  const val = el.value.trim();
  let ok = true;
  if (id === 'email') ok = validateEmail(val);
  if (id === 'phone') ok = validatePhone(val);
  if (id === 'linkedin' || id === 'portfolio') ok = validateURL(val);
  if (id === 'name') ok = val.length > 1;
  el.classList.toggle('is-invalid', !ok);
  el.classList.toggle('is-valid', ok);
  return ok;
}

function validateForm() {
  const requiredIds = ['name','email','phone'];
  let allOk = true;
  requiredIds.forEach(id => {
    const el = document.getElementById(id);
    if (el && !validateField(el)) allOk = false;
  });
  // Optional URLs
  ['linkedin','portfolio'].forEach(id => {
    const el = document.getElementById(id);
    if (el && el.value.trim() && !validateField(el)) allOk = false;
  });
  return allOk;
}


// Persistence
function manualSave(){
  collectFormData();
  localStorage.setItem('rbp_resume', JSON.stringify(state.resumeData));
  const t = new Date().toLocaleString();
  state.lastSaved = t;
  document.getElementById('last-saved').textContent = `Last saved: ${t}`;
  showToast('Progress saved successfully.', 'success');
}

function manualLoad(){
  const raw = localStorage.getItem('rbp_resume');
  if (!raw) { showToast('No saved resume found.', 'info'); return; }
  try{
    state.resumeData = JSON.parse(raw);
    populateForm();
    updatePreview();
    calculateATSScore && calculateATSScore();
    showToast('Loaded your saved resume.', 'success');
  }catch(e){
    showToast('Failed to load saved data.', 'error');
  }
}

function clearAllData(){
  const modal = document.getElementById('confirm-modal');
  if (modal){ 
    modal.style.display = 'block';
    document.getElementById('modal-message').textContent = 'This will clear all data. Continue?';
    const onConfirm = () => {
      localStorage.removeItem('rbp_resume');
      loadDummyData();
      updatePreview();
      showToast('All data cleared.', 'info');
      modal.style.display = 'none';
      cleanup();
    };
    const onCancel = () => { modal.style.display = 'none'; cleanup(); };
    function cleanup(){
      document.getElementById('modal-confirm').removeEventListener('click', onConfirm);
      document.getElementById('modal-cancel').removeEventListener('click', onCancel);
    }
    document.getElementById('modal-confirm').addEventListener('click', onConfirm);
    document.getElementById('modal-cancel').addEventListener('click', onCancel);
  }
}

// Autosave throttle
function triggerAutoSave(){
  clearTimeout(state.autoSaveTimeout);
  state.autoSaveTimeout = setTimeout(() => manualSave(), 1200);
}


// PDF Download with loader
function downloadPDF(){
  if (!validateForm()){
    showToast('Please fix the highlighted fields before exporting.', 'error');
    return;
  }
  const btn = document.getElementById('download-pdf');
  const loader = document.getElementById('pdf-loader');
  const text = document.getElementById('pdf-text');
  if (btn){ btn.setAttribute('aria-busy','true'); }
  if (loader){ loader.style.display='inline-block'; }
  if (text){ text.style.display='none'; }

  const element = document.getElementById('resume-preview');
  const opt = {
    margin:       0.4,
    filename:     'Resume.pdf',
    image:        { type: 'jpeg', quality: 0.98 },
    html2canvas:  { scale: 2, useCORS: true },
    jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
  };
  try {
    html2pdf().set(opt).from(element).save().then(() => {
      showToast('PDF downloaded.', 'success');
    }).catch(() => {
      showToast('PDF failed to generate.', 'error');
    }).finally(() => {
      if (btn) btn.removeAttribute('aria-busy');
      if (loader) loader.style.display='none';
      if (text) text.style.display='inline';
    });
  } catch(e){
    showToast('PDF failed to generate.', 'error');
    if (btn) btn.removeAttribute('aria-busy');
    if (loader) loader.style.display='none';
    if (text) text.style.display='inline';
  }
}
