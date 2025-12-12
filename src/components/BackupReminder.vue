<template>
  <div v-if="showReminder" class="backup-reminder">
    <div class="reminder-content">
      <div class="icon">⚠️</div>
      <div class="text">
        <h4>Напоминание о резервном копировании</h4>
        <p>Последний бэкап был {{ daysSinceBackup }} дней назад. Рекомендуем сделать экспорт данных.</p>
      </div>
      <div class="actions">
        <button @click="goToBackup" class="btn-primary">Сделать бэкап</button>
        <button @click="remindLater" class="btn-secondary">Напомнить позже</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const showReminder = ref(false);
const BACKUP_KEY = 'lastBackupDate';
const REMINDER_INTERVAL = 7; // дней

const lastBackupDate = computed(() => {
  const saved = localStorage.getItem(BACKUP_KEY);
  return saved ? new Date(saved) : null;
});

const daysSinceBackup = computed(() => {
  if (!lastBackupDate.value) return 999;
  const diff = Date.now() - lastBackupDate.value.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
});

onMounted(() => {
  // Показываем напоминание если прошло больше 7 дней
  if (daysSinceBackup.value >= REMINDER_INTERVAL) {
    showReminder.value = true;
  }
});

function goToBackup() {
  router.push('/students');
  showReminder.value = false;
  // Записываем дату бэкапа
  localStorage.setItem(BACKUP_KEY, new Date().toISOString());
}

function remindLater() {
  showReminder.value = false;
  // Напомним через 1 день
  setTimeout(() => {
    showReminder.value = true;
  }, 1000 * 60 * 60 * 24);
}
</script>

<style scoped>
.backup-reminder {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
  max-width: 400px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    transform: translateX(500px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.reminder-content {
  padding: 1.5rem;
}

.icon {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.text h4 {
  margin: 0 0 0.5rem 0;
  color: #1e293b;
  font-size: 1.1rem;
}

.text p {
  margin: 0 0 1rem 0;
  color: #64748b;
  font-size: 0.9rem;
}

.actions {
  display: flex;
  gap: 0.75rem;
}

.btn-primary {
  flex: 1;
  padding: 0.75rem 1rem;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
}

.btn-secondary {
  padding: 0.75rem 1rem;
  background: white;
  color: #64748b;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-secondary:hover {
  background: #f8fafc;
}
</style>
