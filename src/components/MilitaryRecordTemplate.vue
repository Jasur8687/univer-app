<template>
  <section class="template card">
    <div class="template-actions no-print">
      <button class="save-pdf" @click="savePdf">Сохранить как PDF</button>
    </div>
    <div class="student-photo" v-if="student.photo">
      <img :src="student.photo" alt="Фото" />
    </div>

    <div class="header-row">
      <div class="header-left">
        Муассиса, ташкилот,<br>предприятие, организация
        <div class="underline">{{ student.organization || 'Название организации' }}</div>
      </div>
      <div class="header-right">
        М/З ракам табел алфавит
        <div class="underline">{{ student.alphabetNumber || 'А-123' }}</div>
      </div>
    </div>

    <h2 class="title">БАРАКАИ ШАХСӢ №<span class="underline short">{{ student.personalCardNumber || '0001' }}</span></h2>
    <h3 class="subtitle">Личная карточка</h3>
    <h3 class="section-title">1. МАЪЛУМОТИ УМУМӢ</h3>
    <h4 class="section-subtitle">Общие сведения</h4>

    <div class="form-grid">
      <div class="form-row">
        <span class="label">1. Насаб (фамилия)</span>
        <div class="value">{{ student.lastName || 'Иванов' }}</div>
        <span class="label right-col">13. Аҳволи оилавӣ</span>
        <div class="value-right">{{ student.maritalStatus }}</div>
      </div>
      <div class="form-row">
        <span class="label">ном (имя)</span>
        <div class="value">{{ student.firstName || 'Иван' }}</div>
        <span class="label right-col small">аъзои оила</span>
        <div class="value-right"></div>
      </div>
      <div class="form-row">
        <span class="label">номи падар</span>
        <div class="value">{{ student.middleName || 'Иванович' }}</div>
        <span class="label right-col">14.</span>
        <div class="value-right">{{ student.familyMember1 }}</div>
      </div>
      <div class="form-row">
        <span class="label">2. Соли таваллуд</span>
        <div class="value">{{ formattedBirthDate || '01.01.1990' }}</div>
        <span class="label right-col">15.</span>
        <div class="value-right">{{ student.familyMember2 }}</div>
      </div>
      <div class="form-row">
        <span class="label">3. Ҷои таваллуд</span>
        <div class="value">{{ student.birthPlace || 'г. Душанбе' }}</div>
        <span class="label right-col">16.</span>
        <div class="value-right">{{ student.familyMember3 }}</div>
      </div>
      <div class="form-row">
        <span class="label">4. Миллат</span>
        <div class="value">{{ student.nationality || 'тоҷик' }}</div>
        <span class="label right-col">17.</span>
        <div class="value-right">{{ student.familyMember4 }}</div>
      </div>
      <div class="form-row">
        <span class="label">5. Аъзои иттифоқи касаба (член проф.)</span>
        <div class="value">{{ student.unionMember || 'Ҳа' }}</div>
        <span class="label right-col">18.</span>
        <div class="value-right"></div>
      </div>
      <div class="form-row">
        <span class="label">6. Маълумот:</span>
        <div class="value">{{ student.educationType || 'маълумоти оли' }}</div>
        <span class="label right-col">19.</span>
        <div class="value-right"></div>
      </div>
      <div class="form-row indent">
        <span class="label">номи омӯзишгоҳ</span>
        <div class="value">{{ student.educationInstitution || 'ТНУ' }}</div>
        <span class="label right-col">20. Шиносномa</span>
        <div class="value-right">{{ student.passportSeries || 'AA 1234567' }}</div>
      </div>
      <div class="form-row indent">
        <span class="label">соли тамом</span>
        <div class="value">{{ student.graduationYear || '2020' }}</div>
        <span class="label right-col small">Макоме, ки шиносномa додааст</span>
        <div class="value-right">{{ student.passportIssuer || 'МВД РТ' }}</div>
      </div>
      <div class="form-row indent">
        <span class="label">намуди таҳсил</span>
        <div class="value">{{ student.studyForm || 'рӯзона' }}</div>
        <span class="label right-col small">Санаи додани шиносномa</span>
        <div class="value-right">{{ student.passportDate || '01.01.2010' }}</div>
      </div>
      <div class="form-row">
        <span class="label">7. Ихтисос аз рӯи диплом<br>(шаҳодатнома)</span>
        <div class="value">{{ student.diplomaSpecialty || 'Программист' }}</div>
        <span class="label right-col">21. Ҷои истиқомат</span>
        <div class="value-right">{{ student.address || 'г. Душанбе, ул. Рудаки 123' }}</div>
      </div>
      <div class="form-row">
        <span class="label">Диплом Шаҳодатнома №</span>
        <div class="value">{{ student.diplomaNumber || 'ВАТ 1247391' }}</div>
        <span class="label right-col small">телефон №</span>
        <div class="value-right">{{ student.phone || '+992 XX XXX XX XX' }}</div>
      </div>
      <div class="form-row no-border">
        <span class="label">{{ formattedDiplomaDate }}</span>
      </div>
    </div>

    <h3 class="section-title" style="margin-top: 1rem;">II. МАЪЛУМОТИ ҚАЙДИ ҲАРБӢ</h3>
    <h4 class="section-subtitle">СВЕДЕНИЯ О ВОИНСКОМ УЧЕТЕ</h4>

    <div class="military-grid">
      <div class="military-row">
        <span class="label">Гурӯҳи қайд</span>
        <div class="value">{{ student.militaryGroup || 'Запас' }}</div>
        <span class="label">Ихтисоси ҳарбӣ</span>
        <div class="value">{{ student.militarySpecialty || 'Стрелок' }}</div>
      </div>
      <div class="military-row">
        <span class="label"></span>
        <div class="value"></div>
        <span class="label">№</span>
        <div class="value">{{ student.militaryNumber || '123456' }}</div>
      </div>
      <div class="military-row">
        <span class="label">Ҳайат</span>
        <div class="value">{{ student.militaryUnit || 'в/ч 12345' }}</div>
        <span class="label">Баҳидмати ҳарбӣ мунособ</span>
        <div class="value">{{ student.militarySuitability || 'Мунособ' }}</div>
      </div>
      <div class="military-row">
        <span class="label">Унвони ҳарбӣ</span>
        <div class="value">{{ student.militaryRank || 'рядовой' }}</div>
        <span class="label">Номи комиссар. ҳарбӣ чои истиқомат</span>
        <div class="value">{{ student.militaryCommissariat || 'Военкомат г. Душанбе' }}</div>
      </div>
      <div class="military-row">
        <span class="label"></span>
        <div class="value"></div>
      </div>
      <div class="military-row">
        <span class="label"></span>
        <div class="value"></div>
        <span class="label">Баҳайди махсус будан</span>
        <div class="value"></div>
      </div>
    </div>

    <p class="hint muted small no-print">Бланк автоматически обновляется при изменении данных</p>
  </section>
