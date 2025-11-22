// =========================================================
// BASIC UTILITIES
// =========================================================
function $(id) {
  return document.getElementById(id);
}

function load(key, fallback) {
  return JSON.parse(localStorage.getItem(key) || fallback);
}

function save(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function uid() {
  return "id_" + Math.random().toString(36).substring(2, 10);
}


// =========================================================
// PAGE NAVIGATION
// =========================================================
function goTo(page) {
  window.location.href = page;
}


// =========================================================
// LOGOUT
// =========================================================
function logout() {
  localStorage.removeItem("SBU_CURRENT_USER");
  alert("Logged out successfully!");
  window.location.href = "login.html";
}


// =========================================================
// HIGHLIGHT ACTIVE MENU
// =========================================================
document.addEventListener("DOMContentLoaded", function () {
  let path = window.location.pathname.split("/").pop().toLowerCase();
  let items = document.querySelectorAll(".sidebar-item");

  items.forEach(item => {
    let onclickVal = item.getAttribute("onclick");
    if (!onclickVal) return;

    let match = onclickVal.match(/'(.*)'/);
    if (match && match[1].toLowerCase() === path) {
      item.classList.add("active");
    } else {
      item.classList.remove("active");
    }
  });

  // Auto-load data depending on page
  autoPageLoad();
});


// =========================================================
// AUTO PAGE INITIALIZER
// =========================================================
function autoPageLoad() {
  let page = window.location.pathname.split("/").pop().toLowerCase();

  if (page === "teacher-manage-notes.html") renderTeacherNotes();
  if (page === "teacher-qa-forum.html") renderTeacherQA();
  if (page === "teacher-profile.html") renderTeacherProfile();
  if (page === "teacher-edit-profile.html") loadTeacherEditForm();
}



// =========================================================
// TEACHER NOTES — UPLOAD
// =========================================================
function teacherUploadNote(event) {
  event.preventDefault();

  let title = event.target.title.value.trim();
  let subject = event.target.subject.value.trim();
  let description = event.target.description.value.trim();
  let file = event.target.file.files[0];

  if (!title || !subject || !file) {
    alert("Please fill all required fields!");
    return;
  }

  let notes = load("SBU_NOTES", "[]");

  notes.push({
    id: uid(),
    title,
    subject,
    description,
    filename: file.name,
    author: "Teacher",
    createdAt: Date.now()
  });

  save("SBU_NOTES", notes);

  alert("Note uploaded successfully!");
  goTo("teacher-manage-notes.html");
}



// =========================================================
// TEACHER NOTES — MANAGE
// =========================================================
function renderTeacherNotes() {
  const container = $("teacherNotesList");
  if (!container) return;

  let notes = load("SBU_NOTES", "[]");

  container.innerHTML = "";

  if (notes.length === 0) {
    container.innerHTML = `<p>No notes uploaded yet.</p>`;
    return;
  }

  notes.forEach(note => {
    let div = document.createElement("div");
    div.className = "note-item";

    div.innerHTML = `
      <div class="note-title">${note.title}</div>
      <div class="note-subject">${note.subject}</div>
      <div class="note-actions">
        <button class="note-btn" onclick="downloadNote('${note.id}')">Download</button>
        <button class="note-btn delete" onclick="deleteNote('${note.id}')">Delete</button>
      </div>
    `;

    container.appendChild(div);
  });
}

function downloadNote(id) {
  alert("Downloading file associated with note ID: " + id);
}

function deleteNote(id) {
  let notes = load("SBU_NOTES", "[]");
  notes = notes.filter(n => n.id !== id);
  save("SBU_NOTES", notes);
  renderTeacherNotes();
}



// =========================================================
// TEACHER Q&A — MANAGE
// =========================================================
function renderTeacherQA() {
  let container = $("teacherQAList");
  if (!container) return;

  let qa = load("SBU_QA", "[]");

  container.innerHTML = "";

  if (qa.length === 0) {
    container.innerHTML = "<p>No questions yet.</p>";
    return;
  }

  qa.forEach(q => {
    let qBox = document.createElement("div");
    qBox.className = "qa-question";

    qBox.innerHTML = `
      <div class="qa-text"><strong>${q.question}</strong></div>
      <div class="qa-author">Asked by: ${q.author}</div>

      <div class="qa-replies">
        ${q.replies.map(r => `
          <div class="qa-reply-item">
            <div class="qa-reply-author">${r.author}</div>
            <div>${r.text}</div>
            <button class="note-btn delete" onclick="deleteReply('${q.id}', '${r.id}')">Delete Reply</button>
          </div>
        `).join("")}
      </div>

      <div class="reply-box">
        <input type="text" class="reply-input" id="reply_${q.id}" placeholder="Write a reply...">
        <button class="note-btn" onclick="addReply('${q.id}')">Reply</button>
      </div>

      <button class="note-btn delete" onclick="deleteQuestion('${q.id}')">Delete Question</button>
    `;

    container.appendChild(qBox);
  });
}

function addReply(qid) {
  let qa = load("SBU_QA", "[]");
  let question = qa.find(q => q.id === qid);
  if (!question) return;

  let input = $(`reply_${qid}`);
  let text = input.value.trim();
  if (!text) return alert("Enter a reply before submitting.");

  question.replies.push({
    id: uid(),
    author: "Teacher",
    text,
    createdAt: Date.now()
  });

  save("SBU_QA", qa);
  renderTeacherQA();
}

function deleteReply(qid, rid) {
  let qa = load("SBU_QA", "[]");
  let question = qa.find(q => q.id === qid);
  if (!question) return;

  question.replies = question.replies.filter(r => r.id !== rid);

  save("SBU_QA", qa);
  renderTeacherQA();
}

function deleteQuestion(qid) {
  let qa = load("SBU_QA", "[]");
  qa = qa.filter(q => q.id !== qid);
  save("SBU_QA", qa);
  renderTeacherQA();
}



// =========================================================
// TEACHER PROFILE — VIEW
// =========================================================
function renderTeacherProfile() {
  let profile = load("TEACHER_PROFILE", "{}");

  $("teacherName").textContent = profile.name || "Teacher Name";
  $("teacherEmail").textContent = profile.email || "teacher@example.com";
  $("teacherDept").textContent = profile.department || "Not set";
  $("teacherFacultyId").textContent = profile.facultyId || "Not set";
  $("teacherPhone").textContent = profile.phone || "Not set";
  $("teacherBio").textContent = profile.bio || "No bio added.";
}



// =========================================================
// TEACHER PROFILE — EDIT
// =========================================================
function loadTeacherEditForm() {
  let profile = load("TEACHER_PROFILE", "{}");

  $("tName").value = profile.name || "";
  $("tEmail").value = profile.email || "";
  $("tDept").value = profile.department || "";
  $("tFacultyId").value = profile.facultyId || "";
  $("tPhone").value = profile.phone || "";
  $("tBio").value = profile.bio || "";
}

function saveTeacherProfile(event) {
  event.preventDefault();

  let newProfile = {
    name: $("tName").value,
    email: $("tEmail").value,
    department: $("tDept").value,
    facultyId: $("tFacultyId").value,
    phone: $("tPhone").value,
    bio: $("tBio").value
  };

  save("TEACHER_PROFILE", newProfile);

  alert("Profile updated successfully!");
  goTo("teacher-profile.html");
}
