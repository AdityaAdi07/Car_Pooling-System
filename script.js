// API endpoints
const API_ENDPOINTS = {
    SEARCH: '/api/search',
    ALL_CARPOOLS: '/api/carpools',
    CARPOOL_DETAILS: '/api/carpools'
};

// Fallback data in case API is not available
const fallbackCarpoolData = [
    {
        sl_no: 1,
        pickup_location: "Bangalore",
        dropoff_location: "Mysore",
        passenger_count: 3,
        driver_name: "Aditya Sharma",
        vehicle_type: "Sedan",
        departure_time: "08:00 AM",
        estimated_arrival: "10:30 AM",
        fare: "₹350 per person",
        available_seats: 2,
        contact_number: "+91 9876543210",
        vehicle_number: "KA 01 AB 1234",
        rating: 4.8
    },
    {
        sl_no: 2,
        pickup_location: "Bangalore",
        dropoff_location: "Mysore",
        passenger_count: 4,
        driver_name: "Priya Patel",
        vehicle_type: "SUV",
        departure_time: "09:30 AM",
        estimated_arrival: "12:00 PM",
        fare: "₹300 per person",
        available_seats: 3,
        contact_number: "+91 9876543211",
        vehicle_number: "KA 02 CD 5678",
        rating: 4.5
    },
    {
        sl_no: 3,
        pickup_location: "Bangalore",
        dropoff_location: "Chennai",
        passenger_count: 2,
        driver_name: "Rahul Verma",
        vehicle_type: "Hatchback",
        departure_time: "07:00 AM",
        estimated_arrival: "01:30 PM",
        fare: "₹800 per person",
        available_seats: 3,
        contact_number: "+91 9876543212",
        vehicle_number: "KA 03 EF 9012",
        rating: 4.7
    },
    {
        sl_no: 4,
        pickup_location: "Mysore",
        dropoff_location: "Bangalore",
        passenger_count: 3,
        driver_name: "Sneha Reddy",
        vehicle_type: "Sedan",
        departure_time: "06:00 PM",
        estimated_arrival: "08:30 PM",
        fare: "₹350 per person",
        available_seats: 2,
        contact_number: "+91 9876543213",
        vehicle_number: "KA 05 GH 3456",
        rating: 4.9
    },
    {
        sl_no: 5,
        pickup_location: "Chennai",
        dropoff_location: "Bangalore",
        passenger_count: 4,
        driver_name: "Vikram Singh",
        vehicle_type: "SUV",
        departure_time: "08:00 AM",
        estimated_arrival: "02:30 PM",
        fare: "₹850 per person",
        available_seats: 3,
        contact_number: "+91 9876543214",
        vehicle_number: "TN 01 IJ 7890",
        rating: 4.6
    }
];

