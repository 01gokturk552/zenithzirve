/*
 * Zenith Zirve'26 — Varsayılan içerik (mevcut site verisi)
 * ------------------------------------------------------------------
 * Tek doğru kaynak: hem genel sayfalar (yedek), hem admin paneli
 * (ilk doldurma / "Mevcut içerikle doldur") bunu kullanır.
 * Apps Script backend'i bu veriyi panelden alır; ayrıca kopya tutmaz.
 *
 * speakers[]: { name, title, bio, photo }   (bio: paragraflar \n\n ile ayrılır)
 * program[] : { day, time, title, desc, speakerNames, speakerTitle, photos[] }
 */
window.ZENITH_DEFAULTS = {
    speakers: [
        {
            name: "Ayrin İbiş",
            title: "Latro Kimya Kurucu Ortak",
            photo: "konuşmacılarımız/ayrinibiş.png",
            bio: `Sürdürülebilir kimya ve inovasyon odaklı faaliyet gösteren Latro Kimya'nın kurucu ortaklarından ve yöneticilerinden (kendi tabirleriyle "Kaşif") biridir. Polimer kimyası alanında 16 yılı aşkın deneyime sahip bir kimya mühendisidir`
        },
        {
            name: "Doç. Dr. Hasan Kütük",
            title: "Yıldız Teknik Üniversitesi, Davutpaşa Kampüsü Eğitim Bilimleri Bölüm Başkan Yardımcısı",
            photo: "konuşmacılarımız/hasankutuk.png",
            bio: `Doç. Dr. Hasan Kütük, eğitim bilimleri, psikolojik danışmanlık ve eğitim psikolojisi alanlarında çalışmalar yürüten bir akademisyendir. Lisans eğitimini Eğitim Bilimleri alanında tamamlamış, aynı zamanda Psikoloji bölümünde çift anadal yapmıştır. Yüksek lisansını Rehberlik ve Psikolojik Danışmanlık alanında, doktorasını ise Marmara Üniversitesi Eğitim Bilimleri Enstitüsünde tamamlamıştır.

Psikolojik danışmanlık, pozitif psikoloji, psikolojik dayanıklılık, ekopsikoloji ve gençlerin ruh sağlığı konularında araştırmalar yürüten Kütük, ulusal ve uluslararası akademik yayınlara sahiptir. Hâlen Yıldız Teknik Üniversitesi Eğitim Fakültesi Eğitim Bilimleri Bölümünde öğretim üyesi olarak görev yapmakta ve akademik çalışmalarını sürdürmektedir.`
        },
        {
            name: "Öğr. Gör. Halenur Kütük",
            title: "İstanbul Esenyurt Üniversitesi, Sağlık Bilimleri Fakültesi Çocuk Gelişimi Bölümü",
            photo: "konuşmacılarımız/halenurkutuk.png",
            bio: `Öğr. Gör. Halenur Kütük, çocuk gelişimi, aile danışmanlığı ve eğitim alanlarında çalışmalar yürüten bir akademisyendir. Lisans eğitimini Medipol Üniversitesi Sağlık Bilimleri Fakültesi Çocuk Gelişimi Bölümünde tamamlamış, ardından lisansüstü eğitimine devam etmiştir. Hâlen İstanbul Esenyurt Üniversitesi Sağlık Bilimleri Fakültesi Çocuk Gelişimi Bölümünde öğretim görevlisi olarak görev yapmaktadır.

Akademik çalışmalarında çocuk gelişimi, aile içi ilişkiler, ebeveynlik, internet bağımlılığının çocuklar üzerindeki etkileri, öğretmenlerin mesleki yeterlilikleri ve eğitim süreçleri gibi konulara odaklanmaktadır. Ulusal akademik dergilerde yayımlanmış bilimsel makaleleri bulunan Kütük, çocukların gelişimini destekleyen aile ve eğitim ortamlarının güçlendirilmesine yönelik araştırmalar yürütmektedir.

Eğitim ve araştırma faaliyetlerinin yanı sıra çeşitli seminer, tanıtım programı ve akademik etkinliklerde yer alan Halenur Kütük, çocuk gelişimi alanında eğitim, araştırma ve toplumsal farkındalık çalışmalarını sürdürmektedir.`
        },
        {
            name: "Dr. Yavuz Dizdar",
            title: "Radyasyon Onkolojisi Doktoru",
            photo: "konuşmacılarımız/yavuzdizdar.png",
            bio: `Dr. Yavuz Dizdar, İstanbul Üniversitesi Onkoloji Enstitüsü'nde görevli radyasyon onkolojisi uzmanı ve akademisyendir. Geleneksel tıbbi tedavi yaklaşımlarının yanı sıra beslenme, doğal ürünler ve kanser ilişkisine dair ses getiren, ezber bozan açıklamaları ve yazdığı kitaplarla tanınmaktadır.`
        },
        {
            name: "Serap Irmak",
            title: "Sokak Lambası Yardımlaşma ve Dayanışma Derneği Kurucusu",
            photo: "konuşmacılarımız/serapırmak.png",
            bio: `Serap Irmak, 1972 İstanbul doğumludur. Sosyal sorumluluk çalışmalarına 1999 Marmara Depremi sonrası başlamış, afet bölgelerinde yardım organizasyonları ve ihtiyaç sahiplerine yönelik destek faaliyetleri yürütmüştür. 2014 yılından itibaren evsiz bireyler ve dezavantajlı çocuklarla aktif çalışmalar gerçekleştirmiş; 2016–2017 yıllarında evsizlerin sosyal hayata uyumunu destekleyen gelişim atölyeleri kurmuştur. 2018 yılında Sokak Lambası Yardımlaşma ve Dayanışma Derneği'ni kurarak evsizlere günlük sıcak yemek dağıtımı, afet yardımları ve dezavantajlı gruplara yönelik sosyal projeler yürütmektedir. 2022 En Başarılı Kadın Girişimci ve 2025 Meslekte Yüksek Hizmet Ödülü sahibidir. Evli ve iki çocuk annesidir.`
        },
        {
            name: "Emircan Turan",
            title: "İstanbul Büyükşehir Belediyesi Taekwondo Takımı Kaptanı",
            photo: "konuşmacılarımız/emircanturan.png",
            bio: `Beş yaşında Türk Hava Kuvvetleri'nde tekvando ile tanışan Emircan Turan, 20 yılı aşkın süredir bu sporu sürdürüyor. Birçok kez Türkiye şampiyonu olarak önemli başarılara imza atan Turan, aynı zamanda Avrupa üçüncülüğü ve uluslararası arenada birçok madalya sahibi. Marmara Üniversitesi Spor Bilimleri Fakültesi mezunu olan Emircan Turan, hâlen İstanbul Büyükşehir Belediyesi Tekvando Takımı'nın kaptanlığını yürütüyor.`
        },
        {
            name: "Avni Bilal Demirtaş",
            title: "Arcode Digital Kurucusu",
            photo: "konuşmacılarımız/avnibilaldemirtaş.png",
            bio: `Avni Bilal Demirtaş, teknoloji ve girişimcilik alanlarında Türkiye ve yurt dışında projeler yürüten bir yazılım girişimcisidir. Girişimcilik yolculuğuna lise yıllarında kurduğu SinovA şirketiyle başlamış, Koç Holding'in sponsorluğuyla ulusal başarı elde etmiş ve ESP sertifikası almaya hak kazanmıştır. YTÜ Matematik Mühendisliği mezunu olan Demirtaş, farklı ülkelerde mobil yazılım uzmanı ve teknik lider olarak aktif roller üstlenmiştir. 2022'de kurduğu Arcode Digital ile 11 ülkede 100'den fazla şirkete danışmanlık ve yazılım hizmetleri sunmaktadır. Bugün şirketinin yanı sıra mezunu olduğu Genç Başarı Eğitim Vakfı'nda mentor olarak görev yapmakta ve etkileyici konuşmalarıyla binlerce gence ilham vermeye devam etmektedir.`
        },
        {
            name: "Uzm. Dyt. Şevval Beyza Kulaksız",
            title: "Uzman Diyetisyen",
            photo: "konuşmacılarımız/Uzm. Dyt. Şevval Beyza Kulaksız.png",
            bio: `Uzman Diyetisyen Şevval Beyza Kulaksız, Medipol Üniversitesi Beslenme ve Diyetetik Bölümü'nden mezun olmuş, ardından Klinik Beslenme ve Diyetetik Yüksek Lisans Programı'nı başarıyla tamamlamıştır. Yüksek lisans tez çalışmasında, son yıllarda bilim dünyasında giderek daha fazla önem kazanan bağırsak-beyin ekseni kapsamında "duygusal yeme davranışı ile bağırsak sağlığı arasındaki ilişkiyi" incelemiştir.

Meslek hayatına kendi beslenme ve danışmanlık merkezinde devam eden Kulaksız; obezite, kilo yönetimi, bağırsak sağlığı, duygusal yeme davranışı ve hastalıklarda tıbbi beslenme tedavisi alanlarında çalışmalarını sürdürmektedir. Danışanlarına bilimsel temelli, sürdürülebilir ve kişiye özel beslenme yaklaşımları sunmaktadır.

Lisans eğitimi süresince Medipol Üniversitesi Akreditasyon Temsilcisi ve Beslenme ve Diyetetik Bölümü Ölçme ve Değerlendirme Komisyonu Öğrenci Temsilcisi olarak görev almış, ayrıca TÜBİTAK 2209-A kapsamında yürütücülüğünü üstlendiği akademik araştırma projesini başarıyla tamamlamıştır.

Bilimsel araştırmaları klinik uygulamalarla birleştiren yaklaşımıyla, beslenme biliminin güncel gelişmelerini danışanlarına ve meslektaşlarına aktarmaya devam etmektedir.`
        },
        {
            name: "#10906 Lunea Lumen",
            title: "FIRST Robotics Competition (FRC) Takımı",
            photo: "konuşmacılarımız/lunealumen.png",
            bio: `İstanbul Üsküdar merkezli, Türkiye'nin farklı illerinden bir araya gelen 11 lise öğrencisi ve 4 mentörden oluşan bir FIRST Robotics Competition (FRC) takımıdır. "Ay yükseldiğinde, kurtlar ışığın hayalini kurar" sloganıyla yola çıkan ekip, bilimi ve mühendisliği yaymayı ve STEM alanında kadın temsiliyetini güçlendirmeyi hedefler.`
        },
        {
            name: "Cygnus Robotics (#9473)",
            title: "FIRST Robotics Competition (FRC) Takımı",
            photo: "konuşmacılarımız/cygnus.png",
            bio: `İstanbul, Esenyurt'tan yarışmalara katılan Cygnus Robotics, gençlerin STEM alanındaki gelişimlerini destekleyen aktif bir FIRST Robotics Competition (FRC) takımıdır. Takım; tasarım, yazılım, elektronik ve medya alt takımlarıyla kapsamlı bir robotik ekosistemi yürütmektedir.`
        }
    ],

    program: [
        // 1. Gün — 27 Haziran 2026
        { day: 1, time: "09.00 – 10.00", title: "Kayıt / Kahvaltı", desc: "Katılımcı kayıtları ve kahvaltı (1 saat)", speakerNames: "", speakerTitle: "", photos: [] },
        { day: 1, time: "10.00 – 10.30", title: "Açılış Konferansı", desc: "Etkinlik açılış konuşması (30 dk)", speakerNames: "", speakerTitle: "", photos: [] },
        { day: 1, time: "10.30 – 11.20", title: "1. Oturum", desc: "Konuşmacı sunumu (50 dk)", speakerNames: "Serap Irmak", speakerTitle: "Sokak Lambası Yardımlaşma ve Dayanışma Derneği Kurucusu", photos: ["konuşmacılarımız/serapırmak.png"] },
        { day: 1, time: "11.20 – 11.50", title: "Ara", desc: "Mola (30 dk)", speakerNames: "", speakerTitle: "", photos: [] },
        { day: 1, time: "11.50 – 12.40", title: "2. Oturum", desc: "Konuşmacı sunumu (50 dk)", speakerNames: "Doç. Dr. Hasan Kütük & Öğr. Gör. Halenur Kütük", speakerTitle: "", photos: ["konuşmacılarımız/hasankutuk.png", "konuşmacılarımız/halenurkutuk.png"] },
        { day: 1, time: "12.40 – 13.40", title: "Öğle Arası", desc: "Yemek molası (1 saat)", speakerNames: "", speakerTitle: "", photos: [] },
        { day: 1, time: "13.40 – 14.30", title: "3. Oturum", desc: "Konuşmacı sunumu (50 dk)", speakerNames: "Dr. Yavuz Dizdar", speakerTitle: "Radyasyon Onkolojisi Doktoru", photos: ["konuşmacılarımız/yavuzdizdar.png"] },
        { day: 1, time: "14.30 – 15.00", title: "Ara", desc: "Mola (30 dk)", speakerNames: "", speakerTitle: "", photos: [] },
        { day: 1, time: "15.00 – 16.00", title: "Workshop", desc: "Atölye çalışması (1 saat)", speakerNames: "", speakerTitle: "", photos: [] },
        { day: 1, time: "16.00 – 16.30", title: "Ara", desc: "Mola (30 dk)", speakerNames: "", speakerTitle: "", photos: [] },
        { day: 1, time: "16.30 – 17.20", title: "4. Oturum", desc: "Konuşmacı sunumu (50 dk)", speakerNames: "#10906 Lunea Lumen & Cygnus Robotics (#9473)", speakerTitle: "FIRST Robotics Competition (FRC) Takımları", photos: ["konuşmacılarımız/lunealumen.png", "konuşmacılarımız/cygnus.png"] },

        // 2. Gün — 28 Haziran 2026
        { day: 2, time: "09.00 – 09.40", title: "Kahvaltı", desc: "Güne başlangıç kahvaltısı (40 dk)", speakerNames: "", speakerTitle: "", photos: [] },
        { day: 2, time: "09.40 – 10.30", title: "5. Oturum", desc: "Konuşmacı sunumu (50 dk)", speakerNames: "Ayrin İbiş", speakerTitle: "Latro Kimya Kurucu Ortak", photos: ["konuşmacılarımız/ayrinibiş.png"] },
        { day: 2, time: "10.30 – 11.00", title: "Ara", desc: "Mola (30 dk)", speakerNames: "", speakerTitle: "", photos: [] },
        { day: 2, time: "11.00 – 11.50", title: "6. Oturum", desc: "Konuşmacı sunumu (50 dk)", speakerNames: "Emircan Turan", speakerTitle: "İstanbul Büyükşehir Belediyesi Taekwondo Takımı Kaptanı", photos: ["konuşmacılarımız/emircanturan.png"] },
        { day: 2, time: "11.50 – 12.20", title: "Ara", desc: "Mola (30 dk)", speakerNames: "", speakerTitle: "", photos: [] },
        { day: 2, time: "12.20 – 13.10", title: "7. Oturum", desc: "Konuşmacı sunumu (50 dk)", speakerNames: "Avni Bilal Demirtaş", speakerTitle: "Arcode Digital Kurucusu", photos: ["konuşmacılarımız/avnibilaldemirtaş.png"] },
        { day: 2, time: "13.10 – 15.00", title: "Öğle Arası", desc: "Yemek molası (1 saat 50 dk)", speakerNames: "", speakerTitle: "", photos: [] },
        { day: 2, time: "15.00 – 15.50", title: "8. Oturum", desc: "Konuşmacı sunumu (50 dk)", speakerNames: "Uzm. Dyt. Şevval Beyza Kulaksız", speakerTitle: "Uzman Diyetisyen", photos: ["konuşmacılarımız/Uzm. Dyt. Şevval Beyza Kulaksız.png"] },
        { day: 2, time: "15.50 – 16.20", title: "Ara", desc: "Mola (30 dk)", speakerNames: "", speakerTitle: "", photos: [] },
        { day: 2, time: "16.20 – 17.10", title: "9. Oturum", desc: "Konuşmacı sunumu (50 dk)", speakerNames: "", speakerTitle: "", photos: [] },
        { day: 2, time: "17.10 – 18.10", title: "Kapanış Konferansı", desc: "Etkinlik kapanış konuşması (1 saat)", speakerNames: "", speakerTitle: "", photos: [] }
    ]
};
