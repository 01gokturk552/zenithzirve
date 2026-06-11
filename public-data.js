/*
 * Zenith Zirve'26 — Genel sayfa dinamik içeriği
 * Konuşmacılar ve program sayfalarını backend/localStorage verisiyle günceller.
 * Backend yoksa ve özelleştirme yapılmamışsa sayfadaki statik içerik korunur (SEO yedeği).
 */
(function () {
    "use strict";
    var Z = window.Zenith;
    if (!Z) return;
    var elem = Z.elem;

    function shouldEnhance(lsKey) {
        try { return Z.hasApi() || localStorage.getItem(lsKey) !== null; }
        catch (e) { return Z.hasApi(); }
    }

    // ---------- Konuşmacılar ----------
    var grid = document.querySelector(".speakers-grid");
    if (grid && shouldEnhance("zenith_speakers")) {
        Z.Data.getSpeakers().then(function (speakers) {
            if (!Array.isArray(speakers) || !speakers.length) return;
            grid.innerHTML = "";
            speakers.forEach(function (sp) {
                var avatar = elem("div", { class: "speaker-avatar" }, [
                    elem("img", {
                        class: "speaker-photo", src: sp.photo || "", alt: sp.name || "",
                        width: "120", height: "120", loading: "lazy", decoding: "async"
                    })
                ]);
                var card = elem("div", { class: "speaker-card" }, [
                    avatar,
                    elem("h3", { text: sp.name || "" }),
                    sp.title ? elem("p", { class: "speaker-title", text: sp.title }) : null
                ]);
                bioParagraphs(sp.bio).forEach(function (p) {
                    card.appendChild(elem("p", { class: "speaker-bio", text: p }));
                });
                grid.appendChild(card);
            });
        }).catch(function () { /* statik içerik kalsın */ });
    }

    // ---------- Program ----------
    var day1 = document.querySelector("#day-1 .program-timeline");
    var day2 = document.querySelector("#day-2 .program-timeline");
    if ((day1 || day2) && shouldEnhance("zenith_program")) {
        Z.Data.getProgram().then(function (program) {
            if (!Array.isArray(program) || !program.length) return;
            renderDay(day1, program.filter(function (x) { return Number(x.day) === 1; }));
            renderDay(day2, program.filter(function (x) { return Number(x.day) === 2; }));
        }).catch(function () { /* statik içerik kalsın */ });
    }

    function renderDay(host, items) {
        if (!host) return;
        host.innerHTML = "";
        items.forEach(function (it) {
            var content = elem("div", { class: "program-content" });
            var photos = (it.photos || []).filter(Boolean);
            var hasSpeaker = (it.speakerNames && it.speakerNames.trim()) || photos.length;

            if (hasSpeaker) {
                var infoChildren = [elem("h3", { text: it.title || "" })];
                if (it.speakerNames) infoChildren.push(elem("p", { class: "speaker-name", text: it.speakerNames }));
                if (it.speakerTitle) infoChildren.push(elem("p", { class: "speaker-title", text: it.speakerTitle }));

                var spk = elem("div", { class: "program-speaker" });
                photos.forEach(function (ph) {
                    spk.appendChild(elem("img", {
                        class: "program-speaker-photo", src: ph, alt: it.speakerNames || "",
                        width: "50", height: "50", loading: "lazy", decoding: "async"
                    }));
                });
                spk.appendChild(elem("div", {}, infoChildren));
                content.appendChild(spk);
                if (it.desc) content.appendChild(elem("p", { text: it.desc }));
            } else {
                content.appendChild(elem("h3", { text: it.title || "" }));
                if (it.desc) content.appendChild(elem("p", { text: it.desc }));
            }

            host.appendChild(elem("div", { class: "program-item" }, [
                elem("div", { class: "program-time", text: it.time || "" }),
                content
            ]));
        });
    }

    function bioParagraphs(bio) {
        if (!bio) return [];
        return String(bio).split(/\n\s*\n/).map(function (s) { return s.trim(); }).filter(Boolean);
    }
})();
