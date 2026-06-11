/*
 * Zenith Zirve'26 — Panel ortak katmanı
 * API adaptörü (Google Apps Script) + localStorage yedeği + oturum + yardımcılar
 */
(function () {
    "use strict";

    var CFG = window.ZENITH_CONFIG || {};
    var API_URL = (CFG.apiUrl || "").trim();
    var DEFAULTS = window.ZENITH_DEFAULTS || { speakers: [], program: [] };

    var LS = {
        speakers: "zenith_speakers",
        program: "zenith_program",
        token: "zenith_token",
        role: "zenith_role"
    };
    // Yalnızca backend (Apps Script) bağlı DEĞİLKEN geçerli demo şifreleri.
    // Gerçek şifreler backend'de (Script Properties: ADMIN_PASSWORD / IK_PASSWORD) tutulur.
    var LOCAL_PASSWORDS = { admin: "zenithadmin2026", ik: "zenithik2026" };

    function hasApi() { return API_URL.length > 0; }

    // ---- localStorage yardımcıları (yedek mod) ----
    function lsGet(key, fallback) {
        try {
            var raw = localStorage.getItem(key);
            return raw ? JSON.parse(raw) : fallback;
        } catch (e) { return fallback; }
    }
    function lsSet(key, val) { localStorage.setItem(key, JSON.stringify(val)); }

    function seededSpeakers() {
        var s = lsGet(LS.speakers, null);
        if (!s) { s = JSON.parse(JSON.stringify(DEFAULTS.speakers)); }
        return s;
    }
    function seededProgram() {
        var p = lsGet(LS.program, null);
        if (!p) { p = JSON.parse(JSON.stringify(DEFAULTS.program)); }
        return p;
    }

    // ---- Ağ ----
    function apiGet(params) {
        var qs = Object.keys(params).map(function (k) {
            return encodeURIComponent(k) + "=" + encodeURIComponent(params[k]);
        }).join("&");
        return fetch(API_URL + "?" + qs, { method: "GET" })
            .then(function (r) { return r.json(); });
    }

    function apiPost(body) {
        // text/plain → CORS preflight (OPTIONS) tetiklenmez; Apps Script ile uyumlu
        return fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "text/plain;charset=utf-8" },
            body: JSON.stringify(body)
        }).then(function (r) { return r.json(); });
    }

    // ---- Oturum ----
    var Auth = {
        token: function () { return sessionStorage.getItem(LS.token) || ""; },
        role: function () { return sessionStorage.getItem(LS.role) || ""; },
        isAuthed: function (role) {
            if (!this.token()) return false;
            return role ? this.role() === role : true;
        },
        logout: function () {
            sessionStorage.removeItem(LS.token);
            sessionStorage.removeItem(LS.role);
        },
        login: function (role, password) {
            if (!password) return Promise.resolve({ ok: false, error: "Şifre boş olamaz." });
            if (!hasApi()) {
                if (LOCAL_PASSWORDS[role] && password === LOCAL_PASSWORDS[role]) {
                    sessionStorage.setItem(LS.token, password);
                    sessionStorage.setItem(LS.role, role);
                    return Promise.resolve({ ok: true, mode: "local" });
                }
                return Promise.resolve({ ok: false, error: "Hatalı şifre (demo modu)." });
            }
            return apiPost({ action: "login", role: role, password: password }).then(function (res) {
                if (res && res.ok && res.token) {
                    sessionStorage.setItem(LS.token, res.token);
                    sessionStorage.setItem(LS.role, role);
                    return { ok: true, mode: "api" };
                }
                return { ok: false, error: (res && res.error) || "Giriş başarısız." };
            }).catch(function () {
                return { ok: false, error: "Sunucuya ulaşılamadı." };
            });
        }
    };

    // ---- Veri API'si ----
    var Data = {
        mode: function () { return hasApi() ? "api" : "local"; },

        getSpeakers: function () {
            if (!hasApi()) return Promise.resolve(seededSpeakers());
            return apiGet({ action: "speakers" }).then(function (res) {
                if (res && res.ok && Array.isArray(res.data)) {
                    return res.data.length ? res.data : JSON.parse(JSON.stringify(DEFAULTS.speakers));
                }
                throw new Error((res && res.error) || "Konuşmacılar alınamadı.");
            });
        },

        getProgram: function () {
            if (!hasApi()) return Promise.resolve(seededProgram());
            return apiGet({ action: "program" }).then(function (res) {
                if (res && res.ok && Array.isArray(res.data)) {
                    return res.data.length ? res.data : JSON.parse(JSON.stringify(DEFAULTS.program));
                }
                throw new Error((res && res.error) || "Program alınamadı.");
            });
        },

        saveSpeakers: function (speakers) {
            if (!hasApi()) { lsSet(LS.speakers, speakers); return Promise.resolve({ ok: true }); }
            return apiPost({ action: "saveSpeakers", token: Auth.token(), data: speakers })
                .then(checkSave);
        },

        saveProgram: function (program) {
            if (!hasApi()) { lsSet(LS.program, program); return Promise.resolve({ ok: true }); }
            return apiPost({ action: "saveProgram", token: Auth.token(), data: program })
                .then(checkSave);
        },

        getApplications: function () {
            if (!hasApi()) {
                return Promise.resolve({ ok: true, local: true, headers: [], rows: [] });
            }
            return apiGet({ action: "applications", token: Auth.token() }).then(function (res) {
                if (res && res.ok) return res;
                throw new Error((res && res.error) || "Başvurular alınamadı.");
            });
        }
    };

    function checkSave(res) {
        if (res && res.ok) return res;
        throw new Error((res && res.error) || "Kaydedilemedi.");
    }

    // ---- DOM yardımcıları ----
    function $(sel, root) { return (root || document).querySelector(sel); }
    function $all(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

    function elem(tag, attrs, children) {
        var node = document.createElement(tag);
        if (attrs) Object.keys(attrs).forEach(function (k) {
            if (k === "class") node.className = attrs[k];
            else if (k === "html") node.innerHTML = attrs[k];
            else if (k === "text") node.textContent = attrs[k];
            else if (k.slice(0, 2) === "on" && typeof attrs[k] === "function") node.addEventListener(k.slice(2), attrs[k]);
            else if (attrs[k] != null) node.setAttribute(k, attrs[k]);
        });
        (children || []).forEach(function (c) {
            if (c == null) return;
            node.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
        });
        return node;
    }

    function escapeHtml(s) {
        return String(s == null ? "" : s)
            .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
    }

    function showStatus(node, type, msg) {
        if (!node) return;
        node.className = "status show " + type;
        node.textContent = msg;
    }
    function hideStatus(node) { if (node) node.className = "status"; }

    // ---- Dışa aktar ----
    window.Zenith = {
        Auth: Auth,
        Data: Data,
        hasApi: hasApi,
        defaults: DEFAULTS,
        demoPasswords: LOCAL_PASSWORDS,
        $: $, $all: $all, elem: elem, escapeHtml: escapeHtml,
        showStatus: showStatus, hideStatus: hideStatus
    };
})();
