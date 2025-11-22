// ---------------------------------------------
// Default login accounts
// ---------------------------------------------
const users = [
    {
        email: "student@sbu.com",
        password: "student123",
        role: "student",
        name: "Demo Student"
    },
    {
        email: "teacher@sbu.com",
        password: "teacher123",
        role: "teacher",
        name: "Demo Teacher"
    }
];

// ---------------------------------------------
// LOGIN PAGE
// ---------------------------------------------
document.addEventListener("DOMContentLoaded", () => {

    const loginForm = document.getElementById("loginForm");

    if (loginForm) {
        loginForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const email = loginForm.loginEmail.value.trim();
            const password = loginForm.loginPassword.value.trim();
            const role = loginForm.loginRole.value;

            const foundUser = users.find(
                (u) => u.email === email && u.password === password && u.role === role
            );

            if (!foundUser) {
                alert("Invalid login details! Please check your email, password, and role.");
                return;
            }

            alert(`Login Successful! Welcome ${foundUser.name}`);

            // REDIRECT BASED ON ROLE
            if (foundUser.role === "student") {
                window.location.href = "student-dashboard.html";
            } else if (foundUser.role === "teacher") {
                window.location.href = "teacher-dashboard.html";
            }
        });
    }

    // ---------------------------------------------
    // STUDENT SIGNUP
    // ---------------------------------------------
    const studentForm = document.getElementById("studentSignupForm");

    if (studentForm) {
        studentForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const name = studentForm.studentName.value.trim();
            const email = studentForm.studentEmail.value.trim();
            const pass = studentForm.studentPassword.value;
            const cpass = studentForm.studentConfirmPassword.value;

            if (pass !== cpass) {
                alert("Passwords do not match!");
                return;
            }

            users.push({
                email,
                password: pass,
                role: "student",
                name
            });

            alert("Student Account Created Successfully!");
            location.href = "login.html";
        });
    }

    // ---------------------------------------------
    // TEACHER SIGNUP
    // ---------------------------------------------
    const teacherForm = document.getElementById("teacherSignupForm");

    if (teacherForm) {
        teacherForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const name = teacherForm.teacherName.value.trim();
            const email = teacherForm.teacherEmail.value.trim();
            const pass = teacherForm.teacherPassword.value;
            const cpass = teacherForm.teacherConfirmPassword.value;

            if (pass !== cpass) {
                alert("Passwords do not match!");
                return;
            }

            users.push({
                email,
                password: pass,
                role: "teacher",
                name
            });

            alert("Teacher Account Created Successfully!");
            location.href = "login.html";
        });
    }

    // ---------------------------------------------
    // FORGOT PASSWORD
    // ---------------------------------------------
    const forgotForm = document.getElementById("forgotPasswordForm");

    if (forgotForm) {
        forgotForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const email = forgotForm.resetEmail.value.trim();
            const foundUser = users.find((u) => u.email === email);

            if (!foundUser) {
                alert("Email not found! Please enter a registered email.");
                return;
            }

            alert(`Password reset link sent to: ${email}`);
            location.href = "login.html";
        });
    }
});

/* 
  All Student pages
*/