// DOM Elements
document.addEventListener('DOMContentLoaded', function() {
    // Navigation
    const mobileMenu = document.querySelector('.mobile-menu');
    const navLinks = document.querySelector('nav ul');
    
    // Search Form
    const searchBtn = document.getElementById('search-btn');
    const pickupInput = document.getElementById('pickup');
    const dropoffInput = document.getElementById('dropoff');
    const resultsContainer = document.getElementById('results-container');
    const resultsBody = document.getElementById('results-body');
    const noResults = document.getElementById('no-results');
    
    // Modal
    const detailsModal = document.getElementById('details-modal');
    const closeModal = document.querySelector('.close-modal');
    const detailsBody = document.getElementById('details-body');
    const bookRideBtn = document.getElementById('book-ride');
    const closeDetailsBtn = document.getElementById('close-details');
    
    // Contact Form
    const contactForm = document.getElementById('contact-form');
    const newsletterForm = document.getElementById('newsletter-form');

    // Mobile Menu Toggle
    if (mobileMenu) {
        mobileMenu.addEventListener('click', () => {
            navLinks.classList.toggle('show');
        });
    }

    // Smooth Scrolling for Navigation Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
                
                // Update active link
                document.querySelectorAll('nav ul li a').forEach(link => {
                    link.classList.remove('active');
                });
                this.classList.add('active');
                
                // Hide mobile menu after clicking
                if (navLinks.classList.contains('show')) {
                    navLinks.classList.remove('show');
                }
            }
        });
    });

    // Search Functionality
    if (searchBtn) {
        searchBtn.addEventListener('click', searchCarpool);
    }

    function searchCarpool() {
        const pickup = pickupInput.value.trim().charAt(0).toUpperCase() + pickupInput.value.trim().slice(1);
        const dropoff = dropoffInput.value.trim().charAt(0).toUpperCase() + dropoffInput.value.trim().slice(1);
        
        if (!pickup || !dropoff) {
            alert('Please enter both pickup and drop-off locations');
            return;
        }
        
        // Show loading state
        resultsBody.innerHTML = '<tr><td colspan="5" class="text-center">Searching for carpools...</td></tr>';
        noResults.classList.add('hidden');
        resultsContainer.classList.remove('hidden');
        
        // Try to fetch from API
        fetch(`${API_ENDPOINTS.SEARCH}?pickup=${encodeURIComponent(pickup)}&dropoff=${encodeURIComponent(dropoff)}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(matches => {
                displaySearchResults(matches);
            })
            .catch(error => {
                console.error('Error fetching search results:', error);
                
                // Fallback to local data if API fails
                const matches = fallbackCarpoolData.filter(carpool => 
                    carpool.pickup_location === pickup && 
                    carpool.dropoff_location === dropoff
                );
                
                displaySearchResults(matches);
            });
        
        // Clear previous results
        resultsBody.innerHTML = '';
        
    function displaySearchResults(matches) {
        if (matches.length > 0) {
            // Show results
            noResults.classList.add('hidden');
            resultsContainer.classList.remove('hidden');
            
            // Clear previous results
            resultsBody.innerHTML = '';
            
            // Populate results table
            matches.forEach(carpool => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${carpool.sl_no}</td>
                    <td>${carpool.pickup_location}</td>
                    <td>${carpool.dropoff_location}</td>
                    <td>${carpool.passenger_count}</td>
                    <td><button class="btn btn-primary view-details" data-id="${carpool.sl_no}">View Details</button></td>
                `;
                resultsBody.appendChild(row);
            });
            
            // Add event listeners to view details buttons
            document.querySelectorAll('.view-details').forEach(button => {
                button.addEventListener('click', function() {
                    const carpoolId = parseInt(this.getAttribute('data-id'));
                    showCarpoolDetails(carpoolId);
                });
            });
            
            // Scroll to results
            resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
            // Show no results message
            noResults.classList.remove('hidden');
            resultsContainer.classList.add('hidden');
            
            // Scroll to no results message
            noResults.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
    }

    // Show Carpool Details
    function showCarpoolDetails(carpoolId) {
        // Show loading state in modal
        detailsBody.innerHTML = '<tr><td colspan="2" class="text-center">Loading carpool details...</td></tr>';
        detailsModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        // Try to fetch from API first
        fetch(`${API_ENDPOINTS.CARPOOL_DETAILS}/${carpoolId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(carpool => {
                displayCarpoolDetails(carpool);
            })
            .catch(error => {
                console.error('Error fetching carpool details:', error);
                
                // Fallback to local data if API fails
                const carpool = fallbackCarpoolData.find(item => item.sl_no === carpoolId);
                
                if (carpool) {
                    displayCarpoolDetails(carpool);
                } else {
                    detailsBody.innerHTML = '<tr><td colspan="2" class="text-center">Error loading carpool details. Please try again.</td></tr>';
                }
            });
    }
    
    function displayCarpoolDetails(carpool) {
        // Clear previous details
        detailsBody.innerHTML = '';
        
        // Add all carpool details to the table
        for (const [key, value] of Object.entries(carpool)) {
            const formattedKey = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
            
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><strong>${formattedKey}</strong></td>
                <td>${value}</td>
            `;
            detailsBody.appendChild(row);
        }
    }

    // Close Modal
    if (closeModal) {
        closeModal.addEventListener('click', closeDetailsModal);
    }
    
    if (closeDetailsBtn) {
        closeDetailsBtn.addEventListener('click', closeDetailsModal);
    }
    
    function closeDetailsModal() {
        detailsModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === detailsModal) {
            closeDetailsModal();
        }
    });

    // Book Ride Button
    if (bookRideBtn) {
        bookRideBtn.addEventListener('click', function() {
            alert('Booking successful! The driver will contact you shortly.');
            closeDetailsModal();
        });
    }

    // Contact Form Submission
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('name').value;
            alert(`Thank you, ${name}! Your message has been sent. We'll get back to you soon.`);
            contactForm.reset();
        });
    }

    // Newsletter Form Submission
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Thank you for subscribing to our newsletter!');
            newsletterForm.reset();
        });
    }

    // Scroll Event for Header
    window.addEventListener('scroll', function() {
        const header = document.querySelector('header');
        if (window.scrollY > 50) {
            header.style.padding = '10px 0';
            header.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.padding = '15px 0';
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        }
    });

    // Set active nav link based on scroll position
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('section');
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (window.scrollY >= (sectionTop - 100)) {
                current = section.getAttribute('id');
            }
        });
        
        document.querySelectorAll('nav ul li a').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
});
