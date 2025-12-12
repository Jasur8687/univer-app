<template>
  <main class="main">
    <div class="container">
      <h1>Военный учёт</h1>
      <p class="hint muted">Заполните форму и просмотрите личную карточку</p>

      <div class="split-view">
        <div class="form-section">
          <MilitaryRecordForm @save="handleSave" />
        </div>
        <div class="preview-section">
          <MilitaryRecordTemplate :student="currentRecord" />
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import MilitaryRecordForm from '../components/MilitaryRecordForm.vue';
import MilitaryRecordTemplate from '../components/MilitaryRecordTemplate.vue';
import { initDB, addMilitaryRecord, getAllMilitaryRecords } from '../lib/indexedDB';

const currentRecord = ref({});

onMounted(async () => {
  await initDB();
});

async function handleSave(recordData) {
  try {
    console.log('Сохранение записи:', recordData);
    const id = await addMilitaryRecord(recordData);
    console.log('Запись сохранена с ID:', id);
    currentRecord.value = { ...recordData, id };
    
    // Проверяем что запись действительно сохранилась
    const allRecords = await getAllMilitaryRecords();
    console.log('Всего записей в БД:', allRecords.length);
    
    alert(`Военный учёт успешно сохранён! ID: ${id}\nВсего записей: ${allRecords.length}`);
  } catch (error) {
    console.error('Ошибка сохранения:', error);
    alert('Ошибка при сохранении данных: ' + error.message);
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
  max-width: 1600px;
  margin: 0 auto;
  padding: 0 1rem;
}

h1 {
  font-size: 2.5rem;
  font-weight: 800;
  margin: 0 0 0.5rem;
  color: #1e3a8a;
  text-align: center;
}

.hint {
  text-align: center;
  font-size: 1rem;
  margin-bottom: 2rem;
  color: #6b7280;
}

.split-view {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  align-items: start;
}

.form-section, .preview-section {
  background: #fff;
  padding: 1.5rem;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

@media (max-width: 1200px) {
  .split-view {
    grid-template-columns: 1fr;
  }
}
</style>