(function(){
  'use strict';

  // ------------------ helpers ------------------
  const $ = (sel, ctx=document) => ctx.querySelector(sel);
  const $$ = (sel, ctx=document) => Array.from((ctx || document).querySelectorAll(sel));
  const uid = () => 'id_' + Math.random().toString(36).slice(2,9);

  function read(key){ try { return JSON.parse(localStorage.getItem(key) || '[]'); } catch(e){ return []; } }
  function write(key, val){ localStorage.setItem(key, JSON.stringify(val)); }
  function getObj(key){ try { return JSON.parse(localStorage.getItem(key) || '{}'); } catch(e){ return {}; } }
  function setObj(key, val){ localStorage.setItem(key, JSON.stringify(val)); }

  // ------------------ bootstrap defaults ------------------
  (function bootstrap(){
    // Users (demo)
    if (read('SBU_USERS').length === 0) {
      write('SBU_USERS', [
        { id: uid(), email: 'student@sbu.com', password: 'student123', role: 'student', name: 'Demo Student' },
        { id: uid(), email: 'teacher@sbu.com', password: 'teacher123', role: 'teacher', name: 'Demo Teacher' }
      ]);
    }

    if (read('SBU_NOTES').length === 0) {
      write('SBU_NOTES', [
        { id: uid(), title: "Data Structures Notes", subject:"Computer Science", description:"Arrays, lists, trees, graphs.", filename:"ds_notes.pdf", author:"Demo Student", createdAt: Date.now() - 86400000 },
        { id: uid(), title: "Operating Systems", subject:"Computer Science", description:"Process & memory management.", filename:"os_notes.pdf", author:"Demo Teacher", createdAt: Date.now() - 86400000*2 }
      ]);
    }

    if (read('SBU_NOTICES').length === 0) {
      write('SBU_NOTICES', [
        { id: uid(), title:"Exam Schedule", description:"Midterm exam schedule published. Check NOTICE board for details.", createdAt: Date.now() - 86400000*3 }
      ]);
    }

    if (read('SBU_QA').length === 0) {
      write('SBU_QA', [
        { id: uid(), question:"How to prepare for DS?", author:"Student A", createdAt: Date.now() - 86400000*4, replies: [{ id:uid(), author:"Teacher B", text:"Practice problems & revise basics.", createdAt: Date.now() - 86400000*3 }] }
      ]);
    }

    // if no current user, set demo student as current (so pages work). This only sets an initial logged-in student for demo.
    if (!localStorage.getItem('SBU_CURRENT_USER')) {
      const users = read('SBU_USERS');
      const demo = users.find(u=>u.email==='student@sbu.com') || users[0];
      localStorage.setItem('SBU_CURRENT_USER', JSON.stringify({ id: demo.id, email: demo.email, role: demo.role, name: demo.name }));
    }

    // if no profile, create minimal from current user
    if (!localStorage.getItem('STUDENT_PROFILE')) {
      const cur = JSON.parse(localStorage.getItem('SBU_CURRENT_USER') || '{}');
      const p = { name: cur.name || 'Demo Student', email: cur.email || '', department:'', semester:'', phone:'', bio:'' };
      setObj('STUDENT_PROFILE', p);
    }
  })();

  // ------------------ navigation helpers ------------------
  window.logout = function(){
    localStorage.removeItem('SBU_CURRENT_USER');
    alert('Logged out successfully.');
    // redirect to login page if exists
    if (location.href.includes('student-dashboard') || location.href.includes('student-')) {
      location.href = 'login.html';
    } else {
      location.reload();
    }
  };

  window.setActiveMenu = function(index){
    const items = $$('.menu-item');
    items.forEach(i=>i.classList.remove('active'));
    if (items[index]) items[index].classList.add('active');
  };

  window.focusSearch = function(){ const s = $('#searchInput'); if (s) s.focus(); };

  // auto mark correct sidebar item based on pathname
  function markSidebarActiveByPath(){
    const p = location.pathname.split('/').pop().toLowerCase();
    const map = {
      'student-dashboard.html': 0,
      'upload-notes.html': 1,
      'student-view-notes.html': 2,
      'student-notice.html': 3,
      'student-qa-forum.html': 4,
      'student-profile.html': 5,
      'edit-student-profile.html': 5 // profile/edit share same active
    };
    const idx = map[p];
    if (typeof idx === 'number') {
      const items = $$('.menu-item');
      items.forEach(i=>i.classList.remove('active'));
      if (items[idx]) items[idx].classList.add('active');
    }
  }

  // ------------------ NOTES ------------------
  window.renderNotesGrid = function(containerSelector = '.notes-grid'){
    const notes = read('SBU_NOTES').slice().reverse();
    const container = document.querySelector(containerSelector);
    if (!container) return;
    if (notes.length === 0) { container.innerHTML = '<div class="no-results">No notes available.</div>'; return; }
    container.innerHTML = '';
    notes.forEach(n => {
      const card = document.createElement('div');
      card.className = 'note-card';
      card.innerHTML = `
        <span class="subject">${escapeHtml(n.subject)}</span>
        <h3>${escapeHtml(n.title)}</h3>
        <p class="description">${escapeHtml(n.description || '')}</p>
        <div style="margin-top:12px; font-size:13px; color:#999;">Uploaded by: ${escapeHtml(n.author||'Unknown')} • ${new Date(n.createdAt).toLocaleString()}</div>
        <div style="margin-top:10px;"><button class="btn btn-secondary btn-download" data-id="${n.id}">Download</button></div>
      `;
      container.appendChild(card);
    });

    // attach download handlers
    $$('.btn-download', container).forEach(btn=>{
      btn.addEventListener('click', (e)=>{
        const id = btn.getAttribute('data-id');
        simulateDownload(id);
      });
    });
  };

  function simulateDownload(noteId){
    const notes = read('SBU_NOTES');
    const note = notes.find(n=>n.id===noteId);
    if (!note) return alert('Note not found');
    // if we had a real file we'd open it; here we simulate:
    alert(`Simulated download:\n${note.filename || 'attachment.pdf'}\n(Note metadata only; real file requires server)`);
  }

  // ------------------ NOTICES ------------------
  window.renderNotices = function(containerSelector = '#noticesList'){
    const notices = read('SBU_NOTICES').slice().reverse();
    const container = document.querySelector(containerSelector);
    if (!container) return;
    if (notices.length === 0) { container.innerHTML = '<div class="no-results">No notices.</div>'; return; }
    container.innerHTML = '';
    notices.forEach(n=>{
      const el = document.createElement('div');
      el.className = 'notice-card';
      el.innerHTML = `<h3 style="margin-bottom:6px;">${escapeHtml(n.title)}</h3><div style="color:#666;">${escapeHtml(n.description)}</div><div style="margin-top:8px; font-size:12px; color:#999;">${new Date(n.createdAt).toLocaleString()}</div>`;
      container.appendChild(el);
    });
  };

  // ------------------ Q&A ------------------
  window.renderQA = function(containerSelector = '#qaList'){
    const qa = read('SBU_QA').slice().reverse();
    const container = document.querySelector(containerSelector);
    if (!container) return;
    if (qa.length === 0) { container.innerHTML = '<div class="no-results">No questions yet.</div>'; return; }
    container.innerHTML = '';
    qa.forEach(q=>{
      const qEl = document.createElement('div');
      qEl.className = 'question';
      qEl.innerHTML = `<strong>${escapeHtml(q.question)}</strong>
        <div style="font-size:13px; color:#888; margin-top:6px;">Asked by ${escapeHtml(q.author||'Anonymous')} • ${new Date(q.createdAt).toLocaleString()}</div>
        <div class="replies" style="margin-top:10px;"></div>
        <div style="margin-top:10px;">
          <input type="text" placeholder="Your name" class="reply-author" style="padding:8px; border:1px solid #ddd; border-radius:8px; width:30%; margin-right:8px;">
          <input type="text" placeholder="Write a reply..." class="reply-text" style="padding:8px; border:1px solid #ddd; border-radius:8px; width:48%; margin-right:8px;">
          <button class="btn btn-primary btn-reply">Reply</button>
        </div>
      `;
      const repliesDiv = qEl.querySelector('.replies');
      (q.replies || []).forEach(r=>{
        const rEl = document.createElement('div');
        rEl.className = 'reply';
        rEl.innerHTML = `<strong>${escapeHtml(r.author)}</strong> • <span style="color:#666; font-size:13px;">${escapeHtml(r.text)}</span><div style="font-size:12px; color:#999;">${new Date(r.createdAt).toLocaleString()}</div>`;
        repliesDiv.appendChild(rEl);
      });

      qEl.querySelector('.btn-reply').addEventListener('click', ()=>{
        const author = qEl.querySelector('.reply-author').value.trim() || 'Anonymous';
        const text = qEl.querySelector('.reply-text').value.trim();
        if (!text) return alert('Enter reply text');
        const arr = read('SBU_QA');
        const idx = arr.findIndex(item => item.id === q.id);
        if (idx === -1) return alert('Question not found');
        arr[idx].replies = arr[idx].replies || [];
        arr[idx].replies.push({ id: uid(), author, text, createdAt: Date.now() });
        write('SBU_QA', arr);
        renderQA(containerSelector);
      });

      container.appendChild(qEl);
    });
  };

  // ------------------ UPLOAD NOTES ------------------
  window.handleUpload = function(formSelector = '#uploadForm'){
    const form = document.querySelector(formSelector);
    if (!form) return;
    form.addEventListener('submit', (ev)=>{
      ev.preventDefault();
      const title = form.querySelector('[name=title]').value.trim();
      const subject = form.querySelector('[name=subject]').value.trim();
      const description = form.querySelector('[name=description]').value.trim();
      const author = form.querySelector('[name=author]').value.trim() || getCurrentUserName();
      const fileInput = form.querySelector('[name=file]');
      const filename = (fileInput && fileInput.files && fileInput.files[0]) ? fileInput.files[0].name : (form.querySelector('[name=filename]').value.trim() || ('notes_' + Date.now() + '.pdf'));

      if (!title || !subject) return alert('Please provide title and subject');
      const notes = read('SBU_NOTES');
      notes.push({ id: uid(), title, subject, description, filename, author, createdAt: Date.now() });
      write('SBU_NOTES', notes);
      alert('Note uploaded successfully (client-side).');
      form.reset();
      // if view page present, re-render
      renderNotesGrid('.notes-grid');
      // optionally redirect to view
      // location.href = 'student-view-notes.html';
    });
  };

  // ------------------ POST QUESTION ------------------
  window.handlePostQuestion = function(formSelector = '#qaForm'){
    const form = document.querySelector(formSelector);
    if (!form) return;
    form.addEventListener('submit', (ev)=>{
      ev.preventDefault();
      const author = form.querySelector('[name=author]').value.trim() || getCurrentUserName();
      const question = form.querySelector('[name=question]').value.trim();
      if (!question) return alert('Write a question');
      const arr = read('SBU_QA');
      arr.push({ id: uid(), question, author, createdAt: Date.now(), replies: [] });
      write('SBU_QA', arr);
      alert('Question posted.');
      form.reset();
      renderQA('#qaList');
    });
  };

  // ------------------ PROFILE ------------------
  function getCurrentUserName(){
    const cur = JSON.parse(localStorage.getItem('SBU_CURRENT_USER') || '{}');
    return cur.name || cur.email || 'Anonymous';
  }

  window.loadStudentProfile = function(){
    const p = getObj('STUDENT_PROFILE') || {};
    if ($('#profileName')) {
      $('#profileName').textContent = p.name || 'No Name';
      $('#profileEmail').textContent = p.email || 'No Email';
      $('#profileDept').textContent = p.department || 'Not Set';
      $('#profileSem').textContent = p.semester || 'Not Set';
      $('#profilePhone').textContent = p.phone || 'Not Set';
      $('#profileBio').textContent = p.bio || 'No bio added.';
    }
    if ($('#editName')) {
      $('#editName').value = p.name || '';
      $('#editEmail').value = p.email || '';
      $('#editDept').value = p.department || '';
      $('#editSem').value = p.semester || '';
      $('#editPhone').value = p.phone || '';
      $('#editBio').value = p.bio || '';
    }
  };

  // Save profile (edit form)
  const editForm = $('#editProfileForm');
  if (editForm) {
    editForm.addEventListener('submit', function(e){
      e.preventDefault();
      const updated = {
        name: $('#editName').value.trim(),
        email: $('#editEmail').value.trim(),
        department: $('#editDept').value.trim(),
        semester: $('#editSem').value.trim(),
        phone: $('#editPhone').value.trim(),
        bio: $('#editBio').value.trim()
      };
      setObj('STUDENT_PROFILE', updated);
      alert('Profile updated.');
      location.href = 'student-profile.html';
    });
  }

  // ------------------ SEARCH ------------------
  const searchInput = $('#searchInput');
  if (searchInput) {
    searchInput.addEventListener('input', function(e){
      const term = e.target.value.trim().toLowerCase();
      const notes = read('SBU_NOTES');
      const results = notes.filter(n => (n.title + ' ' + (n.description||'') + ' ' + n.subject + ' ' + (n.author||'')).toLowerCase().includes(term));
      const container = document.querySelector('.notes-grid');
      if (!container) return;
      container.innerHTML = '';
      if (results.length === 0) container.innerHTML = '<div class="no-results">No results</div>';
      results.slice().reverse().forEach(n=>{
        const card = document.createElement('div');
        card.className = 'note-card';
        card.innerHTML = `<span class="subject">${escapeHtml(n.subject)}</span><h3>${escapeHtml(n.title)}</h3><p class="description">${escapeHtml(n.description||'')}</p><div style="margin-top:10px; font-size:13px; color:#999;">Uploaded by: ${escapeHtml(n.author||'Unknown')} • ${new Date(n.createdAt).toLocaleString()}</div>`;
        container.appendChild(card);
      });
    });
  }

  // ------------------ small utilities ------------------
  function escapeHtml(str){
    if (str === undefined || str === null) return '';
    return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  // ------------------ init / auto-render ------------------
  document.addEventListener('DOMContentLoaded', function(){
    markSidebarActiveByPath();
    // render if containers exist
    if (document.querySelector('.notes-grid')) renderNotesGrid('.notes-grid');
    if (document.querySelector('#noticesList')) renderNotices('#noticesList');
    if (document.querySelector('#qaList')) renderQA('#qaList');
    if (document.querySelector('#uploadForm')) handleUpload('#uploadForm');
    if (document.querySelector('#qaForm')) handlePostQuestion('#qaForm');
    loadStudentProfile();

    // support clicking note cards to show alert
    document.addEventListener('click', function(e){
      const card = e.target.closest('.note-card');
      if (card && e.target.tagName !== 'BUTTON') {
        const title = card.querySelector('h3') ? card.querySelector('h3').textContent : '';
        if (title) alert('Open note: ' + title + '\n(Implement a detailed view or download with a backend.)');
      }
    });
  });

  // expose some functions for console/testing
  window._sbu = {
    read, write, getObj, setObj, renderNotesGrid, renderNotices, renderQA, simulateDownload
  };

})();
