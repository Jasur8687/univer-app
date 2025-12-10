<template>
  <form class="form" @submit.prevent="handleSubmit">
    <div class="form-section">
      <h3>Личные данные</h3>
      <div class="fields two-columns">
        <label>
          <span>Фамилия *</span>
          <input v-model.trim="form.lastName" type="text" required placeholder="Иванов" />
        </label>
        <label>
          <span>Имя *</span>
          <input v-model.trim="form.firstName" type="text" required placeholder="Иван" />
        </label>
        <label>
          <span>Отчество</span>
          <input v-model.trim="form.middleName" type="text" placeholder="Иванович" />
        </label>
        <label class="photo-upload">
          <span>Фото (3x4)</span>
          <input type="file" @change="handlePhotoUpload" accept="image/*" />
          <div v-if="form.photo" class="photo-preview">
            <img :src="form.photo" alt="Фото" />
            <button type="button" @click="removePhoto" class="remove-photo">✕</button>
          </div>
          <small class="muted">Рекомендуемый размер: 3x4 см</small>
        </label>
        <label>
          <span>Дата рождения *</span>
          <input v-model="form.birthDate" type="date" required />
        </label>
        <label>
          <span>Место рождения *</span>
          <input v-model.trim="form.birthPlace" type="text" required placeholder="г. Душанбе" />
        </label>
        <label>
          <span>Национальность</span>
          <input v-model.trim="form.nationality" type="text" placeholder="тоҷик" />
        </label>
        <label>
          <span>Адрес проживания *</span>
          <input v-model.trim="form.address" type="text" required placeholder="г. Душанбе, ул. Рудаки 123" />
        </label>
        <label>
          <span>Телефон</span>
          <input v-model.trim="form.phone" type="tel" placeholder="+992 XX XXX XX XX" />
        </label>
      </div>
    </div>

    <div class="form-section">
      <h3>Образование и документы</h3>
      <div class="fields two-columns">
        <label>
          <span>Организация / Предприятие</span>
          <input v-model.trim="form.organization" type="text" placeholder="Название организации" />
        </label>
        <label>
          <span>Алфавитный номер</span>
          <input v-model.trim="form.alphabetNumber" type="text" placeholder="А-123" />
        </label>
        <label>
          <span>Номер личной карточки</span>
          <input v-model.trim="form.personalCardNumber" type="text" placeholder="0001" />
        </label>
        <label>
          <span>5. Аъзои иттифоқи касаба (член проф.) *</span>
          <select v-model="form.unionMember" required>
            <option value="">-- Выберите --</option>
            <option value="Ҳа">Ҳа (Да)</option>
            <option value="Не">Не (Нет)</option>
          </select>
        </label>
        <label>
          <span>6. Маълумот (образование) *</span>
          <select v-model="form.educationType" required>
            <option value="">-- Выберите --</option>
            <option value="маълумоти оли">маълумоти оли (высшее)</option>
            <option value="миёнаи махсус">миёнаи махсус (среднее специальное)</option>
            <option value="нопурра">нопурра (неполное)</option>
            <option value="ибтидои">ибтидои (начальное)</option>
          </select>
        </label>
        <label>
          <span>Номи омӯзишгоҳ (название учебного заведения)</span>
          <input v-model.trim="form.educationInstitution" type="text" placeholder="ТНУ, РТСУ и т.д." />
        </label>
        <label>
          <span>Соли тамом (год окончания)</span>
          <input v-model="form.graduationYear" type="number" min="1950" max="2030" placeholder="2020" />
        </label>
        <label>
          <span>Намуди таҳсил (форма обучения)</span>
          <select v-model="form.studyForm">
            <option value="">-- Выберите --</option>
            <option value="рӯзона">рӯзона (дневная)</option>
            <option value="шабона">шабона (вечерняя)</option>
            <option value="ғоибона">ғоибона (заочная)</option>
          </select>
        </label>
        <label>
          <span>7. Ихтисос аз рӯи диплом (специальность по диплому)</span>
          <input v-model.trim="form.diplomaSpecialty" type="text" placeholder="Программист, Экономист и т.д." />
        </label>
        <label>
          <span>Номер диплома/шаҳодатнома</span>
          <input v-model.trim="form.diplomaNumber" type="text" placeholder="ВАТ 1247391" />
        </label>
        <label>
          <span>Дата выдачи диплома (день)</span>
          <input v-model.trim="form.diplomaDay" type="text" placeholder="30" maxlength="2" />
        </label>
        <label>
          <span>Месяц (имя)</span>
          <input v-model.trim="form.diplomaMonth" type="text" placeholder="июня" />
        </label>
        <label>
          <span>Год (20**)</span>
          <input v-model.trim="form.diplomaYear" type="text" placeholder="25" maxlength="2" />
        </label>
        <label>
          <span>13. Аҳволи оилавӣ (семейное положение) *</span>
          <select v-model="form.maritalStatus" required>
            <option value="">-- Выберите --</option>
            <option value="мучаррад">мучаррад (холост/не замужем)</option>
            <option value="оиладор">оиладор (женат/замужем)</option>
          </select>
        </label>
        <label>
          <span>13. Аҳволи оилавӣ - 1 (члены семьи)</span>
          <input v-model.trim="form.familyMember1" type="text" placeholder="Супруга, Алиева Ш. 1985 г.р." />
        </label>
        <label>
          <span>13. Аҳволи оилавӣ - 2</span>
          <input v-model.trim="form.familyMember2" type="text" placeholder="Сын, Алиев А. 2010 г.р." />
        </label>
        <label>
          <span>13. Аҳволи оилавӣ - 3</span>
          <input v-model.trim="form.familyMember3" type="text" placeholder="Дочь, Алиева М. 2015 г.р." />
        </label>
        <label>
          <span>13. Аҳволи оилавӣ - 4</span>
          <input v-model.trim="form.familyMember4" type="text" placeholder="Мать, Алиева Н. 1960 г.р." />
        </label>
        <label>
          <span>20. Шиносномa (паспорт) серия и номер</span>
          <input v-model.trim="form.passportSeries" type="text" placeholder="AA 1234567" />
        </label>
      </div>
    </div>

    <div class="form-section">
      <h3>Военный учёт</h3>
      <div class="fields two-columns">
        <label>
          <span>Группа учёта (гурӯҳи қайд)</span>
          <input v-model.trim="form.militaryGroup" type="text" placeholder="Запас" />
        </label>
        <label>
          <span>Военная специальность</span>
          <input v-model.trim="form.militarySpecialty" type="text" placeholder="Стрелок" />
        </label>
        <label>
          <span>Воинское подразделение (ҳайат)</span>
          <input v-model.trim="form.militaryUnit" type="text" placeholder="в/ч 12345" />
        </label>
        <label>
          <span>Военный номер</span>
          <input v-model.trim="form.militaryNumber" type="text" placeholder="123456" />
        </label>
        <label>
          <span>Воинское звание</span>
          <input v-model.trim="form.militaryRank" type="text" placeholder="рядовой, сержант и т.д." />
        </label>
        <label>
          <span>Годность к военной службе</span>
          <select v-model="form.militarySuitability">
            <option value="">-- Выберите --</option>
            <option value="Мунособ">Мунособ (Годен)</option>
            <option value="Мунособ бо маҳдудият">Мунособ бо маҳдудият (Ограниченно годен)</option>
            <option value="Номунособ">Номунособ (Не годен)</option>
          </select>
        </label>
        <label>
          <span>Военкомат по месту жительства</span>
          <input v-model.trim="form.militaryCommissariat" type="text" />
        </label>
      </div>
    </div>

    <div class="actions">
      <button type="submit" class="primary">Сохранить</button>
      <button type="button" @click="resetForm" class="secondary">Очистить</button>
    </div>
  </form>
