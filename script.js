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
        message: 'Sevgili Delegelerim,\n\nZenith Zirve\'yi hayata geçirmek için aylardır çalışan ekibimizle birlikte büyük bir heyecan içindeyiz. Türkiye\'nin dört bir yanından gelen gençlerin fikirlerini bir araya getirecek bu platformda sizleri ağırlamaktan büyük mutluluk duyuyoruz. Her bir ekibimiz, bu etkinliği en iyi şekilde gerçekleştirmek için özveriyle çalışıyor. Sizleri de aramızda görmeyi diliyorum.'
    },
    ada: {
        name: 'Ada Nehir Şahin',
        role: 'Genel Koordinatör',
        message: 'Değerli Delegelerim,\n\nZenith Zirve\'de sizleri ağırlamak için sabırsızlanıyoruz. Gençlerin potansiyelini ortaya çıkaran, ilham veren ve kendi zirvelerine ulaşmaları için cesaret kazandıran bir platform oluşturmak için çalışıyoruz. Bu yolculukta bizimle olduğunuz için teşekkür ederim.'
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
    elif: {
        name: 'Elif Kaplan',
        role: 'Halkla İlişkiler Başkanı',
        message: 'Değerli Ekibim,\n\nHalkla İlişkiler departmanı olarak zirvenin sesi olacağız. Birlikte çalışarak en iyi iletişimi sağlayacağız.'
    },
    cemre: {
        name: 'Cemre Seçkin',
        role: 'Halkla İlişkiler Başkanı',
        message: 'Sevgili Ekibim,\n\nİletişim gücümüzle zirveyi daha da güçlendireceğiz. Birlikte başaracağız.'
    },
    asli: {
        name: 'Aslı Subaşı',
        role: 'Halkla İlişkiler Başkanı',
        message: 'Değerli Ekibim,\n\nZirvenin tanıtımı ve iletişimi için elimden geleni yapacağım. Birlikte çalışacağız.'
    },
    abdulkadir: {
        name: 'Abdulkadir Özyapıcı',
        role: 'Saha ve Güvenlik Başkanı',
        message: 'Sevgili Ekibim,\n\nGüvenli bir ortam için çalışıyoruz. Her birinizin güvenliği bizim için önemli. Yanınızdayız.'
    },
    deniz: {
        name: 'Deniz Elma',
        role: 'Saha ve Güvenlik Başkanı',
        message: 'Değerli Ekibim,\n\nSaha organizasyonunda her şeyin yolunda gitmesi için çalışıyoruz. Birlikte başaracağız.'
    },
    ebrar: {
        name: 'Ebrar Aygün',
        role: 'Kreatif Başkanı',
        message: 'Sevgili Ekibim,\n\nYaratıcı fikirlerimizle zirveyi özel kılacağız. Birlikte çalışarak harika işler çıkaracağız.'
    },
    akif: {
        name: 'Akif Efe Altunsoy',
        role: 'Kreatif Başkanı',
        message: 'Değerli Ekibim,\n\nKreatif departmanı olarak zirvenin yüzünü oluşturacağız. Birlikte başaracağız.'
    },
    nihal: {
        name: 'Nihal Bayrak',
        role: 'Basın Başkanı',
        message: 'Sevgili Ekibim,\n\nBasın departmanı olarak zirvenin sesini duyuracağız. Birlikte çalışacağız.'
    },
    omer: {
        name: 'Ömer Kamil Okutan',
        role: 'Basın Başkanı',
        message: 'Değerli Ekibim,\n\nMedya ilişkilerinde en iyi sonucu almak için çalışıyoruz. Birlikte başaracağız.'
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
