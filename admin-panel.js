/*
 * Zenith Zirve'26 — Admin paneli (içerik yönetimi)
 */
(function () {
    "use strict";
    var Z = window.Zenith;
    var $ = Z.$, elem = Z.elem;

    // Yetki kontrolü — giriş yoksa login sayfasına gönder
    if (!Z.Auth.isAuthed("admin")) { location.replace("admin-login.html"); return; }

    var speakersState = [];
    var programState = [];
    var spkDirty = false, progDirty = false;

    $("#logoutBtn").addEventListener("click", function () {
        Z.Auth.logout();
        location.replace("admin-login.html");
    });

    function init() {
        if (!Z.hasApi()) {
            var b = $("#modeBanner");
            b.hidden = false;
            b.textContent = "Demo modu: backend bağlı değil; değişiklikler yalnızca bu tarayıcıda saklanır. (config.js içine Apps Script URL'sini ekleyin.)";
        }
        loadSpeakers();
        loadProgram();
    }

    // ---------- Sekmeler ----------
    Z.$all(".panel-tab").forEach(function (tab) {
        tab.addEventListener("click", function () {
            Z.$all(".panel-tab").forEach(function (t) { t.classList.remove("active"); });
            Z.$all(".panel-pane").forEach(function (p) { p.classList.remove("active"); });
            tab.classList.add("active");
            $("#pane-" + tab.dataset.pane).classList.add("active");
        });
    });

    // ================= KONUŞMACILAR =================
    function loadSpeakers() {
        var list = $("#speakerList");
        list.innerHTML = "<div class='empty-state'><span class='ico'>⏳</span>Yükleniyor…</div>";
        Z.Data.getSpeakers().then(function (data) {
            speakersState = data || [];
            spkDirty = false; renderSpeakers();
        }).catch(function (err) {
            list.innerHTML = "";
            Z.showStatus($("#globalStatus"), "err", "Konuşmacılar yüklenemedi: " + err.message);
        });
    }

    function renderSpeakers() {
        var list = $("#speakerList");
        list.innerHTML = "";
        $("#spkCount").textContent = speakersState.length + " konuşmacı";
        $("#spkDirty").textContent = spkDirty ? "● Kaydedilmemiş değişiklikler" : "";

        if (!speakersState.length) {
            list.appendChild(elem("div", { class: "empty-state", html: "<span class='ico'>🎤</span>Henüz konuşmacı yok. “Konuşmacı Ekle” ile başlayın." }));
            return;
        }

        speakersState.forEach(function (sp, i) {
            var thumb = elem("img", { class: "thumb", src: sp.photo || "", alt: "", onerror: function () { this.style.visibility = "hidden"; } });
            var photoInput = elem("input", { type: "text", value: sp.photo || "", "data-k": "photo", placeholder: "konuşmacılarımız/dosya.png veya https://…",
                oninput: function () { thumb.src = this.value; thumb.style.visibility = "visible"; markSpk(); } });

            var card = elem("div", { class: "editor-card" }, [
                elem("div", { class: "editor-card-head" }, [
                    elem("span", { class: "idx", text: String(i + 1) }),
                    elem("span", { class: "title", text: sp.name || "(isimsiz)" }),
                    elem("button", { class: "pbtn pbtn-ghost pbtn-sm", title: "Yukarı", onclick: function () { moveSpk(i, -1); } }, ["↑"]),
                    elem("button", { class: "pbtn pbtn-ghost pbtn-sm", title: "Aşağı", onclick: function () { moveSpk(i, 1); } }, ["↓"]),
                    elem("button", { class: "pbtn pbtn-danger pbtn-sm", onclick: function () { removeSpk(i); } }, ["Sil"])
                ]),
                elem("div", { class: "field-row" }, [
                    field("Ad / Unvan", elem("input", { type: "text", value: sp.name || "", "data-k": "name", oninput: markSpk })),
                    field("Görev / Kurum", elem("input", { type: "text", value: sp.title || "", "data-k": "title", oninput: markSpk }))
                ]),
                fieldWith("Fotoğraf yolu", elem("div", { class: "spk-row", style: "grid-template-columns:auto 1fr;" }, [thumb, photoInput]), "Site içindeki dosya yolu (ör. konuşmacılarımız/ad.png) veya tam bir URL."),
                field("Biyografi", elem("textarea", { rows: "5", "data-k": "bio", placeholder: "Paragraf aralarını boş satırla ayırın.", oninput: markSpk }, [sp.bio || ""]))
            ]);
            list.appendChild(card);
        });
    }

    function field(label, input) {
        return elem("div", { class: "field" }, [elem("label", { text: label }), input]);
    }
    function fieldWith(label, control, hint) {
        return elem("div", { class: "field" }, [elem("label", { text: label }), control, elem("div", { class: "field-hint", text: hint })]);
    }

    function syncSpeakers() {
        var cards = Z.$all("#speakerList .editor-card");
        speakersState = cards.map(function (card) {
            var o = {};
            Z.$all("[data-k]", card).forEach(function (inp) { o[inp.getAttribute("data-k")] = inp.value; });
            return { name: o.name || "", title: o.title || "", photo: o.photo || "", bio: o.bio || "" };
        });
    }
    function markSpk() { spkDirty = true; $("#spkDirty").textContent = "● Kaydedilmemiş değişiklikler"; }
    function moveSpk(i, d) { syncSpeakers(); var j = i + d; if (j < 0 || j >= speakersState.length) return; var t = speakersState[i]; speakersState[i] = speakersState[j]; speakersState[j] = t; spkDirty = true; renderSpeakers(); }
    function removeSpk(i) { if (!confirm("Bu konuşmacı silinsin mi?")) return; syncSpeakers(); speakersState.splice(i, 1); spkDirty = true; renderSpeakers(); }

    $("#addSpeaker").addEventListener("click", function () {
        syncSpeakers();
        speakersState.push({ name: "", title: "", photo: "", bio: "" });
        spkDirty = true; renderSpeakers();
        var last = $("#speakerList").lastElementChild;
        if (last) last.scrollIntoView({ behavior: "smooth", block: "center" });
    });

    $("#seedSpeakers").hidden = false;
    $("#seedSpeakers").addEventListener("click", function () {
        if (!confirm("Düzenleyici, sitedeki mevcut konuşmacı içeriğiyle doldurulsun mu? (Kaydedene kadar kalıcı olmaz.)")) return;
        speakersState = JSON.parse(JSON.stringify(Z.defaults.speakers));
        spkDirty = true; renderSpeakers();
    });

    $("#reloadSpeakers").addEventListener("click", function () {
        if (spkDirty && !confirm("Kaydedilmemiş değişiklikler var. Yine de yeniden yüklensin mi?")) return;
        loadSpeakers();
    });

    $("#saveSpeakers").addEventListener("click", function () {
        syncSpeakers();
        var btn = this; btn.disabled = true; btn.textContent = "Kaydediliyor…";
        Z.Data.saveSpeakers(speakersState).then(function () {
            btn.disabled = false; btn.textContent = "Konuşmacıları Kaydet";
            spkDirty = false; $("#spkDirty").textContent = "";
            Z.showStatus($("#globalStatus"), "ok", "Konuşmacılar kaydedildi. ✓");
            setTimeout(function () { Z.hideStatus($("#globalStatus")); }, 4000);
        }).catch(function (err) {
            btn.disabled = false; btn.textContent = "Konuşmacıları Kaydet";
            Z.showStatus($("#globalStatus"), "err", "Kaydedilemedi: " + err.message);
        });
    });

    // ================= PROGRAM =================
    function loadProgram() {
        var list = $("#programList");
        list.innerHTML = "<div class='empty-state'><span class='ico'>⏳</span>Yükleniyor…</div>";
        Z.Data.getProgram().then(function (data) {
            programState = data || [];
            progDirty = false; renderProgram();
        }).catch(function (err) {
            list.innerHTML = "";
            Z.showStatus($("#globalStatus"), "err", "Program yüklenemedi: " + err.message);
        });
    }

    function renderProgram() {
        var list = $("#programList");
        list.innerHTML = "";
        $("#progCount").textContent = programState.length + " madde";
        $("#progDirty").textContent = progDirty ? "● Kaydedilmemiş değişiklikler" : "";

        if (!programState.length) {
            list.appendChild(elem("div", { class: "empty-state", html: "<span class='ico'>🗓️</span>Henüz program maddesi yok." }));
            return;
        }

        programState.forEach(function (it, i) {
            var card = elem("div", { class: "editor-card" }, [
                elem("div", { class: "editor-card-head" }, [
                    elem("span", { class: "idx", text: String(i + 1) }),
                    elem("span", { class: "title", text: (it.title || "(başlıksız)") + " — " + (it.time || "") }),
                    elem("button", { class: "pbtn pbtn-ghost pbtn-sm", title: "Yukarı", onclick: function () { moveProg(i, -1); } }, ["↑"]),
                    elem("button", { class: "pbtn pbtn-ghost pbtn-sm", title: "Aşağı", onclick: function () { moveProg(i, 1); } }, ["↓"]),
                    elem("button", { class: "pbtn pbtn-danger pbtn-sm", onclick: function () { removeProg(i); } }, ["Sil"])
                ]),
                elem("div", { class: "field-row" }, [
                    field("Gün", selectDay(it.day)),
                    field("Saat", elem("input", { type: "text", value: it.time || "", "data-k": "time", placeholder: "10.30 – 11.20", oninput: markProg })),
                    field("Başlık", elem("input", { type: "text", value: it.title || "", "data-k": "title", placeholder: "1. Oturum / Ara …", oninput: markProg }))
                ]),
                field("Açıklama", elem("input", { type: "text", value: it.desc || "", "data-k": "desc", placeholder: "Konuşmacı sunumu (50 dk)", oninput: markProg })),
                elem("div", { class: "field-row" }, [
                    field("Konuşmacı ad(lar)ı", elem("input", { type: "text", value: it.speakerNames || "", "data-k": "speakerNames", placeholder: "Boş = oturum/ara", oninput: markProg })),
                    field("Konuşmacı unvanı", elem("input", { type: "text", value: it.speakerTitle || "", "data-k": "speakerTitle", oninput: markProg }))
                ]),
                fieldWith("Fotoğraf yol(lar)ı", elem("input", { type: "text", value: (it.photos || []).join(", "), "data-k": "photos", placeholder: "konuşmacılarımız/ad.png, konuşmacılarımız/ad2.png", oninput: markProg }), "Birden fazla konuşmacı için virgülle ayırın.")
            ]);
            list.appendChild(card);
        });
    }

    function selectDay(val) {
        var sel = elem("select", { "data-k": "day", oninput: markProg }, [
            elem("option", { value: "1" }, ["1. Gün (27 Haziran)"]),
            elem("option", { value: "2" }, ["2. Gün (28 Haziran)"])
        ]);
        sel.value = String(val || 1);
        return sel;
    }

    function syncProgram() {
        var cards = Z.$all("#programList .editor-card");
        programState = cards.map(function (card) {
            var o = {};
            Z.$all("[data-k]", card).forEach(function (inp) { o[inp.getAttribute("data-k")] = inp.value; });
            var photos = (o.photos || "").split(",").map(function (s) { return s.trim(); }).filter(Boolean);
            return {
                day: parseInt(o.day, 10) || 1,
                time: o.time || "", title: o.title || "", desc: o.desc || "",
                speakerNames: o.speakerNames || "", speakerTitle: o.speakerTitle || "",
                photos: photos
            };
        });
    }
    function markProg() { progDirty = true; $("#progDirty").textContent = "● Kaydedilmemiş değişiklikler"; }
    function moveProg(i, d) { syncProgram(); var j = i + d; if (j < 0 || j >= programState.length) return; var t = programState[i]; programState[i] = programState[j]; programState[j] = t; progDirty = true; renderProgram(); }
    function removeProg(i) { if (!confirm("Bu madde silinsin mi?")) return; syncProgram(); programState.splice(i, 1); progDirty = true; renderProgram(); }

    Z.$all("[data-add-day]").forEach(function (btn) {
        btn.addEventListener("click", function () {
            syncProgram();
            var day = parseInt(btn.dataset.addDay, 10);
            programState.push({ day: day, time: "", title: "", desc: "", speakerNames: "", speakerTitle: "", photos: [] });
            progDirty = true; renderProgram();
            var last = $("#programList").lastElementChild;
            if (last) last.scrollIntoView({ behavior: "smooth", block: "center" });
        });
    });

    $("#seedProgram").hidden = false;
    $("#seedProgram").addEventListener("click", function () {
        if (!confirm("Düzenleyici, sitedeki mevcut program akışıyla doldurulsun mu? (Kaydedene kadar kalıcı olmaz.)")) return;
        programState = JSON.parse(JSON.stringify(Z.defaults.program));
        progDirty = true; renderProgram();
    });

    $("#reloadProgram").addEventListener("click", function () {
        if (progDirty && !confirm("Kaydedilmemiş değişiklikler var. Yine de yeniden yüklensin mi?")) return;
        loadProgram();
    });

    $("#saveProgram").addEventListener("click", function () {
        syncProgram();
        var btn = this; btn.disabled = true; btn.textContent = "Kaydediliyor…";
        Z.Data.saveProgram(programState).then(function () {
            btn.disabled = false; btn.textContent = "Programı Kaydet";
            progDirty = false; $("#progDirty").textContent = "";
            Z.showStatus($("#globalStatus"), "ok", "Program kaydedildi. ✓");
            setTimeout(function () { Z.hideStatus($("#globalStatus")); }, 4000);
        }).catch(function (err) {
            btn.disabled = false; btn.textContent = "Programı Kaydet";
            Z.showStatus($("#globalStatus"), "err", "Kaydedilemedi: " + err.message);
        });
    });

    // Sayfadan ayrılırken uyarı
    window.addEventListener("beforeunload", function (e) {
        if (spkDirty || progDirty) { e.preventDefault(); e.returnValue = ""; }
    });

    // ---------- Başlat ----------
    init();
})();
