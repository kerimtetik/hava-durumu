import { useState } from "react";

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

function App() {
  const [city, setCity] = useState("");
  const [filtered, setFiltered] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [weather, setWeather] = useState(null);
  const apiKey = "BURAYA KENDİ API ANAHTARINIZI EKLEYİN";

  // 🔍 Input değişince filtrele
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

  // 🔹 Hava durumu çek
  const getWeather = async (selectedCity) => {
    const targetCity = selectedCity || city;
    if (!targetCity) return;
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${targetCity}&appid=${apiKey}&units=metric&lang=tr`
      );
      const data = await response.json();
      if (data.cod === "404") {
        alert("Şehir bulunamadı!");
        setWeather(null);
      } else {
        setWeather(data);
        setFiltered([]);
        setCity(""); // 🔥 Enter sonrası input’u temizle
      }
    } catch (error) {
      console.error("Hava durumu alınamadı:", error);
    }
  };

  // 🔹 Klavye kontrolü
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
        const chosen = filtered[selectedIndex];
        getWeather(chosen);
      } else {
        getWeather(city);
      }
    }
  };

   // 🔹 Rüzgar yönünü metinle göster
  const getWindDirection = (deg) => {
    if (deg > 337.5 || deg <= 22.5) return "Kuzey";
    if (deg > 22.5 && deg <= 67.5) return "Kuzeydoğu";
    if (deg > 67.5 && deg <= 112.5) return "Doğu";
    if (deg > 112.5 && deg <= 157.5) return "Güneydoğu";
    if (deg > 157.5 && deg <= 202.5) return "Güney";
    if (deg > 202.5 && deg <= 247.5) return "Güneybatı";
    if (deg > 247.5 && deg <= 292.5) return "Batı";
    if (deg > 292.5 && deg <= 337.5) return "Kuzeybatı";
  };

  // Arka plan rengi duruma göre değişiyor
  const getBackground = () => {
    if (!weather) return "#74b9ff"; // default mavi
    const condition = weather.weather[0].main.toLowerCase();
    if (condition.includes("clear")) return "#f1c40f";
    if (condition.includes("cloud")) return "#95a5a6";
    if (condition.includes("rain")) return "#5dade2";
    if (condition.includes("snow")) return "#a3e4d7";
    return "#74b9ff";
  };

   // 🔹 Unix zamanını saat formatına çevir
  const formatTime = (unix) => {
    return new Date(unix * 1000).toLocaleTimeString("tr-TR", {
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
      <div
        style={{
          ...styles.card,
          borderColor: getBackground(),
          borderWidth: "2px",
          borderStyle: "solid",
        }}
      >
        <h1>🌤️ Hava Durumu</h1>

        {/* 🔍 Arama Input */}
        <div style={{ position: "relative" }}>
          <input
            type="text"
            placeholder="Şehir giriniz..."
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
                    fontWeight:
                      index === selectedIndex ? "bold" : "normal",
                  }}
                >
                  {item}
                </li>
              ))}
            </ul>
          )}
        </div>

        {weather && (
          <div style={styles.result}>
            <h2>{weather.name}</h2>
            <img
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
              alt="ikon"
            />
            <p>{weather.weather[0].description.toUpperCase()}</p>
            <h3>🌡️ {Math.round(weather.main.temp)} °C</h3>
            <p>🤒 Hissedilen: {Math.round(weather.main.feels_like)} °C</p>
            <p>💧 Nem: {weather.main.humidity}%</p>
            <p> 💨 Rüzgar: {(weather.wind.speed * 3.6).toFixed(1)} km/s (
              {getWindDirection(weather.wind.deg)})
            </p>
            <p>👁️ Görüş Uzaklığı: {(weather.visibility / 1000).toFixed(1)} km</p>
            <p>🌅 Gün Doğumu: {formatTime(weather.sys.sunrise)}</p>
            <p>🌇 Gün Batımı: {formatTime(weather.sys.sunset)}</p>

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
    backgroundColor: "#74b9ff",
  },
  card: {
    backgroundColor: "rgba(255,255,255,0.9)",
    padding: "30px",
    borderRadius: "15px",
    textAlign: "center",
    boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
    width: "320px",
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
