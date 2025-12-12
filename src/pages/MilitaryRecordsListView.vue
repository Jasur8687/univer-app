<template>
  <main class="main">
    <div class="container">
      <div class="header">
        <h1>Военные учёты</h1>
        <div class="actions">
          <input
            type="file"
            ref="fileInput"
            @change="handleFileImport"
            accept=".xlsx,.xls"
            style="display: none"
          />
          <button @click="downloadTemplate" class="btn secondary">
            📥 Скачать шаблон Excel
          </button>
          <button @click="$refs.fileInput.click()" class="btn secondary">
            📤 Импорт из Excel
          </button>
          <button @click="handleExport" class="btn secondary" :disabled="records.length === 0">
            💾 Экспорт в Excel
          </button>
          <RouterLink to="/military-record" class="btn primary">
            ➕ Добавить запись
          </RouterLink>
        </div>
      </div>

      <div class="search-bar">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Поиск по фамилии..."
          class="search-input"
        />
        <button @click="loadRecords" class="btn secondary" style="margin-left: 1rem;">
          🔄 Обновить
        </button>
        <span class="count">Всего записей: {{ filteredRecords.length }}</span>
      </div>

      <div v-if="loading" class="loading">Загрузка...</div>

      <div v-else-if="filteredRecords.length === 0" class="empty">
        <p>Записей не найдено</p>
        <p class="hint">Добавьте новую запись или импортируйте из Excel</p>
      </div>

      <div v-else class="table-container">
        <table class="records-table">
          <thead>
            <tr>
              <th>№</th>
              <th>Фото</th>
              <th>Фамилия</th>
              <th>Имя</th>
              <th>Отчество</th>
              <th>Дата рождения</th>
              <th>Организация</th>
              <th>Образование</th>
              <th>Дата создания</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(record, index) in filteredRecords" :key="record.id">
              <td>{{ index + 1 }}</td>
              <td>
                <div class="photo-cell">
                  <img v-if="record.photo" :src="record.photo" alt="Фото" />
                  <span v-else class="no-photo">👤</span>
                </div>
              </td>
              <td>{{ record.lastName }}</td>
              <td>{{ record.firstName }}</td>
              <td>{{ record.middleName }}</td>
              <td>{{ formatDate(record.birthDate) }}</td>
              <td>{{ record.organization }}</td>
              <td>{{ record.educationType }}</td>
              <td>{{ formatDate(record.createdAt) }}</td>
              <td>
                <div class="action-buttons">
                  <button @click="viewRecord(record)" class="btn-icon" title="Просмотр">
                    👁️
                  </button>
                  <button @click="editRecord(record)" class="btn-icon edit" title="Редактировать">
                    ✏️
                  </button>
                  <button @click="deleteRecord(record.id)" class="btn-icon danger" title="Удалить">
                    🗑️
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Модальное окно просмотра -->
    <div v-if="selectedRecord && !editingRecord" class="modal" @click.self="selectedRecord = null">
      <div class="modal-content">
        <button @click="selectedRecord = null" class="modal-close">✕</button>
        <MilitaryRecordTemplate :student="selectedRecord" />
      </div>
    </div>

    <!-- Модальное окно редактирования -->
    <div v-if="editingRecord" class="modal" @click.self="closeEdit">
      <div class="modal-content edit-modal">
        <div class="modal-header">
          <h3>Редактировать военный учёт</h3>
          <button @click="closeEdit" class="modal-close">✕</button>
        </div>
        <div class="modal-body">
          <MilitaryRecordForm v-model="editingRecord" @save="saveEdit" />
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { RouterLink } from 'vue-router';
import {
  initDB,
  getAllMilitaryRecords,
  deleteMilitaryRecord,
  addMilitaryRecord,
  updateMilitaryRecord,
} from '../lib/indexedDB';
import {
  importMilitaryRecordsFromExcel,
  exportMilitaryRecordsToExcel,
  createMilitaryRecordTemplate,
} from '../utils/excelImport';
import MilitaryRecordTemplate from '../components/MilitaryRecordTemplate.vue';
import MilitaryRecordForm from '../components/MilitaryRecordForm.vue';

const records = ref([]);
const searchQuery = ref('');
const loading = ref(true);
const selectedRecord = ref(null);
const editingRecord = ref(null);
const fileInput = ref(null);

const filteredRecords = computed(() => {
  if (!searchQuery.value) return records.value;
  const query = searchQuery.value.toLowerCase();
  return records.value.filter((record) =>
    record.lastName.toLowerCase().includes(query)
  );
});

onMounted(async () => {
  await initDB();
  await loadRecords();
});

async function loadRecords() {
  try {
    loading.value = true;
    console.log('Загрузка военных учётов...');
    records.value = await getAllMilitaryRecords();
    console.log('Загружено записей:', records.value.length);
    console.log('Записи:', records.value);
  } catch (error) {
    console.error('Ошибка загрузки:', error);
    alert('Ошибка при загрузке данных: ' + error.message);
  } finally {
    loading.value = false;
  }
}

