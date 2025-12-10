<template>
  <section>
    <header class="header">
      <div>
        <h2 class="page-title">Список студентов</h2>
        <p class="muted">В демо показаны заранее добавленные записи и сохранённые заявки.</p>
      </div>
      <div style="display:flex; gap:1rem; align-items:center;">
        <input
          type="file"
          ref="fileInput"
          @change="handleFileImport"
          accept=".xlsx,.xls"
          style="display: none"
        />
        <button @click="downloadTemplate" class="secondary-btn">📥 Шаблон Excel</button>
        <button @click="$refs.fileInput.click()" class="secondary-btn">📤 Импорт</button>
        <button @click="handleExport" class="secondary-btn" :disabled="students.length === 0">💾 Экспорт</button>
        <RouterLink to="/application" class="primary-link">+ Новая заявка</RouterLink>
        <div class="filters">
          <select v-model="selectedFaculty" @change="onFacultyChange">
            <option value="">Все факультеты</option>
            <option v-for="f in facultiesList" :key="f.id" :value="f.id">{{ f.name }}</option>
          </select>
          <select v-model="selectedSpecialty" :disabled="!selectedFaculty">
            <option value="">Все кафедры / ихтисосы</option>
            <option v-for="s in specialties" :key="s.id" :value="s.id">{{ s.code }} - {{ s.name }}</option>
          </select>
        </div>
        <input v-model="searchQuery" placeholder="Поиск по ФИО или телефону" />
        <div class="counts muted small">Показано: <strong>{{ filteredCount }}</strong> из {{ totalCount }}</div>
      </div>
    </header>

    <div class="table-wrapper card">
      <table>
        <thead>
          <tr>
            <th>ФИО</th>
            <th>Ихтисос</th>
            <th>Шакли таҳсил</th>
            <th>Гуруҳ</th>
            <th>Факултет</th>
            <th>Действия</th>
            <th>Телефон барои тамос</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="student in paginatedStudents" :key="student.id">
            <td>
              <strong>{{ student.fullName || '—' }}</strong>
              <div class="muted small">{{ student.address || 'манзил нишон дода нашудааст' }}</div>
            </td>
            <td>{{ student.specialty || '—' }}</td>
            <td>{{ student.studyForm || '—' }}</td>
            <td>{{ student.groupCode || '—' }}</td>
            <td>{{ student.facultyName || student.facultyId || '—' }}</td>
            <td>{{ student.contactPhone || student.fatherPhone || student.motherPhone || '—' }}</td>
            <td class="actions-col">
              <button @click="viewStudentRecord(student)" class="action-btn view">Просмотр</button>
              <button @click="editStudentRecord(student)" class="action-btn edit">Редактировать</button>
              <button @click="deleteStudent(student)" class="action-btn delete">🗑️</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

      <!-- Модал просмотра -->
      <div v-if="showView" class="modal-root">
        <div class="modal-backdrop" @click="showView = false"></div>
        <div class="modal-panel">
          <div class="modal-header">
            <h3>Просмотр заявки</h3>
            <button class="close" @click="showView = false">×</button>
          </div>
          <div class="modal-body">
            <ApplicationTemplate :student="currentStudent" />
          </div>
        </div>
      </div>

      <!-- pagination -->
      <div class="pagination muted small" v-if="pageCount > 1" style="display:flex;align-items:center;gap:8px;margin-top:8px;">
        <button :disabled="currentPage===1" @click="currentPage--">« Пред.</button>
        <span>Страница {{ currentPage }} / {{ pageCount }}</span>
        <button :disabled="currentPage>=pageCount" @click="currentPage++">След. »</button>
        <select v-model.number="pageSize" style="margin-left:12px;">
          <option :value="5">5</option>
          <option :value="8">8</option>
          <option :value="15">15</option>
        </select>
      </div>

      <!-- summary removed from this page — moved to dashboard -->

      <!-- Модал редактирования -->
      <div v-if="showEdit" class="modal-root">
        <div class="modal-backdrop" @click="closeEdit"></div>
        <div class="modal-panel">
          <div class="modal-header">
            <h3>Редактировать заявку</h3>
            <button class="close" @click="closeEdit">×</button>
          </div>
          <div class="modal-body">
            <StudentForm v-model="editing" @save="saveEdited" />
          </div>
        </div>

          <!-- Модал истории -->
          <div v-if="showHistory" class="modal-root">
            <div class="modal-backdrop" @click="showHistory = false"></div>
            <div class="modal-panel">
              <div class="modal-header">
                <h3>История заявок — {{ currentStudent?.fullName || currentStudent?.lastName || '—' }}</h3>
                <button class="close" @click="showHistory = false">×</button>
              </div>
              <div class="modal-body">
                <div v-if="!historyEntries || historyEntries.length === 0">Нет предыдущих версий</div>
                <ul v-else class="space-y-3">
                  <li v-for="(h, idx) in historyEntries" :key="idx" class="p-3 border rounded">
                    <div class="muted small">Версия от: {{ h.changedAt || h.applicationDate || '—' }} — изменил: {{ h.changedBy || '—' }}</div>
                    <pre style="white-space:pre-wrap; max-height:180px; overflow:auto; background:#f9fafb; padding:8px;">{{ JSON.stringify(h, null, 2) }}</pre>
                    <div style="margin-top:6px; display:flex; gap:8px;">
                      <button class="primary" @click.stop="revertVersion(currentStudent, idx)">Откатить к этой версии</button>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
      </div>
  </section>
