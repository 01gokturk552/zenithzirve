/*
 * Zenith Zirve'26 — Panel yapılandırması
 * ------------------------------------------------------------------
 * Google Apps Script "web app" URL'sini buraya yapıştırın.
 * Kurulum adımları için: apps-script/KURULUM.md
 *
 * URL boş bırakılırsa paneller ve genel sayfalar otomatik olarak
 * tarayıcı belleğini (localStorage) kullanır — yalnızca test/demo içindir,
 * değişiklikler diğer ziyaretçilere yansımaz.
 */
window.ZENITH_CONFIG = {
    // Örn: "https://script.google.com/macros/s/AKfyc..../exec"
    apiUrl: "",

    // IK panelinde başvuruları ayırmak için kullanılan sütun adı (varsa).
    // Google Formunuzda "Başvuru Türü" gibi bir alan varsa adını buraya yazın.
    applicationTypeColumn: "Başvuru Türü"
};
