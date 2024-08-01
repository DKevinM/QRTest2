// Fetch AQHI data
async function getAQHIData() {
    const response = await fetch('https://data.environment.alberta.ca/EdwServices/aqhi/odata');
    const data = await response.json();
    return data.value;
}

// Initialize the map
function initializeMap(data) {
    const map = L.map('map').setView([53.5461, -113.4938], 10); // Center on Edmonton

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    data.forEach(station => {
        if (station.latitude && station.longitude) {
            const color = station.AQHI <= 3 ? 'green' : station.AQHI <= 6 ? 'orange' : 'red';
            L.circle([station.latitude, station.longitude], {
                color: color,
                fillColor: color,
                fillOpacity: 0.5,
                radius: station.AQHI * 1000
            }).addTo(map)
            .bindPopup(`<b>Site:</b> ${station.site}<br><b>AQHI:</b> ${station.AQHI}`);
        }
    });
}

// Generate QR code
function generateQRCode() {
    const qr = qrcode(0, 'L');
    const url = window.location.href;
    qr.addData(url);
    qr.make();
    document.getElementById('qr-code').innerHTML = qr.createImgTag();
}

// Main function
(async function() {
    const data = await getAQHIData();
    initializeMap(data);
    generateQRCode();
})();
