# 🚀 Activity Watch Frontend

Bu proje, **Activity Watch** uygulamasının **kullanıcı arayüzü (frontend)** tarafını oluşturmak için **React** ile geliştirilmiştir. Kullanıcı aktivitelerini görselleştirmek ve raporlamak için [Activity Watch Backend](https://github.com/safaygt/Activity-Watch.git) ile entegre olur.

---

## 📌 Proje Hakkında

**Activity Watch Frontend**, kullanıcıların günlük ve aylık aktivite verilerini kolayca görüntülemelerini sağlayan interaktif bir arayüz sunar. Backend tarafından sağlanan verileri kullanarak, kullanıcıların uygulama ve pencere kullanım alışkanlıklarını, toplam aktif sürelerini ve zaman çizelgelerini anlaşılır grafikler ve listeler halinde sunar.

---

## 🎯 Özellikler

✅ **Günlük ve Aylık Görünümler:** Kullanıcıların aktivitelerini günlük veya aylık bazda görüntülemesini sağlar.
✅ **Uygulama ve Pencere Başlığı Takibi:** En çok kullanılan uygulamaları ve pencere başlıklarını listeler.
✅ **Aktif Süre Özeti:** Belirli bir gün veya ay için toplam aktif süreyi gösterir.
✅ **Etkinlik Zaman Çizelgesi Grafiği:** Saatlik veya günlük bazda aktiflik sürelerini görselleştirir.
✅ **Tarih Navigasyonu:** Kolayca günler veya aylar arasında geçiş yapma imkanı sunar.
✅ **PDF Raporu Dışa Aktarma:** Görüntülenen raporu PDF olarak kaydetme özelliği.
✅ **Duyarlı Tasarım:** Çeşitli ekran boyutlarına uyum sağlayan responsive arayüz.

---

## 🛠️ Kullanılan Teknolojiler

- ⚛️ **React**
- 📊 **Chart.js** (React-Chartjs-2 ile)
- 🌐 **Axios** (API çağrıları için)
- 📄 **html2pdf.js** (PDF dışa aktarma için)
- ✨ **Lucide React** (İkonlar için)
- 🎨 **CSS** (Özel stillendirme için)

---

## ⚙️ Kurulum

Projeyi yerel ortamınızda çalıştırmak için aşağıdaki adımları izleyin:

1.  **Backend'i Kurun ve Çalıştırın:**
    Bu frontend projesi, veri sağlamak için [Activity Watch Backend](https://github.com/safaygt/Activity-Watch.git) projesinin çalışır durumda olmasına gerektirir. Lütfen önce backend projesini kurun ve çalıştırın.

2.  **Depoyu Klonlayın:**
    ```bash
    git clone [https://github.com/safaygt/ActivityWatchFrontend.git](https://github.com/safaygt/ActivityWatchFrontend.git)
    ```

3.  **Proje Dizinine Geçin:**
    ```bash
    cd ActivityWatchFrontend
    ```

4.  **Bağımlılıkları Yükleyin:**
    ```bash
    npm install
    # veya
    yarn install
    ```

5.  **Uygulamayı Çalıştırın:**
    ```bash
    npm start
    # veya
    yarn start
    ```
    Uygulama genellikle `http://localhost:3000` adresinde açılacaktır.

---

## 🤝 Katkıda Bulunma

Projeye katkıda bulunmak isterseniz aşağıdaki adımları izleyebilirsiniz:

1.  Bu repoyu fork edin.
2.  Yeni bir branch oluşturun:
    ```bash
    git checkout -b feature/YeniOzellik
    ```
3.  Geliştirmelerinizi yapın.
4.  Commit atın:
    ```bash
    git commit -m 'Yeni özellik eklendi'
    ```
5.  Değişiklikleri gönderin:
    ```bash
    git push origin feature/YeniOzellik
    ```
6.  Bir Pull Request (Çekme İsteği) oluşturun.

---

> Geliştiren: [@safaygt](https://github.com/safaygt)
> 💡 Sorularınız ya da önerileriniz için PR veya issue açabilirsiniz!
