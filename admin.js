document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const loginPage = document.getElementById('login-page');
    const adminDashboard = document.getElementById('admin-dashboard');
    const loginError = document.getElementById('loginError');
    const adminLogout = document.getElementById('adminLogout');
    const sidebarNavLinks = document.querySelectorAll('.sidebar .nav-link');
    const adminSections = document.querySelectorAll('.admin-section');

    const defaultAdminUser = 'admin';
    const defaultAdminPass = 'admin123';

    // --- Admin Login/Logout Logic ---
    function checkLoginStatus() {
        if (localStorage.getItem('adminLoggedIn') === 'true') {
            loginPage.classList.add('d-none');
            adminDashboard.classList.remove('d-none');
            loadAdminContent(); // Load content when dashboard is visible
        } else {
            loginPage.classList.remove('d-none');
            adminDashboard.classList.add('d-none');
        }
    }

    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        if (username === defaultAdminUser && password === defaultAdminPass) {
            localStorage.setItem('adminLoggedIn', 'true');
            loginError.classList.add('d-none');
            checkLoginStatus();
        } else {
            loginError.classList.remove('d-none');
        }
    });

    adminLogout.addEventListener('click', function(e) {
        e.preventDefault();
        localStorage.removeItem('adminLoggedIn');
        checkLoginStatus();
    });

    // --- Admin Dashboard Navigation ---
    sidebarNavLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            sidebarNavLinks.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');

            const targetSection = this.dataset.section;
            adminSections.forEach(section => {
                if (section.id === targetSection + '-section') {
                    section.classList.add('active');
                } else {
                    section.classList.remove('active');
                }
            });
            loadAdminContentForSection(targetSection); // Load content specific to the selected section
        });
    });

    // --- Load/Save Admin Content ---

    // Initial content population
    function loadAdminContent() {
        // Default to 'Manage Home' section if no specific section is active
        const activeLink = document.querySelector('.sidebar .nav-link.active');
        const targetSection = activeLink ? activeLink.dataset.section : 'home';
        loadAdminContentForSection(targetSection);
    }

    function loadAdminContentForSection(sectionName) {
        switch (sectionName) {
            case 'home':
                loadSliderImages();
                loadTestimonials();
                break;
            case 'about':
                loadAboutContent();
                break;
            case 'workshops':
                loadWorkshops();
                break;
            case 'services':
                loadServices();
                break;
            case 'contact-submissions':
                loadContactSubmissions();
                break;
        }
    }

    // --- Manage Home ---
    const sliderImageUpload = document.getElementById('sliderImageUpload');
    const addSliderImageButton = document.getElementById('addSliderImage');
    const currentSliderImagesDiv = document.getElementById('currentSliderImages');
    let sliderImages = JSON.parse(localStorage.getItem('sliderImages')) || [];

    function loadSliderImages() {
        currentSliderImagesDiv.innerHTML = '';
        if (sliderImages.length === 0) {
            currentSliderImagesDiv.innerHTML = '<p class="text-muted">No slider images uploaded yet.</p>';
            return;
        }
        sliderImages.forEach((imageUrl, index) => {
            const col = document.createElement('div');
            col.className = 'col-md-3 col-sm-6 mb-3 slider-image-item';
            col.innerHTML = `
                <img src="${imageUrl}" alt="Slider Image ${index + 1}" class="img-fluid">
                <button class="delete-img" data-index="${index}">&times;</button>
            `;
            currentSliderImagesDiv.appendChild(col);
        });
        document.querySelectorAll('.delete-img').forEach(button => {
            button.addEventListener('click', deleteSliderImage);
        });
    }

    addSliderImageButton.addEventListener('click', function() {
        const files = sliderImageUpload.files;
        if (files.length === 0) {
            alert('Please select images to upload.');
            return;
        }

        Array.from(files).forEach(file => {
            const reader = new FileReader();
            reader.onload = function(e) {
                sliderImages.push(e.target.result); // Store as Base64 for simplicity
                localStorage.setItem('sliderImages', JSON.stringify(sliderImages));
                loadSliderImages();
            };
            reader.readAsDataURL(file);
        });
        sliderImageUpload.value = ''; // Clear input
    });

    function deleteSliderImage(e) {
        const indexToDelete = e.target.dataset.index;
        sliderImages.splice(indexToDelete, 1);
        localStorage.setItem('sliderImages', JSON.stringify(sliderImages));
        loadSliderImages();
    }


    const testimonialForm = document.getElementById('testimonialForm');
    const testimonialsList = document.getElementById('testimonialsList');
    let testimonials = JSON.parse(localStorage.getItem('testimonials')) || [];

    function loadTestimonials() {
        testimonialsList.innerHTML = '';
        if (testimonials.length === 0) {
            testimonialsList.innerHTML = '<li class="list-group-item text-muted">No testimonials added yet.</li>';
            return;
        }
        testimonials.forEach((testimonial, index) => {
            const li = document.createElement('li');
            li.className = 'list-group-item d-flex justify-content-between align-items-center';
            li.innerHTML = `
                <div>
                    <p class="mb-1 fst-italic">"${testimonial.text}"</p>
                    <small class="text-muted">- ${testimonial.author}, ${testimonial.source}</small>
                </div>
                <button class="btn btn-danger btn-sm delete-testimonial" data-index="${index}"><i class="fas fa-trash"></i></button>
            `;
            testimonialsList.appendChild(li);
        });
        document.querySelectorAll('.delete-testimonial').forEach(button => {
            button.addEventListener('click', deleteTestimonial);
        });
    }

    testimonialForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const text = document.getElementById('testimonialText').value;
        const author = document.getElementById('testimonialAuthor').value;
        const source = document.getElementById('testimonialSource').value;
        testimonials.push({ text, author, source });
        localStorage.setItem('testimonials', JSON.stringify(testimonials));
        testimonialForm.reset();
        loadTestimonials();
    });

    function deleteTestimonial(e) {
        const indexToDelete = e.target.closest('button').dataset.index;
        testimonials.splice(indexToDelete, 1);
        localStorage.setItem('testimonials', JSON.stringify(testimonials));
        loadTestimonials();
    }

    // --- Manage About ---
    const aboutForm = document.getElementById('aboutForm');
    const aboutContentTextarea = document.getElementById('aboutContent');

    function loadAboutContent() {
        aboutContentTextarea.value = localStorage.getItem('aboutContent') || `Founded in 20XX, our Coaching Center was established with a clear vision: to provide exceptional educational support and empower students to achieve their academic aspirations. We believe that every student has unique potential, and with the right guidance and resources, they can overcome challenges and excel.

Over the years, we have grown into a leading institution, known for our dedicated team of experienced educators, innovative teaching methodologies, and a student-centric approach. We continuously adapt our programs to meet the evolving demands of various educational boards and competitive examinations.

Our mission is to foster a stimulating and supportive learning environment where students can develop critical thinking skills, build a strong knowledge base, and gain the confidence needed to succeed in their academic and future endeavors. We aim to nurture not just bright students, but well-rounded individuals.

Our Values:
- Excellence: Striving for the highest standards in education.
- Integrity: Upholding honesty and ethical practices.
- Guidance: Providing personalized support and mentorship.
- Passion: Inspiring a love for learning in every student.`;
    }

    aboutForm.addEventListener('submit', function(e) {
        e.preventDefault();
        localStorage.setItem('aboutContent', aboutContentTextarea.value);
        alert('About page content saved successfully!');
    });

    // --- Manage Workshops ---
    const addWorkshopForm = document.getElementById('addWorkshopForm');
    const workshopsTableBody = document.querySelector('#workshopsTable tbody');
    let workshops = JSON.parse(localStorage.getItem('workshops')) || [];

    function loadWorkshops() {
        workshopsTableBody.innerHTML = '';
        if (workshops.length === 0) {
            workshopsTableBody.innerHTML = '<tr><td colspan="5" class="text-center text-muted">No workshops added yet.</td></tr>';
            return;
        }
        workshops.forEach((workshop, index) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${workshop.title}</td>
                <td>${workshop.date}</td>
                <td>${workshop.time}</td>
                <td>${workshop.instructor}</td>
                <td>
                    <button class="btn btn-warning btn-sm edit-workshop me-2" data-index="${index}"><i class="fas fa-edit"></i></button>
                    <button class="btn btn-danger btn-sm delete-workshop" data-index="${index}"><i class="fas fa-trash"></i></button>
                </td>
            `;
            workshopsTableBody.appendChild(tr);
        });
        document.querySelectorAll('.edit-workshop').forEach(button => {
            button.addEventListener('click', editWorkshop);
        });
        document.querySelectorAll('.delete-workshop').forEach(button => {
            button.addEventListener('click', deleteWorkshop);
        });
    }

    addWorkshopForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const newWorkshop = {
            id: Date.now(), // Simple unique ID
            title: document.getElementById('workshopTitle').value,
            date: document.getElementById('workshopDate').value,
            time: document.getElementById('workshopTime').value,
            instructor: document.getElementById('workshopInstructor').value,
            description: document.getElementById('workshopDescription').value
        };
        workshops.push(newWorkshop);
        localStorage.setItem('workshops', JSON.stringify(workshops));
        addWorkshopForm.reset();
        loadWorkshops();
    });

    function editWorkshop(e) {
        const indexToEdit = e.target.closest('button').dataset.index;
        const workshopToEdit = workshops[indexToEdit];

        // Populate the form for editing (simple implementation)
        document.getElementById('workshopTitle').value = workshopToEdit.title;
        document.getElementById('workshopDate').value = workshopToEdit.date;
        document.getElementById('workshopTime').value = workshopToEdit.time;
        document.getElementById('workshopInstructor').value = workshopToEdit.instructor;
        document.getElementById('workshopDescription').value = workshopToEdit.description;

        // Change button to update
        addWorkshopForm.querySelector('button[type="submit"]').textContent = 'Update Workshop';
        addWorkshopForm.removeEventListener('submit', addWorkshopForm._submitHandler); // Remove old handler if any
        addWorkshopForm._submitHandler = function(e) {
            e.preventDefault();
            workshopToEdit.title = document.getElementById('workshopTitle').value;
            workshopToEdit.date = document.getElementById('workshopDate').value;
            workshopToEdit.time = document.getElementById('workshopTime').value;
            workshopToEdit.instructor = document.getElementById('workshopInstructor').value;
            workshopToEdit.description = document.getElementById('workshopDescription').value;
            localStorage.setItem('workshops', JSON.stringify(workshops));
            addWorkshopForm.reset();
            loadWorkshops();
            addWorkshopForm.querySelector('button[type="submit"]').textContent = 'Add Workshop';
            addWorkshopForm.removeEventListener('submit', addWorkshopForm._submitHandler);
            addWorkshopForm.addEventListener('submit', addWorkshopForm._defaultSubmitHandler); // Re-add original handler
        };
        addWorkshopForm.addEventListener('submit', addWorkshopForm._submitHandler);
    }
    // Store default handler
    addWorkshopForm._defaultSubmitHandler = addWorkshopForm.onsubmit;


    function deleteWorkshop(e) {
        const indexToDelete = e.target.closest('button').dataset.index;
        workshops.splice(indexToDelete, 1);
        localStorage.setItem('workshops', JSON.stringify(workshops));
        loadWorkshops();
    }

    // --- Manage Services ---
    const addServiceForm = document.getElementById('addServiceForm');
    const servicesTableBody = document.querySelector('#servicesTable tbody');
    let services = JSON.parse(localStorage.getItem('services')) || [];

    function loadServices() {
        servicesTableBody.innerHTML = '';
        if (services.length === 0) {
            servicesTableBody.innerHTML = '<tr><td colspan="4" class="text-center text-muted">No services added yet.</td></tr>';
            return;
        }
        services.forEach((service, index) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><i class="${service.icon} fa-lg"></i></td>
                <td>${service.title}</td>
                <td>${service.description}</td>
                <td>
                    <button class="btn btn-warning btn-sm edit-service me-2" data-index="${index}"><i class="fas fa-edit"></i></button>
                    <button class="btn btn-danger btn-sm delete-service" data-index="${index}"><i class="fas fa-trash"></i></button>
                </td>
            `;
            servicesTableBody.appendChild(tr);
});
document.querySelectorAll('.edit-service').forEach(button => {
button.addEventListener('click', editService);
});
document.querySelectorAll('.delete-service').forEach(button => {
button.addEventListener('click', deleteService);
});
}
addServiceForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const newService = {
        icon: document.getElementById('serviceIcon').value,
        title: document.getElementById('serviceTitle').value,
        description: document.getElementById('serviceDescription').value
    };
    services.push(newService);
    localStorage.setItem('services', JSON.stringify(services));
    addServiceForm.reset();
    loadServices();
});

