
=======
# 🌤️ Hava Durumu Uygulaması (React)

Bu proje, **React (Vite)** kullanılarak geliştirilmiş basit ama işlevsel bir **hava durumu uygulamasıdır.**  
Kullanıcı şehir ismini yazarak Türkiye'deki iller arasından otomatik öneri alır ve seçtiği şehrin anlık hava durumu bilgisini görüntüler.

---

## 🚀 Özellikler
- 🔍 **Otomatik şehir tamamlama:** Yazdıkça Türkiye’deki iller filtrelenir.  
- ⌨️ **Klavyeyle kontrol:** Yön tuşlarıyla önerilerde gezilebilir, Enter ile seçim yapılabilir.  
- ☀️ **Anlık hava durumu:** OpenWeatherMap API üzerinden sıcaklık, nem, rüzgar, görünürlük vb. bilgiler çekilir.  
- 🌅 **Ek bilgiler:**  
  - Gün doğumu / Gün batımı  
  - Hissedilen sıcaklık  
  - Görüş uzaklığı  
  - Rüzgar yönü ve hızı (km/s)  
- 🎨 **Dinamik arka plan:** Hava durumuna göre renk geçişleri.

---

## 🛠️ Kullanılan Teknolojiler
| Teknoloji | Açıklama |
|------------|-----------|
| **React (Vite)** | Ön yüz framework'ü |
| **JavaScript (ES6+)** | İş mantığı ve etkileşim |
| **OpenWeatherMap API** | Hava durumu verisi kaynağı |
| **CSS (inline styles)** | Hızlı ve basit stil yapısı |

---

## ⚙️ Kurulum ve Çalıştırma

### 1. Depoyu klonla:

```bash
git clone https://github.com/kerimtetik/hava-durumu.git
cd hava-durumu
```

### 2. Bağımlılıkları yükle:

```bash
npm install
```


### 3. Geliştirme sunucusunu başlat:

```bash
npm run dev
```

### 4. Tarayıcıda aç:
```bash
http://localhost:5173/
```

🔑 API Anahtarı Ekleme
Bu proje **[OpenWeatherMap API](https://openweathermap.org/api)** API kullanır.

Ücretsiz hesap aç.

API Key’ini al.

App.jsx içinde aşağıdaki satırı güncelle:

js
Kodu kopyala
const apiKey = "BURAYA_KENDİ_API_KEYİNİ_YAZ";

