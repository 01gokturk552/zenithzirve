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

    $("#logoutBtn").addEventListener("click", function () {
        Z.Auth.logout();
        location.replace("ik-login.html");
    });
    $("#refreshBtn").addEventListener("click", load);
    $("#search").addEventListener("input", render);
    $("#typeFilter").addEventListener("change", render);
    $("#csvBtn").addEventListener("click", downloadCsv);

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

        var thead = elem("thead", {}, [
            elem("tr", {}, headers.map(function (h) { return elem("th", { text: h }); }))
        ]);
        var tbody = elem("tbody", {}, data.map(function (r) {
            return elem("tr", {}, headers.map(function (_, ci) {
                return elem("td", { text: r[ci] != null ? String(r[ci]) : "" });
            }));
        }));

        host.innerHTML = "";
        host.appendChild(elem("div", { class: "table-wrap" }, [elem("table", { class: "data-table" }, [thead, tbody])]));

        if (!data.length) {
            host.appendChild(elem("div", { class: "empty-state", html: "<span class='ico'>🔍</span>Filtreye uyan başvuru yok." }));
        }
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
