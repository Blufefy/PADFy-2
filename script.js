
 // Get elements
 const noteList = document.getElementById('note-list');
 const noteListItems = document.getElementById('note-list-items');
 const noteScreen = document.getElementById('noteScreen');
 const noteTextarea = document.getElementById('note');
 const mediaUpload = document.getElementById('media-upload');
 const mediaPreviews = document.querySelector('.media-previews');
 const uploadBtn = document.getElementById('upload-btn');
 const submitBtn = document.getElementById('submit-btn');
 const notificationBar = document.getElementById('notificationBar');
 const notificationMessage = document.getElementById('notification-message');
 const newNoteBtn = document.querySelector('.fab');
 const reminderBtn = document.getElementById('set-reminder');
 const moodSelect = document.getElementById('mood');
 const tagSelect = document.getElementById('tag');
 
 const dropdowns = document.querySelectorAll('.dropdown');

 dropdowns.forEach(dropdown => {
     const select = dropdown.querySelector('.select');
     const caret = dropdown.querySelector('.caret');
     const menu = dropdown.querySelector('.menu');
     const options = dropdown.querySelectorAll('.menu li');
     const selected = dropdown.querySelector('.selected');
 
     select.addEventListener('click',() => {
 
         select.classList.toggle('select-clicked');
 
         caret.classList.toggle('caret-rotate');
 
         menu.classList.toggle('menu-open');
     });
  options.forEach(option => { 
     
     option.addEventListener('click', () => {
 
         selected.innerText = option.innerText;
 
         select.classList.remove('select-clicked');
 
         caret.classList.remove('caret.rotate');
     
         menu.classList.remove('menu-open');
 
 options.forEach(option => {
 option.classList.remove('active');
 });
 
 option.classList.add('active');
     });
 });
 });

 // Variables
 let uploadedFiles = [];
 let notes = JSON.parse(localStorage.getItem('notes')) || [];
 let currentNoteIndex = null;

 // Functions
 function showScreen(screen) {
   const screens = ['home', 'folders', 'settings', 'dashboard', 'support', 'noteScreen'];
   screens.forEach((s) => {
     document.getElementById(s).classList.add('hidden');
   });
   document.getElementById(screen).classList.remove('hidden');
 }

 function showNoteEditor(index) {
   if (index !== null) {
     currentNoteIndex = index;
     const note = notes[index];
     noteTextarea.value = note.text;
     mediaPreviews.innerHTML = '';
     uploadedFiles = note.media;
     note.media.forEach((file) => {
       const fileReader = new FileReader();
       fileReader.onload = (event) => {
         const fileData = event.target.result;
         const preview = document.createElement('div');
         preview.classList.add('media-preview');
         if (file.type.startsWith('image/')) {
           preview.innerHTML = `<img src="${fileData}" alt="${file.name}">`;

         } else if (file.type.startsWith('video/')) {
           preview.innerHTML = `<video src="${fileData}" controls></video>`;
         } else if (file.type.startsWith('audio/')) {
           preview.innerHTML = `<audio src="${fileData}" controls></audio>`;
         } else {
           preview.innerHTML = `${file.name} (${file.size} bytes)`;
         }
         const deleteBtn = document.createElement('button');
         deleteBtn.classList.add('delete-btn');
         deleteBtn.textContent = 'Delete';
         deleteBtn.onclick = () => {
           preview.remove();
           uploadedFiles = uploadedFiles.filter((f) => f !== file);
         };
         preview.appendChild(deleteBtn);
         mediaPreviews.appendChild(preview);
       };
       fileReader.readAsDataURL(file);
     });
   } else {
     currentNoteIndex = null;
     noteTextarea.value = '';
     mediaPreviews.innerHTML = '';
     uploadedFiles = [];
   }
   noteScreen.classList.remove('hidden');
 }

 function saveNote() {
   const noteText = noteTextarea.value;
   const note = {
     text: noteText,
     media: uploadedFiles,
   };
   if (currentNoteIndex !== null) {
     notes[currentNoteIndex] = note;
   } else {
     notes.push(note);
   }
   localStorage.setItem('notes', JSON.stringify(notes));
   showNotification('Note saved!');
   noteScreen.classList.add('hidden');
   loadNotes();
 }

 function loadNotes() {
   noteListItems.innerHTML = '';
   notes.forEach((note, index) => {
     const noteItem = document.createElement('li');
     noteItem.textContent = note.text.substring(0, 50) + '...';
     noteItem.onclick = () => showNoteEditor(index);
     noteListItems.appendChild(noteItem);
   });
 }

 function addMedia() {
   mediaUpload.click();
 }

 function handleMediaUpload() {
   const files = mediaUpload.files;
   uploadedFiles = [...uploadedFiles, ...files];
   mediaPreviews.innerHTML = '';
   uploadedFiles.forEach((file) => {
     const fileReader = new FileReader();
     fileReader.onload = (event) => {
       const fileData = event.target.result;
       const preview = document.createElement('div');
       preview.classList.add('media-preview');
       if (file.type.startsWith('image/')) {
         preview.innerHTML = `<img src="${fileData}" alt="${file.name}">`;
       } else if (file.type.startsWith('video/')) {
         preview.innerHTML = `<video src="${fileData}" controls></video>`;
       } else if (file.type.startsWith('audio/')) {
         preview.innerHTML = `<audio src="${fileData}" controls></audio>`;
       } else {
         preview.innerHTML = `${file.name} (${file.size} bytes)`;
       }
       const deleteBtn = document.createElement('button');
       deleteBtn.classList.add('delete-btn');
       deleteBtn.textContent = 'Delete';
       deleteBtn.onclick = () => {
         preview.remove();
         uploadedFiles = uploadedFiles.filter((f) => f !== file);
       };
       preview.appendChild(deleteBtn);
       mediaPreviews.appendChild(preview);
     };
     fileReader.readAsDataURL(file);
   });
 }

 function setReminder() {
   const reminderTime = prompt("Enter reminder time (HH:MM)");
   if (reminderTime) {
     // Set reminder logic here
     showNotification(`Reminder set for ${reminderTime}`);
   }
 }

 function shareNote() {
   const noteText = noteTextarea.value;
   const noteMedia = uploadedFiles;
   // Share note logic here
   showNotification("Note shared!");
 }

 function updateMood() {
   const mood = moodSelect.value;
   noteTextarea.style.backgroundColor = mood;
 }

 function updateTag() {
   const tag = tagSelect.value;
   noteTextarea.style.color = tag;
 }

 function formatText(action) {
   document.execCommand(action, false, null);
 }

 function changeTheme(theme) {
   document.body.classList.remove('light', 'dark');
   document.body.classList.add(theme);
 }

 function showNotification(message) {
   notificationMessage.textContent = message;
   notificationBar.classList.remove('hidden');
   setTimeout(() => {
     notificationBar.classList.add('hidden');
   }, 3000);
 }

 // Event listeners
 newNoteBtn.addEventListener('click', () => showNoteEditor(null));
 submitBtn.addEventListener('click', saveNote);
 uploadBtn.addEventListener('click', addMedia);
 mediaUpload.addEventListener('change', handleMediaUpload);
 reminderBtn.addEventListener('click', setReminder);
 moodSelect.addEventListener('change', updateMood);
 tagSelect.addEventListener('change', updateTag);
 document.addEventListener('DOMContentLoaded', loadNotes);