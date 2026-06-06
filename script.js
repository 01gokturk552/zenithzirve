// Mobil navigasyon menüsü
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Menü linklerine tıklandığında menüyü kapat
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Navbar scroll efekti
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
    }
});

// Aktif sayfa linki
const currentPage = window.location.pathname;
document.querySelectorAll('.nav-menu a').forEach(link => {
    if (link.getAttribute('href') === currentPage || 
        (currentPage === '/' && link.getAttribute('href') === 'index.html')) {
        link.classList.add('active');
    }
});

// İstatistik animasyonu
const animateStats = () => {
    const stats = document.querySelectorAll('.stat-number');
    stats.forEach(stat => {
        const target = parseInt(stat.textContent);
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        
        const updateStat = () => {
            current += step;
            if (current < target) {
                stat.textContent = Math.floor(current);
                requestAnimationFrame(updateStat);
            } else {
                stat.textContent = target;
            }
        };
        
        updateStat();
    });
};

// Sayfa yüklendiğinde istatistik animasyonunu başlat
window.addEventListener('load', () => {
    setTimeout(animateStats, 500);
});

// Scroll animasyonları
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Animasyon eklenecek elementler
document.querySelectorAll('.feature-card, .commission-card, .timeline-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Form gönderimi (başvuru sayfası için)
const form = document.querySelector('form');
if (form) {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Form verilerini al
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // Basit validasyon
        let isValid = true;
        const requiredFields = form.querySelectorAll('[required]');
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                field.style.borderColor = '#ef4444';
            } else {
                field.style.borderColor = '#e5e7eb';
            }
        });
        
        if (isValid) {
            alert('Başvurunuz başarıyla alındı! En kısa sürede size dönüş yapacağız.');
            form.reset();
        } else {
            alert('Lütfen tüm zorunlu alanları doldurun.');
        }
    });
}

// Geri sayım sayacı (etkinlik tarihine kadar)
const countdown = () => {
    const eventDate = new Date('June 27, 2026 09:00:00').getTime();
    const now = new Date().getTime();
    const distance = eventDate - now;
    
    if (distance > 0) {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        // Eğer geri sayım elementi varsa güncelle
        const daysElement = document.getElementById('days');
        const hoursElement = document.getElementById('hours');
        const minutesElement = document.getElementById('minutes');
        const secondsElement = document.getElementById('seconds');
        
        if (daysElement) daysElement.textContent = days.toString().padStart(2, '0');
        if (hoursElement) hoursElement.textContent = hours.toString().padStart(2, '0');
        if (minutesElement) minutesElement.textContent = minutes.toString().padStart(2, '0');
        if (secondsElement) secondsElement.textContent = seconds.toString().padStart(2, '0');
    }
};

// Her saniye geri sayımı güncelle
setInterval(countdown, 1000);
countdown();

// Program tab fonksiyonalitesi
const tabBtns = document.querySelectorAll('.tab-btn');
const programDays = document.querySelectorAll('.program-day');

tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Aktif butonu değiştir
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // İlgili günü göster
        const day = btn.getAttribute('data-day');
        programDays.forEach(day => {
            day.classList.remove('active');
        });
        document.getElementById(`day-${day}`).classList.add('active');
    });
});

