/*
 * Zenith Zirve'26 — Ortak giriş sayfası mantığı (admin-login / ik-login)
 * Sayfa, kendi rolünü ve yönlendirmesini şu globallerle belirtir:
 *   window.LOGIN_ROLE     → "admin" | "ik"
 *   window.LOGIN_REDIRECT → "admin-panel.html" | "ik-panel.html"
 */
(function () {
    "use strict";
    var Z = window.Zenith;
    var role = window.LOGIN_ROLE;
    var redirect = window.LOGIN_REDIRECT;

    // Zaten giriş yapılmışsa doğrudan panele geç
    if (Z.Auth.isAuthed(role)) { location.replace(redirect); return; }

    var form = Z.$("#loginForm");
    var status = Z.$("#loginStatus");

    // Demo modunda (backend yokken) şifreyi ipucu olarak göster
    if (!Z.hasApi()) {
        var hint = Z.$("#demoHint");
        if (hint && Z.demoPasswords[role]) {
            hint.hidden = false;
            hint.textContent = "Demo modu — şifre: " + Z.demoPasswords[role];
        }
    }

    form.addEventListener("submit", function (e) {
        e.preventDefault();
        Z.hideStatus(status);
        var btn = form.querySelector("button[type=submit]");
        btn.disabled = true; btn.textContent = "Kontrol ediliyor…";
        Z.Auth.login(role, Z.$("#pw").value).then(function (res) {
            if (res.ok) {
                location.replace(redirect);
            } else {
                btn.disabled = false; btn.textContent = "Giriş Yap";
                Z.showStatus(status, "err", res.error || "Giriş başarısız.");
            }
        });
    });
})();
