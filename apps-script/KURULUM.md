# Zenith Zirve'26 — Backend Kurulumu (Google Apps Script)

Admin ve IK panellerinin **gerçek** veriyle çalışması için tek seferlik ~10 dakikalık bir Google kurulumu gerekir. Hosting Vercel'de kalır; paneller bu Apps Script servisine bağlanır.

> Kurulumu yapana kadar paneller **demo modunda** çalışır (değişiklikler yalnızca o tarayıcıda kalır).
> Demo şifreleri — **Admin:** `zenithadmin2026` · **IK:** `zenithik2026`.

---

## 1) Google Form yanıtlarını bir tabloya bağlayın

1. Başvuru formunuzu açın → **Yanıtlar** sekmesi → yeşil **Sheets** simgesi → **E-Tablolar'da görüntüle**.
2. Açılan Google E-Tablosu, başvuruların biriktiği yerdir. Bu tabloyu kullanacağız.

(Form zaten bir tabloya bağlıysa o tabloyu açmanız yeterli.)

## 2) Apps Script'i açın ve kodu yapıştırın

1. Bu tabloda **Uzantılar → Apps Script**'i açın.
2. Açılan editördeki tüm kodu silin.
3. Bu klasördeki **`Code.gs`** dosyasının içeriğini yapıştırın ve **kaydedin** (💾).

## 3) İlk kurulumu çalıştırın

1. Üstteki fonksiyon menüsünden **`setup`**'ı seçin → **Çalıştır** (▶).
2. İlk çalıştırmada Google **izin** isteyecek → hesabınızı seçin → *Advanced → Go to project (unsafe)* → **Allow**.
3. Bu adım `Speakers` ve `Program` sayfalarını oluşturur ve şifreleri `zenithadmin2026` / `zenithik2026` yapar.

## 4) Şifreleri belirleyin (önemli)

**Project Settings (⚙) → Script properties → Add script property:**

| Property | Value |
|---|---|
| `ADMIN_PASSWORD` | Admin paneli şifresi (varsayılan `zenithadmin2026` — değiştirmeniz önerilir) |
| `IK_PASSWORD` | IK paneli şifresi (varsayılan `zenithik2026` — değiştirmeniz önerilir) |
| `RESPONSES_SHEET` | *(opsiyonel)* form yanıt sayfasının adı, ör. `Form Yanıtları 1` |

> Şifreleri koddan da ayarlayabilirsiniz: editörde `setPasswords('adminSifre','ikSifre')` fonksiyonunu çalıştırın.

> `RESPONSES_SHEET` boş bırakılırsa kod, forma bağlı sayfayı otomatik bulmaya çalışır.

## 5) Web App olarak yayınlayın

1. Sağ üstte **Deploy → New deployment**.
2. **Select type (⚙) → Web app**.
3. Ayarlar:
   - **Execute as:** `Me`
   - **Who has access:** `Anyone`
4. **Deploy** → erişim onayı → **Web app URL**'sini kopyalayın
   (`https://script.google.com/macros/s/AKfyc.../exec` biçiminde).

## 6) URL'yi siteye bağlayın

Proje kökündeki **`config.js`** dosyasını açın ve URL'yi yapıştırın:

```js
window.ZENITH_CONFIG = {
    apiUrl: "https://script.google.com/macros/s/AKfyc.../exec",
    applicationTypeColumn: "Başvuru Türü"
};
```

> `applicationTypeColumn`: Formunuzda delege/delegasyon ayrımı yapan bir alan varsa
> (ör. "Başvuru Türü"), adını buraya yazın — IK panelinde tür filtresi çıkar.
> Yoksa bu satırı olduğu gibi bırakabilirsiniz.

Değişikliği commit'leyip Vercel'e gönderin (otomatik yayınlanır).

## 7) İlk içeriği yükleyin

1. `admin-login.html` adresine gidin, admin şifrenizle giriş yapın (panel `admin-panel.html`'e yönlendirir).
2. **Konuşmacılar** sekmesinde **“Mevcut içerikle doldur”** → **“Konuşmacıları Kaydet”**.
3. **Program** sekmesinde **“Mevcut içerikle doldur”** → **“Programı Kaydet”**.

Artık konuşmacılar ve program sayfaları bu veriyi gösterir; panelden yaptığınız her değişiklik herkese yansır.

---

## Panel adresleri

- **Admin girişi:** `https://SİTENİZ/admin-login.html` → `admin-panel.html`
- **İK girişi:** `https://SİTENİZ/ik-login.html` → `ik-panel.html`

Ayrıca sitenin altındaki **“Personel Girişi”** düğmesinden de bu sayfalara ulaşılır.
Panel sayfaları arama motorlarına kapalıdır (`noindex`); şifresiz erişilirse otomatik olarak giriş sayfasına yönlendirir.

## Güncelleme / yeniden yayınlama

Kodu (`Code.gs`) değiştirirseniz **Deploy → Manage deployments → (kalem) → Version: New version → Deploy** ile güncelleyin. URL aynı kalır.

## Başvuru onaylama ve e-posta

İK panelindeki her başvuru kartında **Onayla / Reddet** butonları ve bir **durum rozeti** (Beklemede / Onaylandı / Reddedildi) vardır.

- **Onayla**'ya basınca: durum, form yanıt sayfasındaki **`Durum`** adlı sütuna yazılır **ve** başvuru sahibine otomatik **onay e-postası** gönderilir (e-posta, satırdaki mail sütunundan bulunur).
- **Reddet** yalnızca durumu günceller, e-posta göndermez.
- `Durum` sütunu yoksa ilk onay/red işleminde otomatik oluşturulur. Bu sütun panelde gösterilmez, yalnızca durumu saklar.

> **Önemli — bu özelliği eklemek için kodu güncelleyin:** Bu klasördeki güncel `Code.gs`'i Apps Script'e yapıştırıp **yeni bir deployment versiyonu** yayınlayın (yukarıdaki adım). İlk onayda Google, **"e-posta gönderme"** izni isteyecektir → *Allow* deyin (MailApp yetkisi).
>
> ⚠️ **"Onayla" gerçek bir e-posta gönderir.** Önce kendi test başvurunuzla deneyin. Tüketici Gmail hesaplarında günlük ~100 e-posta sınırı vardır (16 başvuru için fazlasıyla yeterli).
>
> E-posta metnini değiştirmek için `Code.gs` içindeki `sendApprovalEmail` fonksiyonunu düzenleyin.

## Güvenlik notları

- Şifre koruması küçük ekipler için yeterlidir; istemci tarafı olduğundan banka düzeyinde güvenlik sağlamaz. **Güçlü ve özel bir `ADMIN_PASSWORD` seçin.**
- IK paneli başvuru sahiplerinin kişisel verilerini gösterir; panel bağlantısını ve şifreyi paylaşırken dikkatli olun.
- Başvurular her durumda Google Form → Google Sheet akışında saklanır; bu panel yalnızca okuma amaçlıdır, formu değiştirmez.

## Sık karşılaşılan sorunlar

- **Panelde "Sunucuya ulaşılamadı":** `config.js`'teki URL `/exec` ile bitmeli; deployment "Anyone" erişimine açık olmalı.
- **Başvurular boş görünüyor:** `RESPONSES_SHEET` adını form yanıt sayfanızın adıyla eşleyin.
- **Kod değişti ama etki etmedi:** Yeni bir deployment *versiyonu* yayınladığınızdan emin olun.