async function deleteRecord(id) {
  if (!confirm('Вы уверены, что хотите удалить эту запись?')) return;

  try {
    await deleteMilitaryRecord(id);
    await loadRecords();
    alert('Запись удалена');
  } catch (error) {
    console.error('Ошибка удаления:', error);
    alert('Ошибка при удалении записи');
  }
}

function viewRecord(record) {
  selectedRecord.value = record;
}

function editRecord(record) {
  editingRecord.value = { ...record };
  selectedRecord.value = null;
}

function closeEdit() {
  editingRecord.value = null;
}

async function saveEdit(updatedData) {
  if (!editingRecord.value || !editingRecord.value.id) return;

  try {
    await updateMilitaryRecord(editingRecord.value.id, updatedData);
    await loadRecords();
    closeEdit();
    alert('Запись обновлена');
  } catch (error) {
    console.error('Ошибка обновления:', error);
    alert('Ошибка при обновлении записи');
  }
}

async function handleFileImport(event) {
  const file = event.target.files[0];
  if (!file) return;

  try {
    const importedRecords = await importMilitaryRecordsFromExcel(file);
    
    if (importedRecords.length === 0) {
      alert('Файл пустой или неверный формат');
      return;
    }

    if (!confirm(`Найдено ${importedRecords.length} записей. Импортировать?`)) return;

    for (const record of importedRecords) {
      await addMilitaryRecord(record);
    }

    await loadRecords();
    alert(`Успешно импортировано ${importedRecords.length} записей`);
  } catch (error) {
    console.error('Ошибка импорта:', error);
    alert('Ошибка при импорте: ' + error.message);
  } finally {
    event.target.value = '';
  }
}

function handleExport() {
  if (records.value.length === 0) {
    alert('Нет данных для экспорта');
    return;
  }
  exportMilitaryRecordsToExcel(records.value);
}

function downloadTemplate() {
  createMilitaryRecordTemplate();
}

function formatDate(dateString) {
  if (!dateString) return '—';
  try {
    return new Date(dateString).toLocaleDateString('ru-RU');
  } catch {
    return dateString;
  }
}
</script>

<style scoped>
.main {
  padding: 3rem 0;
  min-height: 100vh;
  background: linear-gradient(160deg, #dbeafe 0%, #ede9fe 100%);
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

h1 {
  font-size: 2rem;
  color: #1e293b;
  margin: 0;
}

.actions {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  text-decoration: none;
  display: inline-block;
}

.btn.primary {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
}

.btn.primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
}

.btn.secondary {
  background: white;
  color: #475569;
  border: 1px solid #cbd5e1;
}

.btn.secondary:hover {
  background: #f8fafc;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.search-bar {
  display: flex;
  gap: 1rem;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.search-input {
  flex: 1;
  min-width: 250px;
  padding: 0.75rem 1rem;
  border: 1px solid #cbd5e1;
  border-radius: 0.5rem;
  font-size: 1rem;
}

.count {
  color: #64748b;
  font-size: 0.9rem;
}

.loading, .empty {
  text-align: center;
  padding: 3rem;
  color: #64748b;
}

.hint {
  color: #94a3b8;
  margin-top: 0.5rem;
}

.table-container {
  background: white;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.records-table {
  width: 100%;
  border-collapse: collapse;
}

.records-table th {
  background: #f8fafc;
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: #475569;
  border-bottom: 2px solid #e2e8f0;
  font-size: 0.9rem;
}

.records-table td {
  padding: 1rem;
  border-bottom: 1px solid #f1f5f9;
  color: #334155;
}

.records-table tr:hover {
  background: #f8fafc;
}

.photo-cell {
  width: 40px;
  height: 40px;
  border-radius: 0.5rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f1f5f9;
}

.photo-cell img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.no-photo {
  font-size: 1.5rem;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
}

.btn-icon {
  padding: 0.5rem;
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 1.2rem;
  border-radius: 0.375rem;
  transition: all 0.2s;
}

.btn-icon:hover {
  background: #f1f5f9;
}

.btn-icon.edit:hover {
  background: #e0f2fe;
}

.btn-icon.danger:hover {
  background: #fee2e2;
}

.modal {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  z-index: 1000;
  overflow-y: auto;
}

.modal-content {
  position: relative;
  max-width: 900px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 2.5rem;
  height: 2.5rem;
  border: none;
  background: white;
  border-radius: 50%;
  font-size: 1.5rem;
  cursor: pointer;
  z-index: 10;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.modal-close:hover {
  background: #f1f5f9;
}

.edit-modal {
  max-width: 1200px;
  background: white;
  border-radius: 1rem;
  padding: 0;
}

.modal-header {
  padding: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.5rem;
  color: #1e293b;
}

.modal-body {
  padding: 1.5rem;
  max-height: 70vh;
  overflow-y: auto;
}

@media (max-width: 768px) {
  .header {
    flex-direction: column;
    align-items: flex-start;
  }

  .actions {
    width: 100%;
  }

  .btn {
    flex: 1;
    text-align: center;
  }

  .table-container {
    overflow-x: auto;
  }

  .records-table {
    min-width: 800px;
  }
}
</style>
