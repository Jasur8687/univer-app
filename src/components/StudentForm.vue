<template>
  <form class="form" @submit.prevent="handleSubmit">
    <div class="form-section">
      <h3>Общие данные</h3>
      <div class="fields two-columns">
        <label>
          <span>Фамилия *</span>
          <input v-model.trim="form.lastName" type="text" placeholder="Додов" required />
        </label>
        <label>
          <span>Имя *</span>
          <input v-model.trim="form.firstName" type="text" placeholder="Абдумалик" required />
        </label>
        <label>
          <span>Отчество</span>
          <input v-model.trim="form.middleName" type="text" placeholder="Абдумаликович" />
        </label>
        <label class="photo-upload">
          <span>Фото студента (3x4)</span>
          <input type="file" @change="handlePhotoUpload" accept="image/*" />
          <div v-if="form.photo" class="photo-preview">
            <img :src="form.photo" alt="Фото" />
            <button type="button" @click="removePhoto" class="remove-photo">✕</button>
          </div>
          <small class="muted">Рекомендуемый размер: 3x4 см (соотношение сторон)</small>
        </label>
        <label>
          <span>Адрес проживания *</span>
          <input v-model.trim="form.address" type="text" placeholder="8 микрорайон, дом 30, кв. 77" required />
        </label>
        <label>
          <span>Номер школы / лицея</span>
          <input v-model.trim="form.schoolNumber" type="text" placeholder="№ 25" />
        </label>
        <label>
          <span>Название школы (гимназия, лицей)</span>
          <input v-model.trim="form.schoolName" type="text" placeholder="Мактаби Рустамов" />
        </label>
        <label>
          <span>Год выпуска</span>
          <input v-model.trim="form.graduationYear" type="text" placeholder="2025" />
        </label>
      </div>
    </div>

    <div class="form-section">
      <h3>Параметры заявки</h3>
      <div class="fields two-columns">
        <label>
          <span>Шакли таҳсил / форма обучения *</span>
          <select v-model="form.studyForm" required>
            <option value="">-- Интихоб кунед --</option>
            <option value="рӯзона">Рӯзона (очная)</option>
            <option value="гоибона">Гоибона (заочная)</option>
            <option value="фосилави">Фосилави (модульная/дистанционная)</option>
          </select>
        </label>
        <label>
          <span>Факультет *</span>
          <select v-model="form.facultyId" @change="onFacultyChange" required>
            <option value="">-- Интихоб кунед --</option>
            <option v-for="faculty in faculties" :key="faculty.id" :value="faculty.id">
              {{ faculty.name }}
            </option>
          </select>
        </label>
        <label>
          <span>Ихтисос / специальность *</span>
          <select v-model="form.specialtyId" :disabled="!form.facultyId" required>
            <option value="">-- Аввал факултетро интихоб кунед --</option>
            <option v-for="specialty in availableSpecialties" :key="specialty.id" :value="specialty.id">
              {{ specialty.code }} - {{ specialty.name }}
            </option>
          </select>
        </label>
        <!-- 'Барнома / кафедра' и 'Гуруҳ / индекс' удалены по требованию -->
        <label>
          <span>Забони таҳсил / язык обучения</span>
          <select v-model="form.language">
            <option value="">-- Интихоб кунед --</option>
            <option value="тоҷикӣ">Тоҷикӣ</option>
            <option value="русӣ">Русӣ</option>
            <option value="англисӣ">Английский (English)</option>
          </select>
        </label>
        <label>
          <span>Ба хобгоҳ эҳтиёҷмандам / Нуждаюсь в общежитии</span>
          <select v-model="form.dormitoryNeed">
            <option value="">-- Интихоб кунед --</option>
            <option value="Ҳа">Ҳа (Да)</option>
            <option value="Не">Не (Нет)</option>
          </select>
        </label>
      </div>
    </div>

    <div class="form-section">
      <h3>Личные данные</h3>
      <div class="fields two-columns">
        <label>
          <span>Ҷинс / Пол</span>
          <div class="radio-group">
            <label class="radio-label">
              <input v-model="form.gender" type="radio" value="мард" />
              <span>Мард (мужчина)</span>
            </label>
            <label class="radio-label">
              <input v-model="form.gender" type="radio" value="зан" />
              <span>Зан (женщина)</span>
            </label>
          </div>
        </label>
        <label>
          <span>Дата рождения</span>
          <input v-model="form.birthDate" type="date" />
        </label>
        <label>
          <span>Место рождения</span>
          <input v-model.trim="form.birthPlace" type="text" placeholder="ш. Гузар" />
        </label>
        <label>
          <span>Мансубияти иҷтимоӣ</span>
          <input v-model.trim="form.socialStatus" type="text" placeholder="коҳин" />
        </label>
      </div>
    </div>

    <div class="form-section">
      <h3>Родители / опекуны</h3>
      <div class="fields two-columns">
        <label>
          <span>Отец — ФИО</span>
          <input v-model.trim="form.fatherName" type="text" placeholder="Додов Абдумалик Абдумаликович" />
        </label>
        <label>
          <span>Отец — место работы / должность</span>
          <input v-model.trim="form.fatherJob" type="text" placeholder="Сардор, Идора" />
        </label>
        <label>
          <span>Отец — телефон</span>
          <input v-model.trim="form.fatherPhone" type="tel" placeholder="+992 92 744 88 74" />
        </label>
        <label>
          <span>Мать — ФИО</span>
          <input v-model.trim="form.motherName" type="text" placeholder="Додобоева Парвина" />
        </label>
        <label>
          <span>Мать — место работы / должность</span>
          <input v-model.trim="form.motherJob" type="text" placeholder="Ҳомушин" />
        </label>
        <label>
          <span>Мать — телефон</span>
          <input v-model.trim="form.motherPhone" type="tel" placeholder="+992 92 744 88 70" />
        </label>
      </div>
    </div>

    <div class="form-section">
      <h3>Контакт и подача</h3>
      <div class="fields two-columns">
        <label>
          <span>Телефон для связи</span>
          <input v-model.trim="form.contactPhone" type="tel" placeholder="+992 92 744 88 74" />
        </label>
        <label>
          <span>Доп. информация</span>
          <input v-model.trim="form.extraInfo" type="text" placeholder="Маълумоти иловагӣ" />
        </label>
        <label>
          <span>Номер регистрации заявления</span>
          <input v-model.trim="form.applicationNumber" type="text" placeholder="№ 58" />
        </label>
        <label>
          <span>Дата подачи заявления</span>
          <input v-model="form.applicationDate" type="date" />
        </label>
        <label>
          <span>Ба қоидаҳои қабул шинос шудам / Ознакомлен с правилами приема</span>
          <select v-model="form.rulesAcknowledged">
            <option value="">-- Интихоб кунед --</option>
            <option value="ҳа">Ҳа (Да)</option>
            <option value="не">Не (Нет)</option>
          </select>
        </label>
      </div>
    </div>

    <div class="actions">
      <button type="button" class="ghost" @click="resetForm">Очистить</button>
      <button type="submit" class="primary">Сохранить заявку</button>
    </div>
  </form>
