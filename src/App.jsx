import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// 📍 Leaflet default marker için düzeltme
const customIcon = new L.Icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.3/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.3/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const cities = [
  "Adana","Adıyaman","Afyonkarahisar","Ağrı","Aksaray","Amasya","Ankara","Antalya",
  "Ardahan","Artvin","Aydın","Balıkesir","Bartın","Batman","Bayburt","Bilecik",
  "Bingöl","Bitlis","Bolu","Burdur","Bursa","Çanakkale","Çankırı","Çorum","Denizli",
  "Diyarbakır","Düzce","Edirne","Elazığ","Erzincan","Erzurum","Eskişehir","Gaziantep",
  "Giresun","Gümüşhane","Hakkari","Hatay","Iğdır","Isparta","İstanbul","İzmir",
  "Kahramanmaraş","Karabük","Karaman","Kars","Kastamonu","Kayseri","Kırıkkale",
  "Kırklareli","Kırşehir","Kilis","Kocaeli","Konya","Kütahya","Malatya","Manisa",
  "Mardin","Mersin","Muğla","Muş","Nevşehir","Niğde","Ordu","Osmaniye","Rize",
  "Sakarya","Samsun","Siirt","Sinop","Sivas","Şanlıurfa","Şırnak","Tekirdağ","Tokat",
  "Trabzon","Tunceli","Uşak","Van","Yalova","Yozgat","Zonguldak"
];

// 🌍 Harita FlyTo bileşeni
function FlyToLocation({ coords }) {
  const map = useMap();
  useEffect(() => {
    if (coords) {
      map.flyTo(coords, 8, { duration: 2 });
    }
  }, [coords, map]);
  return null;
}

function App() {
  const [mapCenter, setMapCenter] = useState([39.925533, 32.866287]); // Ankara
  const [city, setCity] = useState("");
  const [filtered, setFiltered] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [weather, setWeather] = useState(null);
  const apiKey = "9e67a56d890f65a5449408a6f2bf61e7";

  const handleInput = (e) => {
    const value = e.target.value;
    setCity(value);
    if (value.length > 0) {
      const filteredCities = cities.filter((c) =>
        c.toLowerCase().startsWith(value.toLowerCase())
      );
      setFiltered(filteredCities);
      setSelectedIndex(-1);
    } else {
      setFiltered([]);
    }
  };

  const getWeather = async (selectedCity) => {
    const targetCity = selectedCity || city;
    if (!targetCity) return;
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${targetCity}&appid=${apiKey}&units=metric&lang=tr`
      );
      const data = await response.json();
      if (data.cod === "404") {
        alert("Şehir bulunamadı komutanım!");
        setWeather(null);
      } else {
        setWeather(data);
        setFiltered([]);
        setCity("");
        // 🌍 Şehrin koordinatlarını merkeze ayarla
        setMapCenter([data.coord.lat, data.coord.lon]);
      }
    } catch (error) {
      console.error("Hava durumu alınamadı:", error);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev < filtered.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (selectedIndex >= 0 && filtered[selectedIndex]) {
        getWeather(filtered[selectedIndex]);
      } else {
        getWeather(city);
      }
    }
  };

  const getWindDirection = (deg) => {
    if (deg > 337.5 || deg <= 22.5) return "North";
    if (deg > 22.5 && deg <= 67.5) return "Northeast";
    if (deg > 67.5 && deg <= 112.5) return "East";
    if (deg > 112.5 && deg <= 157.5) return "Southeast";
    if (deg > 157.5 && deg <= 202.5) return "South";
    if (deg > 202.5 && deg <= 247.5) return "Southwest";
    if (deg > 247.5 && deg <= 292.5) return "West";
    if (deg > 292.5 && deg <= 337.5) return "Northwest";
  };

  const getBackground = () => {
    if (!weather) return "#74b9ff";
    const condition = weather.weather[0].main.toLowerCase();
    if (condition.includes("clear")) return "#f1c40f";
    if (condition.includes("cloud")) return "#95a5a6";
    if (condition.includes("rain")) return "#5dade2";
    if (condition.includes("snow")) return "#a3e4d7";
    return "#74b9ff";
  };

  const formatTime = (unix) => {
    return new Date(unix * 1000).toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div
      style={{
        ...styles.container,
        backgroundColor: getBackground(),
        transition: "background-color 0.5s ease",
      }}
    >
      <div style={styles.card}>
        <h1>🌍 Global Weather Map</h1>

        {/* 🔍 Input */}
        <div style={{ position: "relative" }}>
          <input
            type="text"
            placeholder="Enter a city name..."
            value={city}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            style={styles.input}
          />
          {filtered.length > 0 && (
            <ul style={styles.suggestionList}>
              {filtered.map((item, index) => (
                <li
                  key={item}
                  onClick={() => getWeather(item)}
                  style={{
                    ...styles.suggestionItem,
                    backgroundColor:
                      index === selectedIndex ? "#dfe6e9" : "white",
                    fontWeight: index === selectedIndex ? "bold" : "normal",
                  }}
                >
                  {item}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* 🗺️ Harita */}
        <div style={{ height: "300px", marginTop: "20px", borderRadius: "10px", overflow: "hidden" }}>
          <MapContainer center={mapCenter} zoom={5} style={{ height: "100%", width: "100%" }}>
            {/* İngilizce Etiketli Tile Layer */}
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://carto.com/attributions">CARTO</a> | English Labels'
            />
            <FlyToLocation coords={mapCenter} />
            <Marker position={mapCenter} icon={customIcon}>
              <Popup>{weather ? weather.name : "Location"}</Popup>
            </Marker>
          </MapContainer>
        </div>

        {weather && (
          <div style={styles.result}>
            <h2>{weather.name}</h2>
            <img
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
              alt="icon"
            />
            <p>{weather.weather[0].description.toUpperCase()}</p>
            <h3>🌡️ {Math.round(weather.main.temp)} °C</h3>
            <p>Feels like: {Math.round(weather.main.feels_like)} °C</p>
            <p>Humidity: {weather.main.humidity}%</p>
            <p>
              Wind: {(weather.wind.speed * 3.6).toFixed(1)} km/h (
              {getWindDirection(weather.wind.deg)})
            </p>
            <p>Visibility: {(weather.visibility / 1000).toFixed(1)} km</p>
            <p>Sunrise: {formatTime(weather.sys.sunrise)}</p>
            <p>Sunset: {formatTime(weather.sys.sunset)}</p>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "Poppins, sans-serif",
  },
  card: {
    backgroundColor: "rgba(255,255,255,0.9)",
    padding: "30px",
    borderRadius: "15px",
    textAlign: "center",
    boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
    width: "340px",
  },
  input: {
    width: "100%",
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "16px",
  },
  suggestionList: {
    listStyleType: "none",
    margin: 0,
    padding: "5px 0",
    position: "absolute",
    width: "100%",
    backgroundColor: "white",
    border: "1px solid #ccc",
    borderRadius: "8px",
    maxHeight: "150px",
    overflowY: "auto",
    zIndex: 10,
  },
  suggestionItem: {
    padding: "8px",
    cursor: "pointer",
  },
  result: {
    marginTop: "20px",
  },
};

export default App;