</template>

<script setup>
import { useStudentsStore } from '../stores/students';
import { ref, computed, onMounted, watch } from 'vue';
import StudentForm from '../components/StudentForm.vue';
import ApplicationTemplate from '../components/ApplicationTemplate.vue';
import { FACULTIES, getSpecialtiesByFacultyId } from '../data/faculties';
import {
  initDB,
  getAllApplications,
  addApplication,
  deleteApplication,
} from '../lib/indexedDB';
import {
  importApplicationsFromExcel,
  exportApplicationsToExcel,
  createApplicationTemplate,
} from '../utils/excelImport';

const store = useStudentsStore();
const students = computed(() => store.students);
const fileInput = ref(null);

const facultiesList = FACULTIES;
const selectedFaculty = ref('');
const selectedSpecialty = ref('');
const specialties = computed(() => (selectedFaculty.value ? getSpecialtiesByFacultyId(selectedFaculty.value) : []));

const showView = ref(false);
const showEdit = ref(false);
const showHistory = ref(false);
const currentStudent = ref(null);
const editing = ref(null);
const historyEntries = ref([]);

const searchQuery = ref('');
const pageSize = ref(8);
const currentPage = ref(1);

// Загрузка не требуется — используются локальные данные

function onFacultyChange() {
  selectedSpecialty.value = '';
}

const filteredStudents = computed(() => {
  const q = (searchQuery.value || '').toLowerCase().trim();
  return students.value.filter((s) => {
    if (selectedFaculty.value) {
      const facultyMatch = (s.facultyId && s.facultyId === selectedFaculty.value) || (s.facultyName && s.facultyName === (FACULTIES.find(f => f.id === selectedFaculty.value)?.name));
      if (!facultyMatch) return false;
    }
    if (selectedSpecialty.value) {
      const specMatch = (s.specialtyId && s.specialtyId === selectedSpecialty.value) || (s.specialty && s.specialty.includes(selectedSpecialty.value));
      if (!specMatch) return false;
    }
    // search by name or phone
    if (q) {
      const name = (s.fullName || s.lastName || '').toLowerCase();
      const phone = ((s.contactPhone || '') + ' ' + (s.fatherPhone || '') + ' ' + (s.motherPhone || '')).toLowerCase();
      if (!name.includes(q) && !phone.includes(q)) return false;
    }
    return true;
  });
});

const pageCount = computed(() => Math.max(1, Math.ceil(filteredStudents.value.length / pageSize.value)));
const paginatedStudents = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  return filteredStudents.value.slice(start, start + pageSize.value);
});

const totalCount = computed(() => students.value.length);
const filteredCount = computed(() => filteredStudents.value.length);

const facultyCounts = computed(() => {
  const map = {};
  students.value.forEach((s) => {
    const key = s.facultyId || s.facultyName || 'unknown';
    map[key] = (map[key] || 0) + 1;
  });
  return map;
});

const specialtyCounts = computed(() => {
  const map = {};
  students.value.forEach((s) => {
    const key = s.specialtyId || s.specialty || 'unknown';
    map[key] = (map[key] || 0) + 1;
  });
  return map;
});

function viewStudentRecord(s) {
  currentStudent.value = s;
  showView.value = true;
}

function editStudentRecord(s) {
  // clone to let the form edit without mutating immediately
  editing.value = JSON.parse(JSON.stringify(s));
  showEdit.value = true;
}

function closeEdit() {
  showEdit.value = false;
  editing.value = null;
}

