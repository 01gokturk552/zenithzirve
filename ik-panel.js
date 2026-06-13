/*
 * Zenith Zirve'26 — İK paneli (başvurular)
 * Liste görünümü (Delege / Delegasyon bölümleri), satır → detay modalı,
 * Onayla / Reddet / Tekrar iste aksiyonları.
 */
(function () {
    "use strict";
    var Z = window.Zenith;
    var $ = Z.$, elem = Z.elem;
    var CFG = window.ZENITH_CONFIG || {};

    // Yetki kontrolü
    if (!Z.Auth.isAuthed("ik")) { location.replace("ik-login.html"); return; }

    var headers = [], rows = [], rowMeta = [];
    var typeColIndex = -1, tsIdx = -1;
    var nameIdxs = [], phoneIdxs = [], emailIdxs = [];
    var viewMode = "list"; // "list" | "table"
    var detailModal = null;

    // ---------- Listeyiciler ----------
    $("#logoutBtn").addEventListener("click", function () { Z.Auth.logout(); location.replace("ik-login.html"); });
    $("#refreshBtn").addEventListener("click", load);
    $("#search").addEventListener("input", render);
    $("#typeFilter").addEventListener("change", render);
    $("#statusFilter").addEventListener("change", render);
    $("#csvBtn").addEventListener("click", downloadCsv);
    $("#viewToggle").addEventListener("click", function () {
        viewMode = viewMode === "list" ? "table" : "list";
        this.textContent = viewMode === "list" ? "Tablo görünümü" : "Liste görünümü";
        render();
    });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeDetail(); });

    function init() {
        if (!Z.hasApi()) {
            var b = $("#modeBanner");
            b.hidden = false;
            b.textContent = "Başvuruları görmek için Google Apps Script backend'i gereklidir. config.js içine Apps Script URL'sini ekleyin (kurulum: apps-script/KURULUM.md).";
        }
        load();
    }

    // ---------- Veri ----------
    function load() {
        var host = $("#tableHost");
        host.innerHTML = "<div class='empty-state'><span class='ico'>⏳</span>Başvurular yükleniyor…</div>";
        Z.Data.getApplications().then(function (res) {
            headers = res.headers || [];
            rows = res.rows || [];
            rowMeta = res.rowMeta || [];
            detectColumns();
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

    function detectColumns() {
        var tsRe = /(zaman ?damgas|timestamp|tarih)/i;
        var nameRe = /(ad[ıi].{0,8}soyad|isim|adınız|^ad$|full ?name|\bname\b)/i;
        var phoneRe = /(telefon|phone|numara|gsm|\bcep\b)/i;
        var emailRe = /(mail|e-?posta)/i;
        tsIdx = -1; nameIdxs = []; phoneIdxs = []; emailIdxs = [];
        headers.forEach(function (h, i) {
            var s = String(h);
            if (tsIdx < 0 && tsRe.test(s)) tsIdx = i;
            if (nameRe.test(s)) nameIdxs.push(i);
            if (phoneRe.test(s)) phoneIdxs.push(i);
            if (emailRe.test(s)) emailIdxs.push(i);
        });
        typeColIndex = -1;
        var typeCol = (CFG.applicationTypeColumn || "").toLowerCase().trim();
        if (typeCol) headers.forEach(function (h, i) { if (String(h).toLowerCase().trim() === typeCol) typeColIndex = i; });
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

    // ---------- Yardımcılar ----------
    function firstFilled(r, idxs) {
        for (var k = 0; k < idxs.length; k++) {
            var v = r[idxs[k]];
            if (v != null && String(v).trim()) return String(v).trim();
        }
        return "";
    }
    function statusOf(meta) {
        var s = meta && meta.status ? String(meta.status).trim() : "";
        return s || "Beklemede";
    }
    function statusClass(s) {
        if (s === "Onaylandı") return "ok";
        if (s === "Reddedildi") return "rejected";
        if (s === "Tekrar İstendi") return "resend";
        return "pending";
    }

    function currentFiltered() {
        var q = $("#search").value.toLowerCase().trim();
        var type = $("#typeFilter").value;
        var st = $("#statusFilter").value;
        var out = [];
        rows.forEach(function (r, i) {
            var meta = rowMeta[i] || { row: i + 2, status: "" };
            if (type && typeColIndex >= 0 && (r[typeColIndex] || "").trim() !== type) return;
            if (st && statusOf(meta) !== st) return;
            if (q && r.join(" ").toLowerCase().indexOf(q) === -1) return;
            out.push({ r: r, meta: meta });
        });
        return out;
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
        host.appendChild(viewMode === "table" ? buildTable(data) : buildList(data));
        if (!data.length) {
            host.appendChild(elem("div", { class: "empty-state", html: "<span class='ico'>🔍</span>Filtreye uyan başvuru yok." }));
        }
    }

    // ---------- Liste görünümü ----------
    function buildList(data) {
        var groups = {}, order = [];
        data.forEach(function (item) {
            var key = typeColIndex >= 0 ? ((item.r[typeColIndex] || "").trim() || "Diğer") : "Tüm Başvurular";
            if (!groups[key]) { groups[key] = []; order.push(key); }
            groups[key].push(item);
        });
        order.sort(function (a, b) {
            var rank = function (x) {
                if (/delegasyon/i.test(x)) return 1;
                if (/delege/i.test(x)) return 0;
                return 2;
            };
            var ra = rank(a), rb = rank(b);
            return ra !== rb ? ra - rb : a.localeCompare(b, "tr");
        });

        var wrap = elem("div", { class: "app-list" });
        order.forEach(function (key) {
            var items = groups[key];
            wrap.appendChild(elem("div", { class: "app-section-head" }, [
                elem("span", { class: "sec-title", text: key }),
                elem("span", { class: "sec-count", text: items.length + " başvuru" })
            ]));
            var list = elem("div", { class: "app-rows" });
            items.forEach(function (item) { list.appendChild(buildRow(item)); });
            wrap.appendChild(list);
        });
        return wrap;
    }

    function buildRow(item) {
        var r = item.r, meta = item.meta, st = statusOf(meta);
        var name = firstFilled(r, nameIdxs) || "İsimsiz başvuru";
        var phone = firstFilled(r, phoneIdxs);
        var email = firstFilled(r, emailIdxs);
        var sub = [];
        if (phone) sub.push("📞 " + phone);
        if (email) sub.push("✉ " + email);

        var main = elem("button", { class: "app-row-main", type: "button", title: "Detayları gör" }, [
            elem("span", { class: "app-row-name", text: name }),
            elem("span", { class: "app-row-sub", text: sub.join("    ·    ") || "Detaylar için tıklayın" })
        ]);
        main.addEventListener("click", function () { openDetail(item); });

        var actions = elem("div", { class: "app-row-actions" }, [
            elem("span", { class: "status-pill " + statusClass(st), text: st })
        ]);
        if (st === "Beklemede") {
            actions.appendChild(actBtn("✓ Onayla", "pbtn-ok", function () { doSetStatus(item, "Onaylandı"); }));
            actions.appendChild(actBtn("✕ Reddet", "pbtn-danger", function () { doSetStatus(item, "Reddedildi"); }));
            actions.appendChild(actBtn("↻ Tekrar iste", "pbtn-ghost", function () { doSetStatus(item, "Tekrar İstendi"); }));
        } else {
            actions.appendChild(actBtn("↻ Tekrar iste", "pbtn-ghost", function () { doSetStatus(item, "Tekrar İstendi"); }));
            actions.appendChild(actBtn("Geri al", "pbtn-ghost", function () { doSetStatus(item, ""); }));
        }
        return elem("div", { class: "app-row" }, [main, actions]);
    }

    function actBtn(label, cls, fn) {
        var b = elem("button", { class: "pbtn pbtn-sm " + cls, type: "button" }, [label]);
        b.addEventListener("click", function (e) { e.stopPropagation(); fn(); });
        return b;
    }

    function doSetStatus(item, status) {
        var msgs = {
            "Onaylandı": "Bu başvuru ONAYLANACAK ve başvuru sahibine onay e-postası gönderilecek. Emin misiniz?",
            "Reddedildi": "Bu başvuru REDDEDİLECEK. Emin misiniz?",
            "Tekrar İstendi": "Başvuru sahibinden bilgilerini/başvurusunu TEKRAR göndermesi e-posta ile istenecek. Emin misiniz?",
            "": "Bu başvurunun durumu 'Beklemede'ye alınsın mı?"
        };
        if (!confirm(msgs[status] != null ? msgs[status] : "Emin misiniz?")) return;

        Z.Data.setStatus(item.meta.row, status).then(function (res) {
            item.meta.status = status;
            var note = "Durum: " + (status || "Beklemede");
            if (res.emailed) note += " · E-posta gönderildi (" + res.emailTo + ")";
            else if (status === "Onaylandı" || status === "Tekrar İstendi") note += " · ⚠ E-posta adresi bulunamadı, mail gönderilemedi";
            Z.showStatus($("#globalStatus"), "ok", note);
            setTimeout(function () { Z.hideStatus($("#globalStatus")); }, 6000);
            render();
        }).catch(function (err) {
            Z.showStatus($("#globalStatus"), "err", "İşlem başarısız: " + err.message);
        });
    }

    // ---------- Detay modalı ----------
    function openDetail(item) {
        if (!detailModal) detailModal = buildDetailModal();
        var r = item.r, meta = item.meta, st = statusOf(meta);
        $(".detail-title", detailModal).textContent = firstFilled(r, nameIdxs) || "İsimsiz başvuru";

        var typeEl = $(".detail-type", detailModal);
        if (typeColIndex >= 0 && r[typeColIndex]) { typeEl.textContent = String(r[typeColIndex]); typeEl.hidden = false; }
        else typeEl.hidden = true;

        var pill = $(".detail-status", detailModal);
        pill.textContent = st;
        pill.className = "status-pill detail-status " + statusClass(st);

        $(".detail-meta", detailModal).textContent = (tsIdx >= 0 && r[tsIdx]) ? ("Başvuru zamanı: " + String(r[tsIdx])) : "";

        var body = $(".detail-fields", detailModal);
        body.innerHTML = "";
        headers.forEach(function (h, ci) {
            if (ci === tsIdx) return;
            var v = r[ci];
            if (v == null || String(v).trim() === "") return;
            body.appendChild(elem("div", { class: "app-field" }, [
                elem("span", { class: "lbl", text: String(h) }),
                elem("span", { class: "val", text: String(v) })
            ]));
        });

        detailModal.classList.add("open");
        document.body.style.overflow = "hidden";
        var closeBtn = $(".detail-close", detailModal);
        if (closeBtn) closeBtn.focus();
    }

    function buildDetailModal() {
        var overlay = elem("div", { class: "detail-modal", role: "dialog", "aria-modal": "true", "aria-label": "Başvuru detayı" });
        overlay.innerHTML =
            '<div class="detail-modal-card">' +
                '<button type="button" class="detail-close" aria-label="Kapat">&times;</button>' +
                '<div class="detail-head">' +
                    '<h3 class="detail-title"></h3>' +
                    '<span class="status-pill detail-status"></span>' +
                    '<span class="app-type detail-type"></span>' +
                '</div>' +
                '<div class="detail-meta"></div>' +
                '<div class="detail-fields app-fields"></div>' +
            '</div>';
        document.body.appendChild(overlay);
        overlay.addEventListener("click", function (e) { if (e.target === overlay) closeDetail(); });
        $(".detail-close", overlay).addEventListener("click", closeDetail);
        return overlay;
    }

    function closeDetail() {
        if (detailModal) { detailModal.classList.remove("open"); document.body.style.overflow = ""; }
    }

    // ---------- Tablo görünümü ----------
    function buildTable(data) {
        var thHeaders = headers.map(function (h) { return elem("th", { text: h }); });
        thHeaders.unshift(elem("th", { text: "Durum" }));
        var thead = elem("thead", {}, [elem("tr", {}, thHeaders)]);
        var tbody = elem("tbody", {}, data.map(function (item) {
            var tds = headers.map(function (_, ci) {
                return elem("td", { text: item.r[ci] != null ? String(item.r[ci]) : "" });
            });
            tds.unshift(elem("td", {}, [elem("span", { class: "status-pill " + statusClass(statusOf(item.meta)), text: statusOf(item.meta) })]));
            return elem("tr", {}, tds);
        }));
        return elem("div", { class: "table-wrap" }, [elem("table", { class: "data-table" }, [thead, tbody])]);
    }

    // ---------- CSV ----------
    function downloadCsv() {
        if (!headers.length) return;
        var data = currentFiltered();
        var head = ["Durum"].concat(headers);
        var matrix = [head].concat(data.map(function (item) {
            return [statusOf(item.meta)].concat(item.r);
        }));
        var lines = matrix.map(function (row) {
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
