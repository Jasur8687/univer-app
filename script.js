function selectLanguage(lang) {
  document.getElementById('langSelect').style.display = 'none';
  localStorage.setItem('lang', lang);

  const linksByLang = {
    en: {
      play: 'https://1wzyuh.com/?open=register&p=1ogz',
      guide: 'https://t.me/skript1win_bot'
    },
    ru: {
      play: 'https://1wzyuh.com/?open=register&p=1ogz',
      guide: 'https://t.me/skript1win_bot'
    },
    tj: {
      play: 'https://1wprde.com/?open=register&p=vayp',
      guide: 'https://t.me/skript1win_bot'
    },
    uz: {
      play: 'https://1wzyuh.com/?open=register&p=1ogz',
      guide: 'https://t.me/skript1win_bot'
    }
  };

  const headlines = {
    en: 'Win Today!',
    ru: 'Выигрывай уже сегодня!',
    tj: 'Имрӯз ғолиб шав!',
    uz: 'Bugun yutib oling!'
  };
  const subtexts = {
    en: 'Play at 1Win and win real money. Fast deposit, instant prizes.',
    ru: 'Играй в 1Win и выигрывай реальные деньги. Быстрый депозит, мгновенные призы.',
    tj: 'Дар 1Win бозӣ кун ва пул кор кун. Депозити зуд, бурдҳои фаврӣ.',
    uz: '1Win o‘yin o‘ynang va real pul yutib oling. Tez to‘lov, tez sovg‘alar.'
  };
  const navLabels = {
    en: 'Telegram',
    ru: 'Телеграм',
    tj: 'Телеграм',
    uz: 'Telegram'
  };
  const playLabels = {
    en: 'Play ✅',
    ru: 'Играть ✅',
    tj: 'Бозӣ кардан ✅',
    uz: 'O‘ynash ✅'
  };
  const guideLabels = {
    en: '📘 Guide',
    ru: '📘 Инструкция',
    tj: '📘 Дастур',
    uz: '📘 Qo‘llanma'
  };

  document.getElementById('headline').innerText = headlines[lang];
  document.getElementById('subtext').innerText = subtexts[lang];
  document.getElementById('navGuide').innerText = navLabels[lang];
  document.getElementById('playBtn').innerText = playLabels[lang];
  document.getElementById('guideBtn').innerText = guideLabels[lang];

  document.getElementById('playBtn').onclick = () => {
    window.location.href = linksByLang[lang].play;
  };
  document.getElementById('guideBtn').onclick = () => {
    window.location.href = linksByLang[lang].guide;
  };
}

window.onload = () => {
  const savedLang = localStorage.getItem('lang');
  if (savedLang) {
    document.getElementById('langSelect').style.display = 'none';
    document.getElementById('hero').style.display = 'flex';
    selectLanguage(savedLang);
  }
};
function openPolicy() {
  const lang = localStorage.getItem('lang') || 'ru';

  const policyData = {
    ru: {
      title: 'Политика и условия',
      text: 'Используя наш сайт, вы соглашаетесь с нашей политикой конфиденциальности и условиями использования. Мы не передаём ваши данные третьим лицам. Доступ разрешён только лицам старше 18 лет.'
    },
    tj: {
      title: 'Сиёсати махфият ва шартҳо',
      text: 'Бо истифода аз сомонаи мо, шумо шартҳо ва сиёсати махфиятро мепазиред. Мо маълумоти шуморо ба шахсони сеюм намедиҳем. Танҳо барои шахсони аз 18 боло дастрас аст.'
    },
    uz: {
      title: 'Maxfiylik siyosati va shartlar',
      text: 'Saytimizdan foydalangan holda, siz maxfiylik siyosati va foydalanish shartlariga rozilik bildirasiz. Biz sizning ma’lumotlaringizni uchinchi tomonlarga bermaymiz. Faqat 18 yoshdan katta foydalanuvchilarga mo‘ljallangan.'
    }
  };

  document.getElementById('policyTitle').innerText = policyData[lang].title;
  document.getElementById('policyText').innerText = policyData[lang].text;
  document.getElementById('policyModal').style.display = 'flex';
}

function closePolicy() {
  document.getElementById('policyModal').style.display = 'none';
}
