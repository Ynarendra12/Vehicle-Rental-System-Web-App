let vehicles = JSON.parse(localStorage.getItem('vehicles')) || [];
let bookings = JSON.parse(localStorage.getItem('bookings')) || [];

function showSection(id) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

// Add Vehicle
document.getElementById('addVehicleForm').addEventListener('submit', e => {
  e.preventDefault();
  const name = document.getElementById('vName').value.trim();
  const type = document.getElementById('vType').value.trim();
  const rate = parseFloat(document.getElementById('vRate').value);

  if (!name || !type || isNaN(rate)) {
    alert("Please fill all fields correctly!");
    return;
  }

  vehicles.push({ name, type, rate, available: true });
  localStorage.setItem('vehicles', JSON.stringify(vehicles));

  alert(`${name} added successfully!`);
  e.target.reset();
  updateVehicleTable();
  updateBookingSelect();
});

// Display Vehicles
function updateVehicleTable() {
  const tbody = document.querySelector('#vehicleTable tbody');
  tbody.innerHTML = '';
  vehicles.forEach((v, i) => {
    const status = v.available ? "Available ✅" : "Booked ❌";
    const row = `<tr>
      <td>${v.name}</td>
      <td>${v.type}</td>
      <td>₹${v.rate}</td>
      <td>${status}</td>
      <td><button class="delete-btn" onclick="deleteVehicle(${i})">Delete</button></td>
    </tr>`;
    tbody.innerHTML += row;
  });
}

// Delete Vehicle
function deleteVehicle(index) {
  if (confirm(`Delete ${vehicles[index].name}?`)) {
    vehicles.splice(index, 1);
    localStorage.setItem('vehicles', JSON.stringify(vehicles));
    updateVehicleTable();
    updateBookingSelect();
  }
}

// Book Vehicle
document.getElementById('bookForm').addEventListener('submit', e => {
  e.preventDefault();
  const index = document.getElementById('bookSelect').value;
  const days = parseInt(document.getElementById('days').value);
  const custName = document.getElementById('custName').value.trim();
  const custPhone = document.getElementById('custPhone').value.trim();

  if (index === '') {
    alert('Please select a vehicle');
    return;
  }

  if (days <= 0 || !custName || !custPhone) {
    alert('Please fill all details correctly');
    return;
  }

  const v = vehicles[index];
  if (!v.available) {
    alert('This vehicle is already booked!');
    return;
  }

  // Pricing and Discount
  let price = v.rate * days;
  let discount = 0;
  if (days >= 3 && days < 5) discount = 10;
  else if (days >= 5 && days < 7) discount = 15;
  else if (days >= 7) discount = 20;

  const finalPrice = price - (price * discount / 100);

  // Save Booking
  const booking = {
    custName,
    custPhone,
    vehicle: v.name,
    days,
    total: finalPrice.toFixed(2),
    discount
  };

  bookings.push(booking);
  localStorage.setItem('bookings', JSON.stringify(bookings));

  // Mark Vehicle Unavailable
  vehicles[index].available = false;
  localStorage.setItem('vehicles', JSON.stringify(vehicles));

  document.getElementById('bookResult').textContent =
    `✅ Booking Confirmed for ${custName}! 
    ${v.name} for ${days} days = ₹${finalPrice.toFixed(2)} (Discount: ${discount}%)`;

  e.target.reset();
  updateVehicleTable();
  updateBookingSelect();
  updateBookingTable();
});

// Update Booking Select Dropdown
function updateBookingSelect() {
  const select = document.getElementById('bookSelect');
  select.innerHTML = '<option value="">--Select Vehicle--</option>';
  vehicles.forEach((v, i) => {
    if (v.available) {
      select.innerHTML += `<option value="${i}">${v.name} (${v.type})</option>`;
    }
  });
}

// Update Booking Table
function updateBookingTable() {
  const tbody = document.querySelector('#bookingTable tbody');
  tbody.innerHTML = '';
  bookings.forEach(b => {
    const row = `<tr>
      <td>${b.custName}</td>
      <td>${b.custPhone}</td>
      <td>${b.vehicle}</td>
      <td>${b.days}</td>
      <td>${b.total}</td>
      <td>${b.discount}%</td>
    </tr>`;
    tbody.innerHTML += row;
  });
}

// Initialize
updateVehicleTable();
updateBookingSelect();
updateBookingTable();