</template>

<script setup>
import { reactive, watch } from 'vue';

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({}),
  },
});

const emit = defineEmits(['update:modelValue', 'save']);

const defaultState = () => ({
  lastName: '',
  firstName: '',
  middleName: '',
  photo: '',
  birthDate: '',
  birthPlace: '',
  nationality: '',
  address: '',
  phone: '',
  organization: '',
  alphabetNumber: '',
  personalCardNumber: '',
  unionMember: '',
  educationType: '',
  educationInstitution: '',
  graduationYear: '',
  studyForm: '',
  diplomaSpecialty: '',
  diplomaNumber: '',
  diplomaDay: '',
  diplomaMonth: '',
  diplomaYear: '',
  maritalStatus: '',
  familyMember1: '',
  familyMember2: '',
  familyMember3: '',
  familyMember4: '',
  passportSeries: '',
  militaryGroup: '',
  militarySpecialty: '',
  militaryUnit: '',
  militaryNumber: '',
  militaryRank: '',
  militarySuitability: '',
  militaryCommissariat: '',
});

const form = reactive({ ...defaultState(), ...props.modelValue });

watch(
  () => props.modelValue,
  (next) => {
    Object.assign(form, defaultState(), next);
  },
  { deep: true }
);

watch(
  form,
  () => {
    emit('update:modelValue', { ...form });
  },
  { deep: true }
);

