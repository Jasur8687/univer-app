<template>
  <section class="template card">
    <div class="template-actions no-print">
      <button class="save-pdf" @click="savePdf">Сохранить как PDF</button>
    </div>
    <div class="student-photo" v-if="student.photo">
      <img :src="student.photo" alt="Фото студента" />
    </div>
    <div class="doc-header">
      <p>БА ДИРЕКТОРИ МДТ «ДОНИШКАДАИ ИҚТИСОД ВА САВДОИ ДОГИШГОХИ <br>ДАВЛАТИИ ТИҶОРАТИ ТОҶИКИСТОН»</p>
      <p>АЗ ШАҲРВАНД <span class="blank">{{ line(getFullName(student), 'ФИО') }}</span></p>
      <p>
        истиқоматкунандаи
        <span class="blank">{{ line(student.address, 'Манзили зист') }}</span>
      </p>
      <p>
        Хатмкунандаи мактаби (таҳсилоти миёнаи умумӣ, гимназия, литсей)
        <br>
        <span class="blank">{{ line(student.schoolName, 'Номи муассиса') }}</span>
        - № <span class="blank short">{{ line(student.schoolNumber, '№') }}</span>
        , соли хатм
        <span class="blank short">{{ line(student.graduationYear, '2025') }}</span>
      </p>
    </div>

    <h2 class="title">АРИЗА</h2>

    <p>
      Хоҳиш мекунам, ки ҳуҷҷатҳои манро барои қабул шудан ба шакли таҳсили
      <span class="blank">{{ line(student.studyForm, 'рӯзона') }}</span>
      <br>МДТ «Донишкадаи иқтисод ва савдои ДДТТ дар ш. Хуҷанд», ба факултети
      <span class="blank">{{ line(student.facultyName, 'номи факултет') }}</span>,
      аз рӯи ихтисоси
      <span class="blank">{{ line(student.specialty, '1-250108-баҳисобгирии бухгалтерӣ, таҳлил ва аудит') }}</span>,
      гурӯҳи таҳсил бо забони
      <span class="blank short">{{ line(student.language, 'русӣ') }}</span>
      иҷозат диҳед.
    </p>

    <p>
      Ба хобгоҳ эҳтиёҷмандам, эҳтиёҷманд нестам
      <span class="blank short">{{ line(student.dormitoryNeed, 'Не') }}</span>
    </p>

    <div class="info">
      <p>
        Дар бораи худ маълумотҳои зеринро медиҳам:
      </p>
      <p>
        Ҷинс: <span class="blank short">{{ line(student.gender, 'мард/зан') }}</span>
        Миллат/тоҷик Рӯз, моҳ ва соли таваллуд
        <span class="blank short">{{ formattedBirthDate }}</span>
      </p>
      <p>
        Ҷои таваллуд ш.
        <span class="blank">{{ line(student.birthPlace, 'Хуҷанд') }}</span>
      </p>
      <p>
        Мансубияти иҷтимоӣ
        <span class="blank">{{ line(student.socialStatus, 'коргар') }}</span>
      </p>
    </div>

    <div class="parents">
      <p>
        Номи пурраи падару модар, суроға, дар куҷо ва дар кадом вазифа кор мекунад, рақами телефон
      </p>
      <p>
        Падар:
        <span class="blank">{{ line(student.fatherName, 'ФИО') }}</span>
        <span class="blank">{{ line(student.fatherJob, 'соҳибкор') }}</span>
        рақами телефон
        <span class="blank short">{{ line(student.fatherPhone, '11260 2222') }}</span>
      </p>
      <p>
        Модар:
        <span class="blank">{{ line(student.motherName, 'ФИО') }}</span>
        <span class="blank">{{ line(student.motherJob, 'хонашин') }}</span>
        рақами телефон
        <span class="blank short">{{ line(student.motherPhone, '92 744 88 80') }}</span>
      </p>
    </div>

    <p>
      Дар бораи худам маълумотҳои иловагиро медиҳам:
      <span class="blank">{{ line(student.contactPhone, '98-744-88-74') }}</span>
      <span class="small-hint">(телефон ва дигар маълумотҳои иловагӣ)</span>
    </p>

    <div class="footer">
      <p>
        Ба қоидаҳои қабул ба мактаби олӣ барои соли таҳсили 202__–202__ шинос шудам
        <span class="blank short">{{ line(student.rulesAcknowledged, 'ҳа') }}</span>
      </p>
      <p>
        «<span class="blank tiny">{{ dayValue }}</span>»
        <span class="blank short">{{ monthYearValue }}</span>
        Имзо ____________________
      </p>
    </div>

    <p class="muted small">
      Бланк обновляется при вводе данных и повторяет структуру оригинальной «Ариза».
    </p>
  </section>
</template>

<script setup>
import { computed } from 'vue';
import html2pdf from 'html2pdf.js';

const props = defineProps({
  student: {
    type: Object,
    required: true,
  },
});

const formattedBirthDate = computed(() => formatBirthDate(props.student.birthDate) || '—');

