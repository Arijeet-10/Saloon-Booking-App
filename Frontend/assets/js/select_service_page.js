let total = 0;
let allServices = document.getElementById("left");
let addedServices = document.getElementById("added1");
let totalAmt = document.getElementById("total");

// Get salon data from sessionStorage
let salonData = JSON.parse(sessionStorage.getItem('selectedSalon'));
if (!salonData) {
    alert('No salon data found');
    window.location.href = 'productPage.html';
}

// Display salon information
let shopImage = document.getElementById("ad1");
let shopName = document.getElementById("ad2");
let shopAddress = document.getElementById("ad3");

shopImage.src = salonData.image || 'https://plus.unsplash.com/premium_photo-1661764393655-667ecb7d63c0?q=80&w=2070&auto=format&fit=crop';
shopName.textContent = salonData.name || 'No Name Available';
shopAddress.textContent = salonData.location || 'No Location Available';

// Initialize upcoming services object
let upcoming = {
    services: [],
    total: 0
};

// Load existing services if any
let storedUpcoming = JSON.parse(localStorage.getItem("upcoming"));
if (storedUpcoming && storedUpcoming.services.length > 0) {
    upcoming = storedUpcoming;
    updateTotal();
    renderAddedServices();
}

// Function to update total amount
function updateTotal() {
    totalAmt.textContent = `Rs. ${upcoming.total}/-`;
}

// Function to render added services
function renderAddedServices() {
    addedServices.innerHTML = '';
    
    upcoming.services.forEach((service) => {
        let serviceDiv = document.createElement("div");
        serviceDiv.className = "added-service";
        
        let serviceName = document.createElement("h3");
        serviceName.textContent = service.serviceName;
        
        let servicePrice = document.createElement("h3");
        servicePrice.textContent = service.price;
        
        serviceDiv.appendChild(serviceName);
        serviceDiv.appendChild(servicePrice);
        addedServices.appendChild(serviceDiv);
    });
}

// Function to append services
function appendServices(data) {
    allServices.innerHTML = '';
    
    data.services.forEach((service) => {
        let serviceDiv = document.createElement("div");
        serviceDiv.className = "service-card";
        
        let checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.className = "service-checkbox";
        
        let serviceName = document.createElement("h3");
        serviceName.textContent = service.servicesName;
        
        let servicePrice = document.createElement("h3");
        servicePrice.textContent = `Rs. ${parseFloat(service.price)}/-`;
        
        serviceDiv.appendChild(checkbox);
        serviceDiv.appendChild(serviceName);
        serviceDiv.appendChild(servicePrice);
        
        checkbox.addEventListener("change", (event) => {
            if (event.target.checked) {
                let serviceObj = {
                    serviceName: service.servicesName,
                    price: `Rs. ${parseFloat(service.price)}/-`
                };
                upcoming.services.push(serviceObj);
                upcoming.total += parseFloat(service.price);
                updateTotal();
                renderAddedServices();
            } else {
                let index = upcoming.services.findIndex(s => s.serviceName === service.servicesName);
                if (index !== -1) {
                    upcoming.total -= parseFloat(service.price);
                    upcoming.services.splice(index, 1);
                    updateTotal();
                    renderAddedServices();
                }
            }
        });
        
        allServices.appendChild(serviceDiv);
    });
}

// Initialize the page
appendServices(salonData);

// Add event listener for booking button
document.querySelector("#book>button").addEventListener("click", () => {
    if (upcoming.services.length === 0) {
        alert('Please select at least one service');
        return;
    }
    
    // Store selected services and total amount
    localStorage.setItem('upcoming', JSON.stringify(upcoming));
    localStorage.setItem('totalamount', JSON.stringify(upcoming.total));
    
    // Redirect to time selection page
    window.location.href = 'select_time.html';
});