function editService(e) {
    const indexToEdit = e.target.closest('button').dataset.index;
    const serviceToEdit = services[indexToEdit];

    document.getElementById('serviceIcon').value = serviceToEdit.icon;
    document.getElementById('serviceTitle').value = serviceToEdit.title;
    document.getElementById('serviceDescription').value = serviceToEdit.description;

    addServiceForm.querySelector('button[type="submit"]').textContent = 'Update Service';
    addServiceForm.removeEventListener('submit', addServiceForm._submitHandler);
    addServiceForm._submitHandler = function(e) {
        e.preventDefault();
        serviceToEdit.icon = document.getElementById('serviceIcon').value;
        serviceToEdit.title = document.getElementById('serviceTitle').value;
        serviceToEdit.description = document.getElementById('serviceDescription').value;
        localStorage.setItem('services', JSON.stringify(services));
        addServiceForm.reset();
        loadServices();
        addServiceForm.querySelector('button[type="submit"]').textContent = 'Add Service';
        addServiceForm.removeEventListener('submit', addServiceForm._submitHandler);
        addServiceForm.addEventListener('submit', addServiceForm._defaultSubmitHandler);
    };
    addServiceForm.addEventListener('submit', addServiceForm._submitHandler);
}
addServiceForm._defaultSubmitHandler = addServiceForm.onsubmit;


