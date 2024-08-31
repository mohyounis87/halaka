// script.js

document.addEventListener('DOMContentLoaded', function() {
    const tableBody = document.querySelector('#students-table tbody');
    const addStudentBtn = document.querySelector('#add-student-btn');
    const searchInput = document.querySelector('#search-input');
    const studentModal = document.querySelector('#student-modal');
    const closeBtn = document.querySelector('.close-btn');
    const studentForm = document.querySelector('#student-form');
    const modalTitle = document.querySelector('#modal-title');
    const saveBtn = document.querySelector('#save-btn');
    const cancelBtn = document.querySelector('#cancel-btn');

    let studentsData = [];
    let editIndex = null;

    // Load data from Local Storage if available
    if (localStorage.getItem('studentsData')) {
        studentsData = JSON.parse(localStorage.getItem('studentsData'));
    } else {
        // Default data with one student
        studentsData = [
            { fullName: 'أحمد علي', age: 12, partsMemorized: 5, partBeingTested: 'الجزء السادس', enrollmentDate: '2024-06-01' }
        ];
    }

    // Populate age options
    function populateAgeOptions() {
        const ageSelect = document.querySelector('#age');
        for (let i = 4; i <= 50; i++) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = i;
            ageSelect.appendChild(option);
        }
    }

    // Populate part options
    function populatePartOptions() {
        const partSelect = document.querySelector('#partBeingTested');
        for (let i = 1; i <= 30; i++) {
            const option = document.createElement('option');
            option.value = `الجزء ${i}`;
            option.textContent = `الجزء ${i}`;
            partSelect.appendChild(option);
        }
    }

    // Populate table with initial data
    function populateTable(data) {
        tableBody.innerHTML = '';

        data.forEach((student, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${student.fullName}</td>
                <td>${student.age}</td>
                <td>${student.partsMemorized}</td>
                <td>${student.partBeingTested}</td>
                <td>${student.enrollmentDate}</td>
                <td class="action-buttons">
                    <button class="edit-btn" onclick="editStudent(${index})">تعديل</button>
                    <button class="delete-btn" onclick="deleteStudent(${index})">حذف</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    }

    // Show modal window
    function showModal(editMode = false) {
        if (editMode) {
            modalTitle.textContent = 'تعديل بيانات الطالب';
        } else {
            modalTitle.textContent = 'إضافة طالب جديد';
        }
        studentModal.style.display = 'block';
    }

    // Hide modal window
    function hideModal() {
        studentModal.style.display = 'none';
        studentForm.reset();
    }

    // Add new student
    addStudentBtn.addEventListener('click', function() {
        editIndex = null;
        showModal();
    });

    // Edit student
    window.editStudent = function(index) {
        editIndex = index;
        const student = studentsData[index];
        document.querySelector('#fullName').value = student.fullName;
        document.querySelector('#age').value = student.age;
        document.querySelector('#partsMemorized').value = student.partsMemorized;
        document.querySelector('#partBeingTested').value = student.partBeingTested;
        document.querySelector('#enrollmentDate').value = student.enrollmentDate;
        showModal(true);
    };

    // Delete student
    window.deleteStudent = function(index) {
        if (confirm('هل أنت متأكد من حذف هذا الطالب؟')) {
            studentsData.splice(index, 1);
            populateTable(studentsData);
            saveDataToLocalStorage();
        }
    };

    // Save student data
    studentForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const newStudent = {
            fullName: document.querySelector('#fullName').value,
            age: parseInt(document.querySelector('#age').value),
            partsMemorized: parseInt(document.querySelector('#partsMemorized').value),
            partBeingTested: document.querySelector('#partBeingTested').value,
            enrollmentDate: document.querySelector('#enrollmentDate').value
        };

        if (editIndex !== null) {
            studentsData[editIndex] = newStudent;
        } else {
            studentsData.push(newStudent);
        }

        populateTable(studentsData);
        saveDataToLocalStorage();
        hideModal();
    });

    // Hide modal on cancel button click
    cancelBtn.addEventListener('click', function() {
        hideModal();
    });

    // Hide modal on close button click
    closeBtn.addEventListener('click', function() {
        hideModal();
    });

    // Hide modal when clicking outside of it
    window.addEventListener('click', function(event) {
        if (event.target === studentModal) {
            hideModal();
        }
    });

    // Search students
    searchInput.addEventListener('input', function() {
        const searchTerm = searchInput.value.trim().toLowerCase();
        const filteredStudents = studentsData.filter(student =>
            student.fullName.toLowerCase().includes(searchTerm) ||
            student.partBeingTested.toLowerCase().includes(searchTerm)
        );
        populateTable(filteredStudents);
    });

    // Save data to Local Storage
    function saveDataToLocalStorage() {
        localStorage.setItem('studentsData', JSON.stringify(studentsData));
    }

    // Populate age options on page load
    populateAgeOptions();

    // Populate part options on page load
    populatePartOptions();

    // Populate table with initial data on page load
    populateTable(studentsData);
});