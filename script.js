<!DOCTYPE html>
<html lang="he">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ממוצע שכר דירה בתל אביב</title>
    <link rel="stylesheet" href="styles.css">
    <!-- הוספת סגנונות של Leaflet -->
    <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
    <!-- הוספת ספריית JavaScript של Leaflet -->
    <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
    <!-- הוספת ספריית Geocoder של Leaflet -->
    <script src="https://unpkg.com/leaflet-control-geocoder/dist/Control.Geocoder.js"></script>
    <link rel="stylesheet" href="https://unpkg.com/leaflet-control-geocoder/dist/Control.Geocoder.css" />
</head>
<body>
    <div class="container">
        <h1>ממוצע שכר דירה בתל אביב (2023) 🏠</h1>
        
        <!-- תיבת סינון -->
        <div class="filter">
            <label for="rooms">סנן לפי מספר חדרים:</label>
            <select id="rooms">
                <option value="all">הכל</option>
                <option value="1">1 חדר</option>
                <option value="2">2 חדרים</option>
                <option value="3">3 חדרים</option>
                <option value="4">4+ חדרים</option>
            </select>
        </div>

        <!-- תיבת חיפוש ברחוב -->
        <div class="filter">
            <label for="street">חפש רחוב:</label>
            <input type="text" id="street" placeholder="הקלד שם רחוב בתל אביב">
        </div>

        <!-- הוספת המפה -->
        <div id="map" style="height: 500px; margin-top: 20px;"></div> <!-- גובה המפה -->

        <!-- טבלת הנתונים -->
        <table id="rentTable">
            <thead>
                <tr>
                    <th>שכונה</th>
                    <th>מספר חדרים</th>
                    <th>ממוצע שכר דירה (₪)</th>
                </tr>
            </thead>
            <tbody id="tableBody">
                <!-- הנתונים יוטענו כאן דרך JavaScript -->
            </tbody>
        </table>
    </div>

    <script>
        // יצירת אובייקט המפה
        var map = L.map('map').setView([32.0853, 34.7818], 12); // מיקום תל אביב

        // הוספת לייר של OpenStreetMap
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        // יצירת אפשרות חיפוש עם Geocoder של Leaflet
        var geocoder = L.Control.Geocoder.nominatim();

        // הוספת תיבת חיפוש ברחוב
        var searchControl = L.Control.geocoder({
            query: '',
            placeholder: 'הקלד שם רחוב',
            collapsed: false,
            position: 'topright',
            geocoder: geocoder
        }).addTo(map);

        // כאשר המשתמש בוחר מקום
        searchControl.on('markgeocode', function(e) {
            var latlng = e.geocode.center;
            var name = e.geocode.name;

            // מיקוד המפה ברחוב שנבחר
            map.setView(latlng, 15); // Zoom-in לרחוב
            L.marker(latlng).addTo(map).bindPopup(name).openPopup();
        });

        // פונקציה להורדת נתוני שכר דירה
        async function fetchRentData() {
            try {
                const response = await fetch('https://data.gov.il/api/3/action/datastore_search?resource_id=YOUR_RESOURCE_ID');
                const data = await response.json();
                if (data.result && data.result.records) {
                    const formattedData = data.result.records.map(item => ({
                        שכונה: item.Neighborhood,
                        חדרים: parseInt(item.Rooms),
                        שכר: parseInt(item.Rent)
                    }));
                    loadTable(formattedData);
                } else {
                    console.error('מבנה הנתונים אינו תואם');
                }
            } catch (error) {
                console.error('שגיאה בטעינת הנתונים:', error);
            }
        }

        // פונקציה לטעינת הנתונים לטבלה
        function loadTable(data) {
            const tableBody = document.getElementById('tableBody');
            tableBody.innerHTML = '';

            data.forEach(item => {
                const row = `
                    <tr>
                        <td>${item.שכונה}</td>
                        <td>${item.חדרים}</td>
                        <td>${item.שכר.toLocaleString()} ₪</td>
                    </tr>
                `;
                tableBody.innerHTML += row;
            });
        }

        // טעינת הנתונים בעת פתיחת העמוד
        fetchRentData();
    </script>
</body>
</html>