</template>

<script setup>
import { reactive, watch, computed } from 'vue';
import { FACULTIES, getSpecialtiesByFacultyId, getFacultyById, getSpecialtyById } from '../data/faculties';

const props = defineProps({
  modelValue: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['update:modelValue', 'save']);

const defaultState = () => ({
  fullName: '',
  lastName: '',
  firstName: '',
  middleName: '',
  photo: '',
  address: '',
  schoolName: '',
  schoolNumber: '',
  graduationYear: '',
  gender: '',
  studyForm: '',
  facultyId: '',
  specialtyId: '',
  specialty: '',
  facultyName: '',
  // programName и groupCode удалены
  language: '',
  dormitoryNeed: '',
  birthDate: '',
  birthPlace: '',
  socialStatus: '',
  fatherName: '',
  fatherJob: '',
  fatherPhone: '',
  motherName: '',
  motherJob: '',
  motherPhone: '',
  contactPhone: '',
  extraInfo: '',
  applicationNumber: '',
  applicationDate: '',
  rulesAcknowledged: '',
});

const form = reactive({ ...defaultState(), ...props.modelValue });

const faculties = FACULTIES;

const availableSpecialties = computed(() => {
  if (!form.facultyId) return [];
  return getSpecialtiesByFacultyId(form.facultyId);
});

function onFacultyChange() {
  // Сбросить выбранный ихтисос при смене факультета
  form.specialtyId = '';
  form.specialty = '';
  form.facultyName = '';
  
  // Установить название факультета
  const faculty = getFacultyById(form.facultyId);
  if (faculty) {
    form.facultyName = faculty.name;
  }
}

// Следить за изменением ихтисоса
watch(() => form.specialtyId, (newId) => {
  if (newId && form.facultyId) {
    const specialty = getSpecialtyById(form.facultyId, newId);
    if (specialty) {
      form.specialty = `${specialty.code} - ${specialty.name}`;
    }
  } else {
    form.specialty = '';
  }
});

watch(
  () => props.modelValue,
  (next) => {
    Object.assign(form, defaultState(), next);
    // если пришёл fullName как строка — разбиваем на части, если части пусты
    if (form.fullName && !form.lastName && !form.firstName && !form.middleName) {
      const parts = form.fullName.trim().split(/\s+/);
      if (parts.length === 1) {
        form.lastName = parts[0];
      } else if (parts.length === 2) {
        form.lastName = parts[0];
        form.firstName = parts[1];
      } else if (parts.length >= 3) {
        form.lastName = parts[0];
        form.firstName = parts[1];
        form.middleName = parts.slice(2).join(' ');
      }
    }
  },
  { deep: true }
);

watch(
  form,
  () => {
    // держим fullName в согласованном виде
    form.fullName = [form.lastName, form.firstName, form.middleName].filter(Boolean).join(' ');
    emit('update:modelValue', { ...form });
  },
  { deep: true }
);

function handleSubmit() {
  if (!form.fullName || !form.studyForm || !form.facultyId || !form.specialtyId) {
    alert('Заполните обязательные поля: ФИО, форма обучения, факультет и ихтисос.');
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

  // Проверка размера (макс 2MB)
  if (file.size > 2 * 1024 * 1024) {
    alert('Файл слишком большой. Максимальный размер: 2 МБ');
    return;
  }

  // Проверка типа
  if (!file.type.startsWith('image/')) {
    alert('Пожалуйста, выберите изображение');
    return;
  }

  // Конвертация в base64
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

.form-section h3 {
  margin: 0 0 0.75rem;
  font-size: 1.05rem;
  color: #111827;
}

.fields {
  display: grid;
  gap: 1rem;
}

.fields.two-columns {
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
}

label {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
  font-size: 0.9rem;
  color: #374151;
}

input,
textarea,
select {
  border: 1px solid #d1d5db;
  border-radius: 8px;
  padding: 0.65rem 0.75rem;
  font-size: 0.95rem;
  transition: border-color 0.2s, box-shadow 0.2s;
  font-family: inherit;
}

input:focus,
textarea:focus,
select:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
}

select:disabled {
  background-color: #f3f4f6;
  cursor: not-allowed;
  opacity: 0.6;
}

.radio-group {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.radio-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  flex-direction: row;
}

.radio-label input[type="radio"] {
  width: auto;
  margin: 0;
  cursor: pointer;
}

.actions {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
}

.actions button {
  padding: 0.75rem 1.5rem;
  border-radius: 999px;
  border: none;
  font-weight: 600;
  cursor: pointer;
}

.actions .ghost {
  background: transparent;
  border: 1px solid #d1d5db;
  color: #374151;
}

.actions .primary {
  background: linear-gradient(120deg, #2563eb, #1d4ed8);
  color: #fff;
}

@media (max-width: 640px) {
  .actions {
    flex-direction: column;
  }

  .actions button {
    width: 100%;
  }
}
</style>