const formattedApplicationDate = computed(() => formatDate(props.student.applicationDate));

const dayValue = computed(() => formattedApplicationDate.value?.split(' ')[0] || '___');
const monthYearValue = computed(() => {
  if (!formattedApplicationDate.value) return '__________ 20__';
  const parts = formattedApplicationDate.value.split(' ');
  parts.shift();
  return parts.join(' ');
});

function formatBirthDate(value) {
  if (!value) return '';
  try {
    const date = new Date(value);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}. ${month}. ${year}`;
  } catch {
    return value;
  }
}

function formatDate(value) {
  if (!value) return '';
  try {
    return new Date(value).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  } catch {
    return value;
  }
}

function line(value, placeholder) {
  if (value === undefined || value === null) return placeholder;
  if (typeof value === 'string') {
    const trimmed = value.trim();
    return trimmed.length ? trimmed : placeholder;
  }
  return value || placeholder;
}

function getFullName(student) {
  if (!student) return '';
  if (student.fullName && student.fullName.trim()) return student.fullName.trim();
  const parts = [student.lastName, student.firstName, student.middleName].filter(Boolean);
  return parts.length ? parts.join(' ') : '';
}

async function savePdf() {
  const el = document.querySelector('.template');
  if (!el) return;

  const opt = {
    margin: [10, 10, 10, 10],
    filename: `application_${(props.student?.fullName || 'application').replace(/\s+/g, '_')}.pdf`,
    image: { type: 'jpeg', quality: 1 },
    html2canvas: { scale: 2, useCORS: true, backgroundColor: '#ffffff' },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
  };

  // Клонируем шаблон в offscreen-контейнер чтобы не менять DOM на странице
  const clone = el.cloneNode(true);
  clone.classList.add('pdf-export');

  // Создадим контейнер вне экрана, установим нужные размеры для рендера A4
  const wrapper = document.createElement('div');
  wrapper.style.position = 'fixed';
  wrapper.style.left = '-9999px';
  wrapper.style.top = '0';
  wrapper.style.width = '210mm';
  wrapper.style.height = '297mm';
  wrapper.style.overflow = 'hidden';
  wrapper.appendChild(clone);
  document.body.appendChild(wrapper);

  // Скрываем .no-print внутри клона
  const hiddenCloneNodes = [];
  clone.querySelectorAll('.no-print').forEach((n) => {
    hiddenCloneNodes.push({ node: n, display: n.style.display });
    n.style.display = 'none';
  });

  try {
    // Устанавливаем targetOccupancy и пределы масштабирования (чтобы занять 95% высоты при необходимости)
    const targetOccupancy = 0.95; // желаемая заполненность по высоте страницы
    const maxScale = 1.12; // небольшое увеличение когда содержимого меньше, чем страница
    const minScale = 0.7; // минимальное уменьшение для очень больших данных

    // width/height для клона
    const pxWidth = clone.clientWidth || wrapper.clientWidth;
    const contentHeight = clone.scrollHeight;
    const contentWidth = clone.scrollWidth;
    const allowedHeightPx = (pxWidth * 277) / 210; // высота в px по пропорции (A4 - поля 10mm сверху/снизу)
    const desiredHeight = allowedHeightPx * targetOccupancy;

    let heightScale = desiredHeight / contentHeight;
    const widthScale = pxWidth / contentWidth;
    let scale = Math.min(heightScale, widthScale);

    if (scale > maxScale) scale = maxScale;
    if (scale < minScale) scale = minScale;

    if (Math.abs(scale - 1) > 0.005) {
      clone.style.transformOrigin = 'top left';
      clone.style.transform = `scale(${scale})`;
      clone.style.width = `${pxWidth / scale}px`;
    }

    // Адаптивно уменьшаем шрифт в .blank при необходимости, чтобы избежать горизонтального переполнения
    clone.querySelectorAll('.blank').forEach((b) => {
      if (b.scrollWidth > b.clientWidth) {
        const overflowRatio = b.clientWidth / b.scrollWidth;
        const cur = window.getComputedStyle(b).fontSize;
        const curVal = parseFloat(cur) || 16;
        const newSize = Math.max(10, Math.floor(curVal * overflowRatio));
        b.style.fontSize = `${newSize}px`;
        b.style.lineHeight = '1.2';
      }
    });

    // Принудительно включаем перенос слов для всех текстовых элементов в клоне
    clone.querySelectorAll('p, span, div, td, th, li').forEach((el) => {
      el.style.wordWrap = 'break-word';
      el.style.overflowWrap = 'break-word';
      el.style.wordBreak = 'break-word';
      el.style.whiteSpace = 'normal';
    });

    // Для doc-header уменьшаем размер шрифта, если текст длинный
    const docHeader = clone.querySelector('.doc-header');
    if (docHeader) {
      docHeader.querySelectorAll('p').forEach((p) => {
        if (p.scrollWidth > p.clientWidth) {
          p.style.fontSize = '0.75rem';
          p.style.lineHeight = '1.3';
        }
      });
    }

    await html2pdf().set(opt).from(clone).save();
  } catch (err) {
    // fallback: открыть диалог печати
    if (typeof window !== 'undefined' && window.print) window.print();
  } finally {
    // восстановим скрытые элементы (если они остались)
    try {
      hiddenCloneNodes.forEach((h) => (h.node.style.display = h.display));
      if (wrapper.parentNode) document.body.removeChild(wrapper);
    } catch (e) {
      // ignore cleanup errors
    }
  }
}
</script>

<style scoped>
@page {
  size: A4 portrait;
  margin: 15mm;
}

.template {
  border: 1px solid #cbd5f5;
  font-family: 'Times New Roman', serif;
  color: #1f2937;
  line-height: 1.7;
  width: 210mm;
  min-height: 297mm;
  margin: 0 auto;
  padding: 20mm 18mm;
  background: #fff;
  box-shadow: 0 12px 40px rgba(15, 23, 42, 0.1);
  position: relative;
}

.student-photo {
  position: absolute !important;
  top: 20mm !important;
  right: 13mm !important;
  width: 25mm !important;
  height: 33mm !important;
  border: 1px solid #334155 !important;
  border-radius: 2px !important;
  overflow: hidden !important;
  background: #f8fafc !important;
  z-index: 999 !important;
  box-shadow: 0 2px 6px rgba(0,0,0,0.15) !important;
}

.student-photo img {
  width: 100% !important;
  height: 100% !important;
  object-fit: cover !important;
  display: block !important;
}

@media print {
  .template {
    box-shadow: none;
    border: none;
    width: auto;
    min-height: auto;
    padding: 0;
  }
}

.doc-header {
  margin-bottom: 1rem;
  padding-right: 28mm;
}

.doc-header p {
  margin: 0.35rem 0;
  text-transform: uppercase;
  font-size: 0.85rem;
  line-height: 1.4;
  word-wrap: break-word !important;
  overflow-wrap: break-word !important;
  word-break: break-word !important;
  hyphens: auto;
  white-space: normal !important;
}

.doc-header p:first-child {
  text-align: center;
  font-weight: 700;
  padding-right: 0;
  margin-right: -28mm;
  font-size: 0.8rem;
}

.template-actions {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 8px;
}

.save-pdf {
  background: linear-gradient(120deg, #2563eb, #1d4ed8);
  color: #fff;
  border: none;
  padding: 0.5rem 0.9rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
}

/* Стили состояния экспорта — применяются только временно для рендера PDF */
.template.pdf-export {
  border: none !important;
  box-shadow: none !important;
  background: #fff;
}

.template.pdf-export .student-photo {
  top: 13 mm !important;
  right: 25mm !important;
  width: 23mm !important;
  height: 30mm !important;
  border-width: 1px !important;
}

.template.pdf-export {
  padding: 4mm 10mm !important;
  max-height: 277mm !important;
  min-height: auto !important;
  line-height: 1.45 !important;
  font-size: 15px !important;
}

.template.pdf-export .doc-header p {
  font-size: 0.75rem !important;
  line-height: 1.3 !important;
  word-wrap: break-word !important;
  overflow-wrap: break-word !important;
  word-break: break-word !important;
  white-space: normal !important;
}

.template.pdf-export .muted.small {
  display: none !important; /* скрыть заметку в PDF */
}

.template.pdf-export .template-actions {
  display: none !important; /* спрятать панель действий прямо в шаблоне на время экспорта */
}

.title {
  text-align: center;
  letter-spacing: 0.15em; /* чуть меньше, чтобы экономить вертикальное пространство */
  margin: 0.6rem 0 0.3rem;
}

.blank {
  display: inline-block; /* allow wrapping */
  vertical-align: baseline;
  max-width: 65%;
  min-width: 80px;
  border-bottom: 1px solid #94a3b8;
  padding: 0 0.25rem;
  font-weight: 600;
  text-transform: none;
  overflow-wrap: anywhere; /* allow breaking long words/addresses */
  word-break: break-word;
  white-space: normal;
  box-sizing: border-box;
}

.blank.short {
  min-width: 50px;
  max-width: 30%;
}

.blank.tiny {
  min-width: 24px;
  max-width: 14%;
}

.small-hint {
  font-size: 0.75rem;
  color: #6b7280;
  font-style: italic;
  display: block;
  margin-top: 0.25rem;
}

.info,
.parents,
.footer {
  margin: 1rem 0;
}

.muted {
  color: #6b7280;
}

/* Кнопка сохранения должна быть видна только в интерфейсе, не в печати */
.no-print {
  display: block;
}

@media print {
  .no-print {
    display: none !important;
  }
  html, body {
    margin: 0;
    padding: 0;
  }
  .template {
    box-shadow: none;
    border: none;
    width: auto;
    min-height: auto;
    padding: 0;
    page-break-inside: avoid;
  }
}

.small {
  font-size: 0.85rem;
  margin-top: 1.5rem;
}
</style>


