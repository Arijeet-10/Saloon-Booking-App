// Get elements with null checks
const myButton = document.getElementById("apointmentsbtn");
const myPopup = document.getElementById("myPopup");
const closePopup = document.getElementById("close-btn");
const popbtn2 = document.getElementById("pop-btn2");
const popbtn1 = document.getElementById("pop-btn1");

// Add event listeners with null checks
document.querySelector("#logo")?.addEventListener("click", () => {
    window.location.href = "index.html";
});

if (myButton && myPopup) {
    myButton.onclick = () => {
        myPopup.style.display = "block";
    };
}

if (closePopup && myPopup) {
    closePopup.onclick = () => {
        myPopup.style.display = "none";
    };
}

if (popbtn2) {
    popbtn2.onclick = () => {
        if (confirm("Are you sure you want to cancel this appointment?")) {
            console.log("Appointment cancelled");
        }
    };
}

// Get salon data from sessionStorage
let salonData = JSON.parse(sessionStorage.getItem('selectedSalon')) || {
    name: "Salon Name",
    image: "https://via.placeholder.com/150",
    location: "Salon Location"
};

// Order details with fallbacks
let orderData = JSON.parse(localStorage.getItem("orderData")) || {
    services: [],
    total: 0,
    date: "",
    time: "",
    email: ""
};

// Generate unique booking reference
function generateBookingRef() {
    const date = new Date();
    const timestamp = date.getTime();
    return `BK-${timestamp}-${Math.floor(Math.random() * 1000)}`;
}

// Function to render appointment details
function renderAll(orderStatus) {
    // Status box
    const statusBox = document.querySelector("#status");
    if (statusBox) {
        statusBox.style.backgroundColor = orderStatus ? "green" : "red";
        statusBox.innerHTML = `
            <div style="display: flex">
                <i class="fa ${orderStatus ? 'fa-check' : 'fa-close'}" style="font-size:23px; margin-left: 5px"></i>
                <p>${orderStatus ? 'Confirmed' : 'Canceled'}</p>
            </div>
        `;
    }

    // Order date & time
    const dayElement = document.querySelector("#day");
    if (dayElement && orderData.date && orderData.time) {
        dayElement.innerHTML = `Date: ${orderData.date} At ${orderData.time}`;
    }

    // Salon name
    const salonElement = document.querySelector("#salon");
    if (salonElement) {
        salonElement.innerHTML = salonData.name || "Salon Name";
    }

    // Services details
    const serviceBox = document.querySelector("#service_detail");
    if (serviceBox && orderData.services?.length > 0) {
        serviceBox.innerHTML = orderData.services.map((service) => `
            <div class="apoint-for-child-1">
                <p>${service.servicesName || 'Service'}</p>
                <p>&#8377; <span>${service.price || 0}</span></p>
            </div>
        `).join('');
    }

    // Total amount
    const amo = document.querySelector("#total_amo");
    if (amo) {
        amo.innerHTML = `
            <div class="apoint-for-child-2">
                <h3>total</h3>
                <h3>&#8377; <span>${orderData.total || 0}</span></h3>
            </div>
        `;
    }

    // Booking reference
    const refe = document.querySelector("#ref");
    if (refe) {
        const bookingRef = localStorage.getItem("bookingRef") || generateBookingRef();
        localStorage.setItem("bookingRef", bookingRef);
        refe.innerHTML = `
            <h4>Booking ref : <span>${bookingRef}</span></h4>
        `;
    }

    // Left order details card
    const leftCardOrder = document.querySelector("#ua-data");
    if (leftCardOrder) {
        leftCardOrder.innerHTML = `
            <div style="padding: 5px 0px; cursor: pointer;" class="apointment-card">
                <div class="card-img-div">
                    <img class="salon-img-src" src="${salonData.image}" alt="salon">
                </div>
                <div class="description-div">
                    <p id="l-fix" style="color: ${orderStatus ? 'green' : 'red'};">
                        Date: ${orderData.date} At ${orderData.time}
                    </p>
                    <h4 style="margin-left: 14px; color: blue;">${salonData.name}</h4>
                    <p>Total: ${orderData.total}</p>
                </div>
            </div>
        `;
    }

    // Map
    const map = document.getElementById("map");
    if (map && salonData.location) {
        map.src = `https://maps.google.com/maps?q=${encodeURIComponent(salonData.location)}&t=&z=13&ie=UTF8&iwloc=&output=embed`;
    }
}

// Initialize
let orderStatus = true;
renderAll(orderStatus);

// Cancel order
document.querySelector("#pop-btn2")?.addEventListener("click", () => {
    const spin = document.querySelector("#spinner");
    if (spin) {
        spin.style.display = "block";
    }
    orderStatus = false;
    myPopup.style.display = "none";
    setTimeout(() => {
        if (spin) {
            spin.style.display = "none";
        }
        renderAll(orderStatus);
    }, 2000);
});

// Reschedule Button
document.querySelector("#pop-btn1")?.addEventListener("click", () => {
    window.location.href = "select_time.html";
});

// Send email
async function sendMail() {
    try {
        const response = await fetch("http://localhost:8080/book/appo", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem("token")
            },
            body: JSON.stringify(orderData)
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || "Failed to send email");
        }
    } catch (error) {
        console.error("Error sending email:", error);
        alert("Failed to send confirmation email. Please try again later.");
    }
}

// Send email when page loads
sendMail();