// Ekip üyesi mesajları
const teamMessages = {
    yigit: {
        name: 'Yiğit Efe Sevir',
        role: 'Genel Koordinatör',
        message: 'Kıymetli Katılımcılar,\n\nZENITH fikrini ortaya koyarken temel hedefimiz; gençlerin yalnızca bugünün değil, yarının da söz sahibi bireyleri olarak kendilerini geliştirebilecekleri, farklı bakış açılarıyla buluşabilecekleri ve geleceğe dair güçlü bir vizyon oluşturabilecekleri bir platform inşa etmekti. Bu anlayışla ZENITH, yalnızca bir zirve olarak değil; gençliğin potansiyelini ortaya çıkaran, bilgi ve tecrübeyi ortak bir zeminde buluşturan bir gelişim alanı olarak şekillendi.\n\nŞubat ayından bu yana büyük bir özveriyle sürdürdüğümüz hazırlık sürecinde temel amacımız; gençlerin akademi, kamu ve özel sektör temsilcileriyle bir araya gelerek ilham alabilecekleri, kendilerini geliştirebilecekleri ve geleceğe daha güçlü adımlarla hazırlanabilecekleri bir ortam oluşturmaktı. Bugün burada sizlerle bir araya gelmiş olmak, bu hedefin karşılık bulduğunu görmek adına bizler için son derece kıymetlidir.\n\nİçinde bulunduğumuz çağda gençlik, yalnızca geleceğin değil, aynı zamanda bugünün de en önemli aktörlerinden biridir. Bu nedenle gençlerin fikirlerine değer vermenin, onları dinlemenin ve gelişimlerine katkı sunmanın her zamankinden daha büyük bir sorumluluk olduğuna inanıyoruz. Çünkü güçlü bir gelecek; düşünen, sorgulayan, üreten ve sorumluluk alan gençlerin omuzlarında yükselecektir.\n\nZENITH, katılımcılarına tam da bunu sunmayı hedeflemektedir: öğrenmeyi, gelişmeyi, ilham almayı ve farklı perspektiflerle buluşmayı. Zirvemiz boyunca gerçekleştirilecek oturumların ve paylaşımların, her bir katılımcı için yeni ufuklar açmasını temenni ediyoruz.\n\nŞahsım adına ifade etmek isterim ki; aylar süren hazırlıkların ardından bugün bu salonda sizlerle bir arada olmak benim için büyük bir mutluluk ve gurur kaynağıdır. Bu süreçte birlikte emek verdiğimiz Eş Genel Koordinatörüm Ada Nehir Şahin\'e, organizasyon ekibimize, destekçilerimize ve bizleri yalnız bırakmayan tüm katılımcılarımıza teşekkür ediyorum.\n\nBu inanç ve heyecanla, sizleri ZENITH Zirve 2026 çatısı altında öğrenmeye, düşünmeye, yeni bağlantılar kurmaya ve unutulmaz bir deneyimin parçası olmaya davet ediyorum.\n\nSaygılarımla,\n\nYiğit Efe Sevir\nZenith Zirve 2026 Genel Koordinatörü'
    },
    ada: {
        name: 'Ada Nehir Şahin',
        role: 'Genel Koordinatör',
        message: 'Kıymetli Katılımcılar,\n\nZENITH fikri ortaya çıktığında hayalimiz; gençlerin kendilerini özgürce ifade edebilecekleri, farklı düşüncelerle buluşabilecekleri ve geleceğe dair güçlü perspektifler geliştirebilecekleri bir ortam oluşturmaktı. Bu doğrultuda ZENITH\'i yalnızca belirli oturumların gerçekleştirildiği bir zirve olarak değil; gençlerin potansiyellerini keşfedebilecekleri, ilham alabilecekleri ve yeni ufuklar kazanabilecekleri bir buluşma noktası olarak tasarladık.\n\nŞubat ayından bu yana büyük bir heyecan ve özveriyle sürdürdüğümüz hazırlık sürecinde en önemli motivasyonumuz, gençlerin bilgiye, tecrübeye ve farklı bakış açılarına erişebilecekleri nitelikli bir platform oluşturmaktı. Bugün burada sizlerle bir arada olmak ve aylar boyunca emek verdiğimiz bu vizyonun gerçeğe dönüştüğünü görmek bizler için son derece anlamlıdır.\n\nGençliğin yalnızca geleceğin temsilcisi değil, aynı zamanda bugünün değişim ve dönüşüm süreçlerinin de önemli bir parçası olduğuna inanıyoruz. Bu nedenle gençlerin fikirlerini önemsemeyi, onların gelişimlerine katkı sunmayı ve potansiyellerini ortaya çıkarabilecekleri alanlar oluşturmayı büyük bir sorumluluk olarak görüyoru z. Çünkü yarınları şekillendirecek olanlar; öğrenmeye açık, sorumluluk sahibi ve üretken bireylerdir.\n\nZENITH boyunca gerçekleştirilecek oturumların, kurulacak yeni bağlantıların ve paylaşılacak deneyimlerin her bir katılımcı için değerli kazanımlara dönüşmesini temenni ediyoruz. Zirvemizin, gençlerin hayallerini büyüten ve hedeflerine ulaşma yolunda onlara ilham veren bir deneyim olmasını diliyoruz.\n\nŞahsım adına ifade etmek isterim ki; bu sürecin her aşamasında birlikte çalıştığımız Eş Genel Koordinatörüm Yiğit Efe Sevir\'e, organizasyon ekibimize, destekçilerimize ve katılımlarıyla bizlere güç veren tüm misafirlerimize teşekkür ediyorum.\n\nBu vesileyle sizleri, ZENITH Zirve 2026\'nın sunduğu bilgi, deneyim ve ilham dolu yolculuğun bir parçası olmaya davet ediyor; programımızın hepimiz için verimli ve unutulmaz geçmesini temenni ediyorum.\n\nSaygılarımla,\n\nAda Nehir Şahin\nZENITH Zirve 2026 Genel Koordinatörü'
    },
    muhammed: {
        name: 'Muhammed Ömer Bozkuş',
        role: 'Genel Danışman',
        message: 'Sevgili Ekibim,\n\nBu zirvenin başarısı için her birinizin desteği çok değerli. Birlikte çalışarak, birlikte başaracağız. Her adımda yanınızdayım.'
    },
    hanife: {
        name: 'Hanife Ezgi Gören',
        role: 'Genel Danışman',
        message: 'Değerli Ekibim,\n\nSizinle çalışmak büyük bir onur. Her birinizin katkısı bu zirveyi özel kılıyor. Birlikte güzel işler başaracağız.'
    },
    emir: {
        name: 'Emir Kızıltuğ',
        role: 'Genel Danışman',
        message: 'Sevgili Ekibim,\n\nBu yolculukta her birinizin emeği çok değerli. Birlikte çalışarak hedeflerimize ulaşacağız. Yanınızdayım.'
    },
    asude: {
        name: 'Asude Baran',
        role: 'Organizasyon Başkanı',
        message: 'Değerli Ekibim,\n\nOrganizasyon başkanı olarak zirvenin her aşamasında yanınızdayım. Birlikte çalışarak başaracağız.'
    },
    kerem: {
        name: 'Kerem Aytekin',
        role: 'Organizasyon Başkanı',
        message: 'Sevgili Ekibim,\n\nOrganizasyon sürecinde her birinizin desteği çok değerli. Birlikte başaracağız.'
    },
    elif: {
        name: 'Elif Kaplan',
        role: 'Halkla İlişkiler Başkanı',
        message: 'Değerli Katılımcılar,\n\nBizler Halkla İlişkiler Birimi olarak, ZENITH Zirve 2026\'nın yalnızca belirli oturumların gerçekleştirildiği bir organizasyon olmasının ötesinde; katılımcılarımızın kendilerini değerli hissettikleri, yeni insanlarla tanıştıkları ve aidiyet duygusunu deneyimledikleri bir buluşma noktası olmasını hedefliyoruz.\n\nBu doğrultuda hazırlık sürecinin ilk gününden programın son anına kadar sizlerle güçlü, samimi ve sürdürülebilir bir iletişim kurmaya özen gösteriyoruz. Başvuru sürecinden etkinlik gününe, bilgilendirmelerden katılımcı deneyimine kadar her aşamada sizlerin yanında olarak ZENITH deneyimini en verimli şekilde yaşamanıza katkı sunmayı amaçlıyoruz.\n\nİnanıyoruz ki bir zirveyi değerli kılan yalnızca gerçekleştirilen oturumlar değil; kurulan dostluklar, paylaşılan deneyimler ve geride bırakılan güzel hatıralardır. Bu nedenle ZENITH boyunca her bir katılımcımızın kendisini bu büyük ailenin önemli bir parçası olarak hissetmesini önemsiyoruz.\n\nZENITH Zirve 2026\'da sizleri öğrenmeye, ilham almaya, yeni bağlantılar kurmaya ve unutulmaz bir deneyimin parçası olmaya davet ediyorum.\n\nSaygılarımla,\n\nElif Kaplan\nZENITH Zirve 2026\nHalkla İlişkiler Başkanı'
    },
    cemre: {
        name: 'Cemre Seçkin',
        role: 'Halkla İlişkiler Başkanı',
        message: 'Değerli Katılımcılar,\n\nZENITH Zirve 2026\'nın temelinde yalnızca bilgi paylaşımı değil, aynı zamanda güçlü bir iletişim kültürü ve katılımcı deneyimi anlayışı yer almaktadır. Bizler Halkla İlişkiler Birimi olarak, zirvemize katılan her bireyin kendisini bu organizasyonun değerli bir paydaşı olarak hissetmesini amaçlıyoruz.\n\nAylar süren hazırlık sürecinde önceliğimiz; sizlere güvenilir, erişilebilir ve etkin bir iletişim ağı sunmak oldu. Katılımcılarımızın ihtiyaç duydukları her konuda doğru bilgiye zamanında ulaşabilmeleri, süreç boyunca kendilerini desteklenmiş hissetmeleri ve ZENITH deneyimini en iyi şekilde yaşayabilmeleri için çalışmalarımızı titizlikle sürdürüyoruz.\n\nİnanıyoruz ki başarılı organizasyonlar yalnızca program içerikleriyle değil, katılımcılarıyla kurduğu güçlü bağlarla da anlam kazanır. Bu nedenle ZENITH\'in; yeni dostlukların kurulduğu, farklı fikirlerin buluştuğu ve ilham verici anıların biriktiği özel bir deneyime dönüşmesini hedefliyoruz.\n\nBu büyük organizasyonun bir parçası olduğunuz için teşekkür ediyor, ZENITH Zirve 2026\'nın sizler için verimli, keyifli ve unutulmaz bir deneyim olmasını temenni ediyorum.\n\nSaygılarımla,\n\nCemre Seçkin\nZENITH Zirve 2026\nHalkla İlişkiler Başkanı'
    },
    asli: {
        name: 'Aslınur Subaşı',
        role: 'Halkla İlişkiler Başkanı',
        message: 'Değerli Katılımcılar,\n\nZENITH Zirve 2026\'nın en değerli unsurlarından biri, farklı şehirlerden, okullardan ve bakış açılarından gelen gençleri ortak bir zeminde buluşturabilmesidir. Bizler Halkla İlişkiler Birimi olarak, bu buluşmanın her katılımcı için anlamlı, verimli ve unutulmaz bir deneyime dönüşmesini amaçlıyoruz.\n\nHazırlık sürecinin ilk gününden itibaren önceliğimiz; sizlerle güçlü bir iletişim kurmak, ihtiyaç duyduğunuz her konuda destek olmak ve ZENITH deneyimini en iyi şekilde yaşamanıza katkı sağlamaktı. Çünkü başarılı bir organizasyonun yalnızca program içeriğiyle değil, katılımcılarıyla kurduğu bağ ile de değer kazandığına inanıyoruz.\n\nZENITH boyunca edineceğiniz bilgi ve deneyimlerin yanı sıra kuracağınız dostlukların, paylaşacağınız fikirlerin ve biriktireceğiniz anıların da sizler için kalıcı kazanımlara dönüşmesini temenni ediyoruz. Bu zirvenin, her bir katılımcımız için yeni başlangıçlara ve yeni hedeflere ilham vermesini diliyoruz.\n\nKatılımınız ve katkılarınızla değer kazanan ZENITH Zirve 2026\'da sizlerle bir arada olmaktan büyük mutluluk duyuyor, programımızın hepimiz için başarılı ve unutulmaz geçmesini temenni ediyorum.\n\nSaygılarımla,\n\nAslınur Subaşı\nZENITH Zirve 2026\nHalkla İlişkiler Başkanı'
    },
    abdulkadir: {
        name: 'Abdulkadir Özyapıcı',
        role: 'Saha ve Güvenlik Başkanı',
        message: 'Değerli Katılımcılar,\n\nZENITH Zirve 2026\'nın başarılı ve verimli bir şekilde gerçekleştirilebilmesi, güçlü bir organizasyon yapısı ve koordineli bir çalışma anlayışıyla mümkündür. Saha ve Güvenlik Birimi olarak temel hedefimiz; etkinlik süresince tüm operasyonel süreçlerin düzenli, güvenli ve sorunsuz bir şekilde ilerlemesini sağlamaktır.\n\nAylar süren hazırlık sürecinde, zirvemizin her aşamasını titizlikle planlayarak katılımcılarımızın konforunu ve güvenliğini ön planda tuttuk. Program akışından salon düzenine, yönlendirme süreçlerinden genel saha koordinasyonuna kadar her detayı, sizlerin etkinliğe en verimli şekilde odaklanabilmesi için büyük bir hassasiyetle ele aldık.\n\nBizler, başarılı bir organizasyonun yalnızca içeriğiyle değil; düzeni, disiplini ve katılımcılarına sunduğu güven ortamıyla da değer kazandığına inanıyoruz. Bu anlayışla ZENITH boyunca sizlere en iyi deneyimi sunabilmek adına sahada aktif olarak görev alacak ve ihtiyaç duyduğunuz her anda yanınızda olacağız.\n\nZENITH Zirve 2026\'nın sizler için verimli, güvenli ve unutulmaz bir deneyime dönüşmesini temenni ediyor; programımıza hoş geldiniz diyorum.\n\nSaygılarımla,\n\nAbdulkadir Özyapıcı\nZENITH Zirve 2026\nSaha ve Güvenlik Başkanı'
    },
    deniz: {
        name: 'Deniz Elma',
        role: 'Saha ve Güvenlik Başkanı',
        message: 'Değerli Katılımcılar,\n\nZENITH Zirve 2026, farklı alanlardan gençleri ortak bir hedef etrafında buluşturan, bilgi paylaşımını ve kişisel gelişimi teşvik eden önemli bir organizasyondur. Böylesine kapsamlı bir etkinliğin başarılı bir şekilde yürütülebilmesi ise planlı, koordineli ve disiplinli bir çalışma sürecini gerektirmektedir.\n\nSaha ve Güvenlik Birimi olarak önceliğimiz; zirve süresince tüm organizasyon süreçlerinin düzen içerisinde ilerlemesini sağlamak ve katılımcılarımızın kendilerini güvenli, rahat ve etkinliğin bir parçası olarak hissedebilecekleri bir ortam oluşturmaktır. Bu doğrultuda, etkinlik alanındaki tüm operasyonel süreçleri titizlikle takip ederek sizlere en iyi deneyimi sunmak için çalışıyoruz.\n\nİnanıyoruz ki verimli bir etkinlik deneyimi, yalnızca güçlü içeriklerle değil; aynı zamanda düzenli işleyen bir organizasyon yapısıyla mümkündür. Bu nedenle ZENITH boyunca her ayrıntının planlandığı, koordinasyonun kesintisiz sürdürüldüğü ve katılımcı memnuniyetinin ön planda tutulduğu bir ortam oluşturmayı hedefliyoruz.\n\nZENITH Zirve 2026\'nın sizler için yeni fikirlerin, değerli deneyimlerin ve unutulmaz anıların başlangıcı olmasını diliyor; programımıza hoş geldiniz diyorum.\n\nSaygılarımla,\n\nDeniz Elma\nZENITH Zirve 2026\nSaha ve Güvenlik Başkanı'
    },
    ebrar: {
        name: 'Ebrar Aygün',
        role: 'Kreatif Başkanı',
        message: 'Değerli Katılımcılar,\n\nHer organizasyonun bir hikâyesi, her hikâyenin ise kendine özgü bir kimliği vardır. ZENITH Zirve 2026\'nın hazırlık sürecinde bizler Kreatif Birim olarak, bu kimliği en doğru şekilde oluşturmak ve sizlere yansıtmak için büyük bir heyecanla çalıştık.\n\nAmacımız yalnızca görsel çalışmalar üretmek değil; ZENITH\'in vizyonunu, enerjisini ve gençliğe dair taşıdığı anlamı her detayda hissettirebilmekti. Tasarladığımız her içerikte, gençlerin üretkenliğini, yenilikçi bakış açısını ve geleceğe dair umutlarını yansıtmayı hedefledik.\n\nİnanıyoruz ki güçlü fikirler, güçlü anlatımlarla daha etkili hale gelir. Bu nedenle ZENITH boyunca karşılaşacağınız her tasarımın ve her görsel detayın, sizlere bu büyük organizasyonun ruhunu hissettirmesini temenni ediyoruz.\n\nSizleri, ilham veren fikirlerin ve yaratıcılığın buluştuğu ZENITH Zirve 2026\'da görmekten mutluluk duyuyor; programımızın unutulmaz bir deneyime dönüşmesini diliyorum.\n\nSaygılarımla,\n\nEbrar Aygün\nZENITH Zirve 2026\nKreatif Başkanı'
    },
    akif: {
        name: 'Akif Efe Altunsoy',
        role: 'Kreatif Başkanı',
        message: 'Değerli Katılımcılar,\n\nZENITH Zirve 2026\'nın ortaya çıkış sürecinde her detayın bir anlam taşıdığına ve her çalışmanın ortak bir vizyonu yansıttığına inanıyoruz. Kreatif Birim olarak görevimiz, bu vizyonu estetik ve etkili bir anlatımla sizlere ulaştırmak oldu.\n\nAylar süren hazırlık sürecinde, ZENITH\'in gençlik teması etrafında şekillenen ruhunu; tasarımlarımızda, içeriklerimizde ve tüm görsel çalışmalarımızda görünür kılmaya çalıştık. Çünkü bir organizasyonun akıllarda kalmasını sağlayan unsurlardan biri de ortaya koyduğu özgün kimliktir.\n\nBizler için yaratıcılık, yalnızca üretmek değil; aynı zamanda bir fikri etkili bir şekilde ifade edebilmektir. Bu anlayışla hazırladığımız her çalışmanın, ZENITH deneyiminizin anlamlı bir parçası olmasını diliyoruz.\n\nZENITH Zirve 2026\'nın sizler için ilham verici, verimli ve unutulmaz anılarla dolu bir deneyim olmasını temenni ediyor; katılımınız için teşekkür ediyorum.\n\nSaygılarımla,\n\nAkif Efe Altunsoy\nZENITH Zirve 2026\nKreatif Başkanı'
    },
    nihal: {
        name: 'Nihal Bayrak',
        role: 'Basın Başkanı',
        message: 'Değerli Katılımcılar,\n\nZENITH Zirve 2026, gençlerin fikirlerini paylaşabildiği, farklı bakış açılarıyla buluşabildiği ve geleceğe dair yeni perspektifler geliştirebildiği önemli bir platformdur. Basın Birimi olarak görevimiz, bu değerli buluşmanın ortaya koyduğu kazanımları en doğru şekilde kamuoyuna aktarmak ve zirvemizin oluşturduğu etkiyi daha geniş kitlelere ulaştırmaktır.\n\nBugün bilgi kadar bilginin doğru aktarılması da büyük önem taşımaktadır. Bu nedenle ZENITH boyunca gerçekleştirilecek oturumları, paylaşımları ve elde edilen çıktıları titizlikle takip ederek organizasyonumuzun sesini güçlü bir şekilde duyurmayı hedefliyoruz.\n\nİnanıyoruz ki gençliğin ortaya koyduğu fikirler, yalnızca bulunduğu salonda değil, ulaştığı her platformda değer üretmeye devam edecektir. Bu anlayışla ZENITH\'in gençliğin potansiyelini ve vizyonunu yansıtan önemli bir buluşma noktası olmasını temenni ediyoruz.\n\nProgramımıza katılımınız için teşekkür ediyor, ZENITH Zirve 2026\'nın hepimiz için verimli ve ilham verici geçmesini diliyorum.\n\nSaygılarımla,\n\nNihal Bayrak\nZENITH Zirve 2026\nBasın Başkanı'
    },
    omer: {
        name: 'Ömer Kamil Okutan',
        role: 'Basın Başkanı',
        message: 'Değerli Katılımcılar,\n\nHer güçlü organizasyon, yalnızca gerçekleştirildiği anla değil; bıraktığı etki ve oluşturduğu değerle anlam kazanır. ZENITH Zirve 2026 da gençliğin bilgi, vizyon ve üretkenlik ekseninde bir araya geldiği önemli bir organizasyon olarak bu anlayışın temsilcilerinden biridir.\n\nBasın Birimi olarak amacımız; zirvemiz boyunca ortaya çıkan fikirleri, yürütülen çalışmaları ve elde edilen kazanımları doğru, tarafsız ve etkili bir şekilde kamuoyuna aktarmaktır. Çünkü gençlerin ortaya koyduğu her değerli düşüncenin daha geniş kitlelere ulaşmayı hak ettiğine inanıyoruz.\n\nZENITH\'in yalnızca katılımcıları için değil, gençliğin geleceğine dair söz söyleyen herkes için ilham veren bir platform olmasını temenni ediyor; bu önemli yolculuğun bir parçası olduğunuz için sizlere teşekkür ediyorum.\n\nSaygılarımla,\n\nÖmer Kamil Okutan\nZENITH Zirve 2026\nBasın Başkanı'
    },
    meyra: {
        name: 'Meyra Paçali',
        role: 'Finans Başkanı',
        message: 'Sevgili Ekibim,\n\nFinans departmanı olarak zirvenin bütçesini yönetiyoruz. Her birinizin desteği için teşekkür ederim.'
    },
    omur: {
        name: 'Ömür Aydın',
        role: 'İnsan Kaynakları Başkanı',
        message: 'Değerli Ekibim,\n\nİnsan Kaynakları olarak ekibimizin gelişimi için çalışıyoruz. Birlikte başaracağız.'
    },
    eylul: {
        name: 'Eylül Şahin',
        role: 'İnsan Kaynakları Başkanı',
        message: 'Sevgili Ekibim,\n\nEkibimizin mutluluğu ve gelişimi için elimden geleni yapacağım. Yanınızdayım.'
    }
};

// Modal fonksiyonları
function showMessage(memberId) {
    const modal = document.getElementById('messageModal');
    const member = teamMessages[memberId];
    
    if (member) {
        document.getElementById('modalName').textContent = member.name;
        document.getElementById('modalRole').textContent = member.role;
        document.getElementById('modalMessage').textContent = member.message;
        modal.style.display = 'block';
    }
}

function closeModal() {
    const modal = document.getElementById('messageModal');
    modal.style.display = 'none';
}

// Modal dışına tıklandığında kapat
window.onclick = function(event) {
    const modal = document.getElementById('messageModal');
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}