</template>

<script setup>
import { computed } from 'vue';
import html2pdf from 'html2pdf.js';

const props = defineProps({
  student: {
    type: Object,
    default: () => ({}),
  },
});

const formattedDiplomaDate = computed(() => {
  const { diplomaDay, diplomaMonth, diplomaYear } = props.student;
  if (diplomaDay && diplomaMonth && diplomaYear) {
    return `аз «${diplomaDay}» ${diplomaMonth} соли 20${diplomaYear}`;
  }
  return 'аз «___» ________ соли 20___';
});

const formattedBirthDate = computed(() => {
  if (!props.student.birthDate) return '__.__.____';
  const d = new Date(props.student.birthDate);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}.${month}.${year}`;
});

async function savePdf() {
  const element = document.querySelector('.template');
  if (!element) return;

  element.classList.add('pdf-export');

  const opt = {
    margin: [10, 10, 10, 10],
    filename: `Военный_учет_${props.student.lastName || 'Форма'}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { 
      scale: 2, 
      useCORS: true, 
      letterRendering: true,
      windowHeight: element.scrollHeight
    },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    pagebreak: { mode: 'avoid-all' },
  };

  const wrapper = document.createElement('div');
  wrapper.style.position = 'fixed';
  wrapper.style.left = '-9999px';
  wrapper.style.top = '0';
  document.body.appendChild(wrapper);

  const clone = element.cloneNode(true);
  wrapper.appendChild(clone);

  const hiddenCloneNodes = [];
  clone.querySelectorAll('.no-print').forEach((n) => {
    hiddenCloneNodes.push({ node: n, display: n.style.display });
    n.style.display = 'none';
  });

  try {
    clone.querySelectorAll('p, span, div, td, th, li').forEach((el) => {
      el.style.wordWrap = 'break-word';
      el.style.overflowWrap = 'break-word';
      el.style.wordBreak = 'break-word';
      el.style.whiteSpace = 'normal';
    });

    await html2pdf().set(opt).from(clone).save();
  } catch (err) {
    if (typeof window !== 'undefined' && window.print) window.print();
  } finally {
    try {
      hiddenCloneNodes.forEach(({ node, display }) => {
        node.style.display = display;
      });
    } catch (e) {
      console.error(e);
    }
    if (wrapper && wrapper.parentNode) {
      wrapper.parentNode.removeChild(wrapper);
    }
    element.classList.remove('pdf-export');
  }
}
</script>