function handleSubmit() {
  if (!form.lastName || !form.firstName || !form.birthDate || !form.birthPlace || !form.address || !form.unionMember || !form.educationType || !form.maritalStatus) {
    alert('Пожалуйста, заполните все обязательные поля (*)');
    return;
  }

  emit('save', { ...form });
  resetForm();
}

function resetForm() {
  Object.assign(form, defaultState());
}

function handlePhotoUpload(event) {
  const file = event.target.files?.[0];
  if (!file) return;

  if (file.size > 2 * 1024 * 1024) {
    alert('Файл слишком большой. Максимальный размер: 2 МБ');
    return;
  }

  if (!file.type.startsWith('image/')) {
    alert('Пожалуйста, выберите изображение');
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    form.photo = e.target?.result;
  };
  reader.readAsDataURL(file);
}

function removePhoto() {
  form.photo = '';
}
</script>

<style scoped>
.form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.photo-upload {
  grid-column: span 2;
}

.photo-upload input[type="file"] {
  padding: 0.5rem;
  border: 1px dashed #cbd5e1;
  border-radius: 6px;
  cursor: pointer;
}

.photo-preview {
  position: relative;
  display: inline-block;
  margin-top: 0.5rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
  width: 120px;
  height: 160px;
}

.photo-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.remove-photo {
  position: absolute;
  top: 4px;
  right: 4px;
  background: rgba(239, 68, 68, 0.9);
  color: white;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  cursor: pointer;
  font-size: 16px;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.remove-photo:hover {
  background: rgba(220, 38, 38, 1);
}

.form-section {
  background: #f8fafc;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.form-section h3 {
  margin-top: 0;
  margin-bottom: 1rem;
  color: #1e40af;
}

.fields {
  display: grid;
  gap: 0.75rem;
}

.two-columns {
  grid-template-columns: repeat(2, 1fr);
}

label {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

label span {
  font-weight: 500;
  font-size: 0.875rem;
  color: #374151;
}

input, select, textarea {
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.875rem;
}

input:focus, select:focus, textarea:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.actions {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
}

button {
  padding: 0.625rem 1.25rem;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.primary {
  background: linear-gradient(120deg, #2563eb, #1d4ed8);
  color: white;
  border: none;
}

.primary:hover {
  background: linear-gradient(120deg, #1d4ed8, #1e40af);
}

.secondary {
  background: #f3f4f6;
  color: #374151;
  border: 1px solid #d1d5db;
}

.secondary:hover {
  background: #e5e7eb;
}

.muted {
  color: #6b7280;
  font-size: 0.75rem;
  margin-top: 0.25rem;
}
</style>