function deleteService(e) {
    const indexToDelete = e.target.closest('button').dataset.index;
    services.splice(indexToDelete, 1);
    localStorage.setItem('services', JSON.stringify(services));
    loadServices();
}

// --- Manage Contact Submissions ---
const submissionsTableBody = document.querySelector('#submissionsTable tbody');
const clearSubmissionsButton = document.getElementById('clearSubmissions');

function loadContactSubmissions() {
    const submissions = JSON.parse(localStorage.getItem('contactSubmissions')) || [];
    submissionsTableBody.innerHTML = '';
    if (submissions.length === 0) {
        submissionsTableBody.innerHTML = '<tr><td colspan="5" class="text-center text-muted">No contact form submissions yet.</td></tr>';
        return;
    }
    submissions.forEach(submission => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${submission.timestamp}</td>
            <td>${submission.name}</td>
            <td>${submission.email}</td>
            <td>${submission.phone || 'N/A'}</td>
            <td>${submission.message}</td>
        `;
        submissionsTableBody.appendChild(tr);
    });
}

clearSubmissionsButton.addEventListener('click', function() {
    if (confirm('Are you sure you want to clear all contact form submissions? This action cannot be undone.')) {
        localStorage.removeItem('contactSubmissions');
        loadContactSubmissions();
    }
});


// Initialize
checkLoginStatus();
});