<style scoped>
@page {
  size: A4 portrait;
  margin: 10mm;
}

.template {
  border: 1px solid #cbd5f5;
  font-family: 'Arial', sans-serif;
  color: #1f2937;
  line-height: 1.3;
  width: 210mm;
  margin: 0 auto;
  padding: 10mm 12mm;
  background: #fff;
  box-shadow: 0 12px 40px rgba(15, 23, 42, 0.1);
  position: relative;
  font-size: 10px;
}

.student-photo {
  position: absolute !important;
  top: 10mm !important;
  right: 12mm !important;
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

.header-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.6rem;
  font-size: 9px;
  padding-right: 28mm;
  line-height: 1.3;
}

.header-left, .header-right {
  flex: 1;
}

.header-right {
  text-align: right;
}

.underline {
  border-bottom: 1px solid #000;
  display: inline-block;
  min-width: 90px;
  margin-top: 2px;
  font-size: 9px;
}

.underline.short {
  min-width: 35px;
}

.title {
  text-align: center;
  font-size: 15px;
  font-weight: 700;
  margin: 0.5rem 0 0.3rem;
  text-transform: uppercase;
  line-height: 1.3;
}

.subtitle {
  text-align: center;
  font-size: 12px;
  margin: 0.2rem 0 0.5rem;
  line-height: 1.3;
}

.section-title {
  text-align: center;
  font-size: 13px;
  font-weight: 700;
  margin: 0.8rem 0 0.2rem;
  text-transform: uppercase;
  line-height: 1.3;
}

.section-subtitle {
  text-align: center;
  font-size: 11px;
  margin: 0 0 0.5rem;
  text-transform: uppercase;
  line-height: 1.3;
}

.form-grid {
  display: flex;
  flex-direction: column;
  gap: 2px;
  font-size: 10px;
  line-height: 1.3;
}

.form-row {
  display: grid;
  grid-template-columns: 130px 1fr 130px 1fr;
  align-items: center;
  gap: 5px;
  border-bottom: 0.5px solid #d1d5db;
  padding: 3px 0;
  min-height: 18px;
}

.form-row.full {
  grid-template-columns: 1fr;
}

.form-row.indent {
  padding-left: 12px;
}

.form-row.no-border {
  border-bottom: none;
}

.label {
  font-size: 10px;
  color: #374151;
  line-height: 1.3;
}

.label.right-col {
  grid-column: 3;
  justify-self: start;
}

.label.small, .value.small, .value-right.small {
  font-size: 9px;
  line-height: 1.3;
}

.value {
  border-bottom: 0.5px solid #000;
  min-height: 16px;
  padding: 1px 3px;
  font-weight: 500;
  font-size: 10px;
  line-height: 1.3;
}

.value-right {
  border-bottom: 0.5px solid #000;
  min-height: 16px;
  padding: 1px 3px;
  font-weight: 500;
  font-size: 10px;
  line-height: 1.3;
  grid-column: 4;
}

.military-grid {
  display: flex;
  flex-direction: column;
  gap: 2px;
  font-size: 10px;
  margin-top: 0.5rem;
  line-height: 1.3;
}

.military-row {
  display: grid;
  grid-template-columns: 110px 1fr 140px 1fr;
  align-items: center;
  gap: 5px;
  border-bottom: 0.5px solid #d1d5db;
  padding: 3px 0;
  min-height: 18px;
}

.template-actions {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 6px;
}

.save-pdf {
  background: linear-gradient(120deg, #2563eb, #1d4ed8);
  color: #fff;
  border: none;
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  font-size: 13px;
}

.template.pdf-export {
  border: none !important;
  box-shadow: none !important;
  padding: 10mm 12mm !important;
  font-size: 10px !important;
}

.template.pdf-export .student-photo {
  top: 10mm !important;
  right: 12mm !important;
  width: 25mm !important;
  height: 33mm !important;
}

.hint {
  margin-top: 0.5rem;
  font-size: 9px;
  color: #9ca3af;
  text-align: center;
  line-height: 1.2;
}

@media print {
  .template {
    box-shadow: none;
    border: none;
    padding: 8mm 10mm;
    font-size: 8.5px;
  }
}

.placeholder-disabled {
  background: transparent !important;
  border: none !important;
  border-bottom: 0.5px solid #000 !important;
  padding: 0 !important;
  font-size: inherit;
  color: #000 !important;
  cursor: default;
  width: 100%;
  min-height: 16px;
}
</style>