function saveEdited(payload) {
  if (!editing.value) return;
  // update store
  // confirmation + update
  const confirmed = confirm('Подтвердите сохранение изменений — текущая версия будет заархивирована.');
  if (!confirmed) return;
  const ok = store.updateStudent(editing.value.id, payload);
  if (!ok) {
    alert('Ошибка при обновлении записи');
    return;
  }
  closeEdit();
}

function viewHistory(student) {
  currentStudent.value = student;
  historyEntries.value = store.getHistory(student.id) || [];
  showHistory.value = true;
}

function revertVersion(student, index) {
  if (!confirm('Вы уверены? Выполнение отката сохранит текущую версию в истории.')) return;
  const ok = store.revertStudent(student.id, index);
  if (!ok) return alert('Не удалось выполнить откат');
  // refresh history
  historyEntries.value = store.getHistory(student.id) || [];
}

async function deleteStudent(student) {
  if (!confirm(`Удалить студента ${student.fullName || student.lastName}?`)) return;
  
  try {
    // Если есть id из IndexedDB
    if (student.id && typeof student.id === 'number') {
      await deleteApplication(student.id);
    }
    // Удаляем из store
    store.deleteStudent(student.id);
    alert('Студент удалён');
  } catch (error) {
    console.error('Ошибка удаления:', error);
    alert('Ошибка при удалении');
  }
}

async function handleFileImport(event) {
  const file = event.target.files[0];
  if (!file) return;

  try {
    const importedApplications = await importApplicationsFromExcel(file);
    
    if (importedApplications.length === 0) {
      alert('Файл пустой или неверный формат');
      return;
    }

    if (!confirm(`Найдено ${importedApplications.length} записей. Импортировать?`)) return;

    await initDB();
    for (const app of importedApplications) {
      await addApplication(app);
      store.addStudent(app); // Добавляем в store для отображения
    }

    alert(`Успешно импортировано ${importedApplications.length} заявок`);
  } catch (error) {
    console.error('Ошибка импорта:', error);
    alert('Ошибка при импорте: ' + error.message);
  } finally {
    event.target.value = '';
  }
}

function handleExport() {
  if (students.value.length === 0) {
    alert('Нет данных для экспорта');
    return;
  }
  exportApplicationsToExcel(students.value);
}

function downloadTemplate() {
  createApplicationTemplate();
}
</script>

<style scoped>
.header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
}

.primary-link {
  padding: 0.5rem 1.25rem;
  border-radius: 999px;
  background: #2563eb;
  color: #fff;
  font-weight: 600;
}

.table-wrapper {
  margin-top: 1.5rem;
  overflow: auto;
}

.filters select {
  padding: 0.4rem 0.6rem;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
  margin-left: 0.5rem;
}

.action-btn {
  padding: 0.35rem 0.6rem;
  border-radius: 6px;
  border: 1px solid transparent;
  font-size: 0.9rem;
  cursor: pointer;
}
.action-btn.view {
  background: transparent;
  color: #2563eb;
  border-color: rgba(37,99,235,0.12);
}
.action-btn.edit {
  background: linear-gradient(120deg,#f97316,#ef4444);
  color: white;
  margin-left: 0.5rem;
}
.action-btn.delete {
  background: transparent;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0.25rem;
}
.action-btn.delete:hover {
  opacity: 0.7;
}
.actions-col { display:flex; gap:0.4rem; justify-content:flex-end; }

.secondary-btn {
  padding: 0.5rem 1rem;
  border-radius: 8px;
  border: 1px solid #cbd5e1;
  background: white;
  color: #475569;
  font-size: 0.9rem;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
}
.secondary-btn:hover {
  background: #f8fafc;
}
.secondary-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.counts {
  margin-left: 0.5rem;
}

/* modal styles */
.modal-root {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 60;
}
.modal-backdrop {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.5);
}
.modal-panel {
  position: relative;
  max-width: 900px;
  width: calc(100% - 3rem);
  max-height: 90vh;
  overflow: auto;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
  z-index: 70;
}
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #f3f4f6;
}
.modal-body { padding: 1rem; }
.modal-header .close {
  border: none;
  background: transparent;
  font-size: 20px;
  cursor: pointer;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.95rem;
}

th {
  text-align: left;
  font-weight: 600;
  color: #6b7280;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 0.75rem;
}

td {
  padding: 0.9rem 0;
  border-bottom: 1px solid #f3f4f6;
}

tbody tr:last-child td {
  border-bottom: none;
}
</style>


