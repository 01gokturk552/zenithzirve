/*
 * Zenith Zirve'26 — İK paneli (başvurular)
 * Google Form yanıtlarını tablo halinde gösterir.
 */
(function () {
    "use strict";
    var Z = window.Zenith;
    var $ = Z.$, elem = Z.elem;
    var CFG = window.ZENITH_CONFIG || {};

    // Yetki kontrolü — giriş yoksa login sayfasına gönder
    if (!Z.Auth.isAuthed("ik")) { location.replace("ik-login.html"); return; }

    var headers = [];
    var rows = [];
    var typeColIndex = -1;
    var viewMode = "cards"; // "cards" | "table"

    $("#logoutBtn").addEventListener("click", function () {
        Z.Auth.logout();
        location.replace("ik-login.html");
    });
    $("#refreshBtn").addEventListener("click", load);
    $("#search").addEventListener("input", render);
    $("#typeFilter").addEventListener("change", render);
    $("#csvBtn").addEventListener("click", downloadCsv);
    $("#viewToggle").addEventListener("click", function () {
        viewMode = viewMode === "cards" ? "table" : "cards";
        this.textContent = viewMode === "cards" ? "Tablo görünümü" : "Kart görünümü";
        render();
    });

    function init() {
        if (!Z.hasApi()) {
            var b = $("#modeBanner");
            b.hidden = false;
            b.textContent = "Başvuruları görmek için Google Apps Script backend'i gereklidir. config.js içine Apps Script URL'sini ekleyin (kurulum: apps-script/KURULUM.md).";
        }
        load();
    }

    function load() {
        var host = $("#tableHost");
        host.innerHTML = "<div class='empty-state'><span class='ico'>⏳</span>Başvurular yükleniyor…</div>";
        Z.Data.getApplications().then(function (res) {
            headers = res.headers || [];
            rows = res.rows || [];
            typeColIndex = -1;
            var typeCol = (CFG.applicationTypeColumn || "").toLowerCase().trim();
            if (typeCol) {
                headers.forEach(function (h, i) {
                    if (String(h).toLowerCase().trim() === typeCol) typeColIndex = i;
                });
            }
            buildTypeFilter();
            render();

            if (res.local) {
                $("#tableHost").innerHTML = "";
                $("#tableHost").appendChild(elem("div", { class: "empty-state", html:
                    "<span class='ico'>🔌</span>Backend bağlı değil.<br>Başvurular Google Form'a gelmeye devam ediyor; burada görüntülemek için Apps Script kurulumunu tamamlayın." }));
                $("#count").textContent = "";
            }
        }).catch(function (err) {
            $("#tableHost").innerHTML = "";
            Z.showStatus($("#globalStatus"), "err", "Başvurular alınamadı: " + err.message);
        });
    }

    function buildTypeFilter() {
        var sel = $("#typeFilter");
        if (typeColIndex < 0) { sel.hidden = true; return; }
        var seen = {}, opts = [];
        rows.forEach(function (r) {
            var v = (r[typeColIndex] || "").trim();
            if (v && !seen[v]) { seen[v] = true; opts.push(v); }
        });
        sel.innerHTML = "";
        sel.appendChild(elem("option", { value: "" }, ["Tüm türler"]));
        opts.forEach(function (v) { sel.appendChild(elem("option", { value: v }, [v])); });
        sel.hidden = opts.length === 0;
    }

    function currentFiltered() {
        var q = $("#search").value.toLowerCase().trim();
        var type = $("#typeFilter").value;
        return rows.filter(function (r) {
            if (type && typeColIndex >= 0 && (r[typeColIndex] || "").trim() !== type) return false;
            if (q) {
                var hay = r.join(" ").toLowerCase();
                if (hay.indexOf(q) === -1) return false;
            }
            return true;
        });
    }

    function render() {
        var host = $("#tableHost");
        if (!headers.length) {
            host.innerHTML = "";
            host.appendChild(elem("div", { class: "empty-state", html: "<span class='ico'>📭</span>Henüz başvuru yok." }));
            $("#count").textContent = "";
            return;
        }

        var data = currentFiltered();
        $("#count").textContent = data.length + " / " + rows.length + " başvuru";

        host.innerHTML = "";
        host.appendChild(viewMode === "table" ? buildTable(data) : buildCards(data));

        if (!data.length) {
            host.appendChild(elem("div", { class: "empty-state", html: "<span class='ico'>🔍</span>Filtreye uyan başvuru yok." }));
        }
    }

    function detectIdx(re) {
        for (var i = 0; i < headers.length; i++) { if (re.test(String(headers[i]))) return i; }
        return -1;
    }

    // Okunması kolay kart görünümü: her başvuru = bir kart, alanlar "Soru → Cevap"
    function buildCards(data) {
        var tsRe = /(zaman ?damgas|timestamp|tarih)/i;
        var nameRe = /(ad[ıi].{0,8}soyad|isim|adınız|^ad$|full ?name|\bname\b)/i;
        var tsIdx = detectIdx(tsRe);
        // İsim olabilecek tüm sütunlar (delegasyon + bireysel için ayrı olabilir)
        var nameIdxs = [];
        headers.forEach(function (h, i) { if (nameRe.test(String(h))) nameIdxs.push(i); });

        var grid = elem("div", { class: "app-cards" });
        data.forEach(function (r) {
            // Bu satır için ad: ilk dolu isim sütunu
            var titleIdx = -1;
            for (var k = 0; k < nameIdxs.length; k++) {
                if (r[nameIdxs[k]] != null && String(r[nameIdxs[k]]).trim()) { titleIdx = nameIdxs[k]; break; }
            }
            var titleVal = titleIdx >= 0 ? String(r[titleIdx]) : "İsimsiz başvuru";

            var headChildren = [elem("h4", { class: "app-name", text: titleVal })];
            if (typeColIndex >= 0 && r[typeColIndex]) {
                headChildren.push(elem("span", { class: "app-type", text: String(r[typeColIndex]) }));
            }

            var fields = elem("div", { class: "app-fields" });
            headers.forEach(function (h, ci) {
                if (ci === titleIdx || ci === tsIdx || ci === typeColIndex) return;
                var v = r[ci];
                if (v == null || String(v).trim() === "") return;
                fields.appendChild(fieldRow(String(h), String(v)));
            });

            var card = elem("div", { class: "app-card" }, [elem("div", { class: "app-card-head" }, headChildren)]);
            if (tsIdx >= 0 && r[tsIdx]) card.appendChild(elem("div", { class: "app-meta", text: String(r[tsIdx]) }));
            card.appendChild(fields);
            grid.appendChild(card);
        });
        return grid;
    }

    // Tek alan satırı; uzun başlık/cevapları kısaltır, "Tümünü gör" ile açar
    function fieldRow(label, value) {
        var shortLabel = label.length > 70 ? label.slice(0, 67) + "…" : label;
        var lbl = elem("span", { class: "lbl", title: label, text: shortLabel });
        var val = elem("span", { class: "val" });
        var children = [lbl, val];

        if (value.length > 220) {
            var preview = value.slice(0, 220) + "…";
            val.textContent = preview;
            var expanded = false;
            var more = elem("button", { type: "button", class: "val-more" }, ["Tümünü gör"]);
            more.addEventListener("click", function () {
                expanded = !expanded;
                val.textContent = expanded ? value : preview;
                more.textContent = expanded ? "Daha az göster" : "Tümünü gör";
            });
            children.push(more);
        } else {
            val.textContent = value;
        }
        return elem("div", { class: "app-field" }, children);
    }

    function buildTable(data) {
        var thead = elem("thead", {}, [
            elem("tr", {}, headers.map(function (h) { return elem("th", { text: h }); }))
        ]);
        var tbody = elem("tbody", {}, data.map(function (r) {
            return elem("tr", {}, headers.map(function (_, ci) {
                return elem("td", { text: r[ci] != null ? String(r[ci]) : "" });
            }));
        }));
        return elem("div", { class: "table-wrap" }, [elem("table", { class: "data-table" }, [thead, tbody])]);
    }

    function downloadCsv() {
        if (!headers.length) return;
        var data = currentFiltered();
        var lines = [headers].concat(data).map(function (row) {
            return row.map(function (cell) {
                var s = cell == null ? "" : String(cell);
                if (/[",\n;]/.test(s)) s = '"' + s.replace(/"/g, '""') + '"';
                return s;
            }).join(",");
        });
        var blob = new Blob(["﻿" + lines.join("\r\n")], { type: "text/csv;charset=utf-8;" });
        var url = URL.createObjectURL(blob);
        var a = elem("a", { href: url, download: "zenith-basvurular.csv" });
        document.body.appendChild(a); a.click(); a.remove();
        URL.revokeObjectURL(url);
    }

    // ---------- Başlat ----------
    init();
})();
