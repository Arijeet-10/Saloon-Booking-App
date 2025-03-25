let shpname = JSON.parse(localStorage.getItem("shopDetails")) || {
    image: 'https://via.placeholder.com/150',
    name: 'Salon Name',
    location: 'Salon Location'
};

let past_data = JSON.parse(localStorage.getItem("upcoming")) || { services: [], total: 0 };
let cu_email = localStorage.getItem("email") || 'guest@example.com';
console.log("past", past_data);

let simage = document.getElementById("ad1");
simage.style.width = "150px";
simage.style.marginTop = "10px";
simage.src = shpname["image"];
let sname = document.getElementById("ad2");
sname.innerText = shpname["name"];
let sadd = document.getElementById("ad3");
sadd.innerText = shpname["location"];

let total = document.getElementById("total");
let totalamount = JSON.parse(localStorage.getItem("totalamount"));
total.innerText = `Rs. ${totalamount}.00/-`;

const startdate = document.getElementById("startDate");

let selecttime = document.getElementById("sltime");
let choosedate = document.getElementById("choose");

let append = (data) => {
  data.forEach((el) => {
    let div1 = document.createElement("div");
    div1.setAttribute("id", "timelist");

    let time = document.createElement("h4");
    time.setAttribute("id", "selectedtime");
    time.innerText = `${el}`;

    div1.addEventListener("click", function() {
      if (!startdate.value) {
        choosedate.style.color = "#D50000";
        choosedate.style.textShadow = "1px 1px black";
        choosedate.textContent = "⚠️ Please Select The Date";
        return;
      }
      
      // Remove active class from all time cards
      document.querySelectorAll('#timelist').forEach(card => {
        card.classList.remove('active');
      });
      
      // Add active class to selected time card
      div1.classList.add('active');
      
      choosedate.style.color = "#00C853";
      choosedate.style.textShadow = "1px 1px black";
      choosedate.textContent = "✓ Awesome";
      
      past_data["time"] = el;
      past_data["date"] = startdate.value;
      past_data["email"] = cu_email;
      past_data["salon"] = shpname;
      localStorage.setItem("orderData", JSON.stringify(past_data));
      
      setTimeout(() => {
        window.location.href = "./confirmation_page.html";
      }, 2000);
    });

    div1.append(time);
    selecttime.append(div1);
  });
};

let data = JSON.parse(localStorage.getItem("shopDetails")) || {
    availableTime: [
        "10:00 AM",
        "10:30 AM",
        "11:00 AM",
        "11:30 AM",
        "12:00 PM",
        "12:30 PM",
        "1:00 PM",
        "1:30 PM",
        "2:00 PM",
        "2:30 PM",
        "3:00 PM",
        "3:30 PM",
        "4:00 PM",
        "4:30 PM",
        "5:00 PM",
        "5:30 PM",
        "6:00 PM",
        "6:30 PM",
        "7:00 PM",
        "7:30 PM"
    ]
};

let res = data["availableTime"] || [];
append(res);

localStorage.setItem("pastdata", JSON.stringify(past_data));