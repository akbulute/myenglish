import requests
import json
import os

# 1. Görseldeki "Raw" butonuna tıkladıktan sonra açılan sayfanın linkini buraya yapıştır:
RAW_URL = "https://gist.githubusercontent.com/CagriAldemir/b5313cc134c07dc9c41951999252231b/raw/5bc158702100297300934f7b6e9086f20cac31d4/oxford_3000.json" 

def fetch_and_convert_oxford():
    print("GitHub'dan Oxford 3000 verisi çekiliyor...")
    
    response = requests.get(RAW_URL)
    
    if response.status_code != 200:
        print("Hata: Veriye ulaşılamadı. HTTP Kodu:", response.status_code)
        return

    # Gelen veriyi doğrudan JSON (liste) olarak okuyoruz
    raw_data = response.json()
    words_data = []
    
    print(f"Toplam {len(raw_data)} kelime bulundu. Uygulama formatına dönüştürülüyor...")

    # 2. BİZİM UYGULAMANIN FORMATINA ÇEVİRME
    for index, word in enumerate(raw_data):
        # GitHub'daki format: {"tr": "bir", "en": "a"}
        # Bizim format: {"id": "yds-1", "english": "a", "turkish": "bir", "status": "new"}
        
        word_obj = {
            "id": f"yds-{index + 1}", # ID yapısını bozmamak için yds- prefixi ile devam ediyoruz
            "english": word.get("en", "").strip(),
            "turkish": word.get("tr", "").strip(),
            "status": "new"
        }
        words_data.append(word_obj)

    # 3. VERİYİ UYGULAMAYA KAYDETME
    output_dir = os.path.join(os.path.dirname(__file__), '..', 'src', 'data')
    os.makedirs(output_dir, exist_ok=True)
    output_path = os.path.join(output_dir, 'yds-words.json')
    
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(words_data, f, ensure_ascii=False, indent=2)
        
    print(f"Başarılı! Oxford 3000 kelimeleri '{output_path}' dosyasına kaydedildi.")

if __name__ == "__main__":
    fetch_and_convert_oxford()