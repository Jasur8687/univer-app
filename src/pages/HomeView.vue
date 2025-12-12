<template>
  <section class="home">
    <div class="dashboard-header">
      <div>
        <h2 class="page-title">Панель управления</h2>
        <p class="muted">Статистика и быстрый доступ к функциям системы</p>
      </div>
      <div class="header-actions">
        <RouterLink to="/forms" class="btn-primary">➕ Новая запись</RouterLink>
      </div>
    </div>

    <!-- Main KPI Cards -->
    <div class="kpi-cards">
      <div class="kpi-card" @click="$router.push('/students')">
        <div class="kpi-icon">👥</div>
        <div class="kpi-content">
          <div class="kpi-label">Всего студентов</div>
          <div class="kpi-value">{{ totalStudents }}</div>
          <div class="kpi-trend">{{ studentsThisMonth }} за месяц</div>
        </div>
      </div>
      
      <div class="kpi-card" @click="$router.push('/military-records-list')">
        <div class="kpi-icon">🪖</div>
        <div class="kpi-content">
          <div class="kpi-label">Военный учёт</div>
          <div class="kpi-value">{{ totalMilitary }}</div>
          <div class="kpi-trend">{{ militaryThisMonth }} за месяц</div>
        </div>
      </div>
      
      <div class="kpi-card">
        <div class="kpi-icon">📊</div>
        <div class="kpi-content">
          <div class="kpi-label">Факультеты</div>
          <div class="kpi-value">{{ totalFaculties }}</div>
          <div class="kpi-trend">{{ totalSpecialties }} специальностей</div>
        </div>
      </div>
      
      <div class="kpi-card backup-card" :class="{ warning: needsBackup }">
        <div class="kpi-icon">💾</div>
        <div class="kpi-content">
          <div class="kpi-label">Последний бэкап</div>
          <div class="kpi-value">{{ daysSinceBackup }}</div>
          <div class="kpi-trend">{{ backupStatus }}</div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="quick-actions card">
      <h3>Быстрые действия</h3>
      <div class="actions-grid">
        <button @click="$router.push('/application')" class="action-btn">
          <span class="action-icon">📝</span>
          <span class="action-text">Новая заявка</span>
        </button>
        <button @click="$router.push('/military-record')" class="action-btn">
          <span class="action-icon">🪖</span>
          <span class="action-text">Военный учёт</span>
        </button>
        <button @click="exportAllData" class="action-btn">
          <span class="action-icon">💾</span>
          <span class="action-text">Экспорт всех данных</span>
        </button>
        <button @click="showStats = !showStats" class="action-btn">
          <span class="action-icon">📈</span>
          <span class="action-text">Подробная статистика</span>
        </button>
      </div>
    </div>

    <!-- Detailed Statistics -->
    <div v-if="showStats" class="stats card">
      <div class="stats-header">
        <h3>Детальная статистика</h3>
        <button @click="showStats = false" class="btn-close">✕</button>
      </div>
      
      <div class="stats-sections">
        <!-- Recent Activity -->
        <div class="stats-section">
          <h4>Последние записи</h4>
          <div class="recent-list">
            <div v-for="record in recentRecords" :key="record.id" class="recent-item">
              <div class="recent-info">
                <div class="recent-name">{{ record.lastName }} {{ record.firstName }}</div>
                <div class="recent-meta">{{ record.type }} • {{ formatDate(record.createdAt) }}</div>
              </div>
            </div>
            <div v-if="!recentRecords.length" class="empty-state">Нет данных</div>
          </div>
        </div>

        <!-- Faculty Distribution -->
        <div class="stats-section">
          <h4>Распределение по факультетам</h4>
          <div class="stat-chart" v-if="Object.keys(perFaculty).length">
            <div class="chart-row" v-for="(count, fac) in topFaculties" :key="fac">
              <div class="fac-name" :title="fac">{{ fac }}</div>
              <div class="bar-wrap">
                <div class="bar gradient-a" :style="{ width: (count / maxFacultyCount * 100) + '%' }"></div>
              </div>
              <div class="fac-count">{{ count }}</div>
            </div>
          </div>
          <div v-else class="empty-state">Нет данных</div>
        </div>

        <!-- Monthly Trend -->
        <div class="stats-section">
          <h4>Динамика по месяцам</h4>
          <div class="trend-chart">
            <div v-for="(month, idx) in last6Months" :key="idx" class="trend-bar">
              <div class="trend-value">{{ month.count }}</div>
              <div class="trend-bar-fill" :style="{ height: (month.count / maxMonthCount * 100) + '%' }"></div>
              <div class="trend-label">{{ month.name }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getAllApplications, getAllMilitaryRecords } from '../lib/indexedDB';
import { exportApplicationsToExcel } from '../utils/excelImport';
import { exportMilitaryRecordsToExcel } from '../utils/excelImport';
import { FACULTIES } from '../data/faculties';

const router = useRouter();
const showStats = ref(false);

// Data
const applications = ref([]);
const militaryRecords = ref([]);

// Load data
onMounted(async () => {
  applications.value = await getAllApplications();
  militaryRecords.value = await getAllMilitaryRecords();
});

// KPI Calculations
const totalStudents = computed(() => applications.value.length);
const totalMilitary = computed(() => militaryRecords.value.length);
const totalFaculties = computed(() => {
  const unique = new Set(applications.value.map(a => a.faculty || a.facultyId).filter(Boolean));
  return unique.size;
});
const totalSpecialties = computed(() => {
  const unique = new Set(applications.value.map(a => a.specialty || a.specialtyId).filter(Boolean));
  return unique.size;
});

const studentsThisMonth = computed(() => {
  const now = new Date();
  const thisMonth = now.getMonth();
  const thisYear = now.getFullYear();
  return applications.value.filter(a => {
    if (!a.createdAt) return false;
    const date = new Date(a.createdAt);
    return date.getMonth() === thisMonth && date.getFullYear() === thisYear;
  }).length;
});

const militaryThisMonth = computed(() => {
  const now = new Date();
  const thisMonth = now.getMonth();
  const thisYear = now.getFullYear();
  return militaryRecords.value.filter(r => {
    if (!r.createdAt) return false;
    const date = new Date(r.createdAt);
    return date.getMonth() === thisMonth && date.getFullYear() === thisYear;
  }).length;
});

// Backup tracking
const daysSinceBackup = computed(() => {
  const lastBackup = localStorage.getItem('lastBackupDate');
  if (!lastBackup) return 'Никогда';
  const days = Math.floor((Date.now() - new Date(lastBackup).getTime()) / (1000 * 60 * 60 * 24));
  return days === 0 ? 'Сегодня' : `${days} дн. назад`;
});

const backupStatus = computed(() => {
  const lastBackup = localStorage.getItem('lastBackupDate');
  if (!lastBackup) return 'Создайте бэкап';
  const days = Math.floor((Date.now() - new Date(lastBackup).getTime()) / (1000 * 60 * 60 * 24));
  return days > 7 ? 'Требуется бэкап' : 'Актуально';
});

const needsBackup = computed(() => {
  const lastBackup = localStorage.getItem('lastBackupDate');
  if (!lastBackup) return true;
  const days = Math.floor((Date.now() - new Date(lastBackup).getTime()) / (1000 * 60 * 60 * 24));
  return days > 7;
});

// Recent records
const recentRecords = computed(() => {
  const appRecords = applications.value.map(a => ({ ...a, type: 'Студент' }));
  const milRecords = militaryRecords.value.map(m => ({ ...m, type: 'Военный учёт' }));
  const all = [...appRecords, ...milRecords];
  return all.sort((a, b) => {
    const dateA = new Date(a.createdAt || 0);
    const dateB = new Date(b.createdAt || 0);
    return dateB - dateA;
  }).slice(0, 10);
});

// Faculty distribution
const perFaculty = computed(() => {
  const map = {};
  applications.value.forEach(s => {
    const key = s.faculty || FACULTIES.find(f => f.id === s.facultyId)?.name || 'Не указан';
    map[key] = (map[key] || 0) + 1;
  });
  return map;
});

const topFaculties = computed(() => {
  return Object.entries(perFaculty.value)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .reduce((acc, [k, v]) => {
      acc[k] = v;
      return acc;
    }, {});
});

const maxFacultyCount = computed(() => Math.max(...Object.values(topFaculties.value || { '': 1 }), 1));

// Monthly trend
const last6Months = computed(() => {
  const months = [];
  const now = new Date();
  const monthNames = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'];
  
  for (let i = 5; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const month = date.getMonth();
    const year = date.getFullYear();
    
    const count = applications.value.filter(a => {
      if (!a.createdAt) return false;
      const d = new Date(a.createdAt);
      return d.getMonth() === month && d.getFullYear() === year;
    }).length;
    
    months.push({
      name: monthNames[month],
      count
    });
  }
  
  return months;
});

const maxMonthCount = computed(() => Math.max(...last6Months.value.map(m => m.count), 1));

// Actions
const exportAllData = async () => {
  if (applications.value.length > 0) {
    await exportApplicationsToExcel(applications.value);
  }
  if (militaryRecords.value.length > 0) {
    await exportMilitaryRecordsToExcel(militaryRecords.value);
  }
  localStorage.setItem('lastBackupDate', new Date().toISOString());
  alert('Все данные экспортированы!');
};

const formatDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}.${month}.${year}`;
};
</script>

<style scoped>
.home {
  padding: 1.5rem;
  max-width: 1400px;
  margin: 0 auto;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
}

.page-title {
  margin: 0 0 0.25rem 0;
  font-size: 1.75rem;
  font-weight: 700;
}

.header-actions {
  display: flex;
  gap: 0.75rem;
}

.btn-primary {
  padding: 0.625rem 1.25rem;
  background: linear-gradient(135deg, #6366f1, #4f46e5);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.2s;
}

.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
}

/* KPI Cards */
.kpi-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.kpi-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 1.25rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  cursor: pointer;
  transition: all 0.2s;
}

.kpi-card:hover {
  border-color: #6366f1;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transform: translateY(-2px);
}

.kpi-card.backup-card.warning {
  border-color: #f59e0b;
  background: linear-gradient(135deg, #fef3c7 0%, white 50%);
}

.kpi-icon {
  font-size: 2rem;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8fafc;
  border-radius: 10px;
}

.kpi-content {
  flex: 1;
}

.kpi-label {
  color: #64748b;
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
}

.kpi-value {
  font-size: 1.75rem;
  font-weight: 800;
  color: #0f172a;
  line-height: 1;
}

.kpi-trend {
  color: #6366f1;
  font-size: 0.8rem;
  margin-top: 0.25rem;
}

/* Quick Actions */
.quick-actions {
  margin-bottom: 2rem;
}

.quick-actions h3 {
  margin: 0 0 1rem 0;
  font-size: 1.25rem;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 0.75rem;
}

.action-btn {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.95rem;
}

.action-btn:hover {
  border-color: #6366f1;
  background: #f8fafc;
  transform: translateY(-2px);
}

.action-icon {
  font-size: 1.75rem;
}

.action-text {
  font-weight: 600;
  color: #374151;
}

/* Detailed Stats */
.stats {
  animation: slideDown 0.3s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.stats-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.stats-header h3 {
  margin: 0;
  font-size: 1.25rem;
}

.btn-close {
  background: #f3f4f6;
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1.25rem;
  color: #6b7280;
  transition: all 0.2s;
}

.btn-close:hover {
  background: #e5e7eb;
  color: #374151;
}

.stats-sections {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 1.5rem;
}

.stats-section {
  background: #f8fafc;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 1rem;
}

.stats-section h4 {
  margin: 0 0 1rem 0;
  font-size: 1rem;
  color: #374151;
}

/* Recent Records */
.recent-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.recent-item {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 0.75rem;
}

.recent-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.recent-name {
  font-weight: 600;
  color: #0f172a;
}

.recent-meta {
  font-size: 0.8rem;
  color: #64748b;
}

/* Faculty Chart */
.stat-chart {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.chart-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.fac-name {
  width: 140px;
  font-size: 0.875rem;
  color: #374151;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.bar-wrap {
  flex: 1;
  background: #e5e7eb;
  border-radius: 4px;
  height: 20px;
  overflow: hidden;
}

.bar {
  height: 100%;
  border-radius: 4px;
  transition: width 0.3s ease;
}

.gradient-a {
  background: linear-gradient(90deg, #6366f1, #06b6d4);
}

.fac-count {
  width: 40px;
  text-align: right;
  font-weight: 700;
  color: #0f172a;
  font-size: 0.9rem;
}

/* Monthly Trend */
.trend-chart {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 0.5rem;
  height: 120px;
  padding: 1rem 0.5rem;
}

.trend-bar {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}

.trend-value {
  font-size: 0.75rem;
  font-weight: 700;
  color: #374151;
  min-height: 1rem;
}

.trend-bar-fill {
  width: 100%;
  background: linear-gradient(180deg, #6366f1, #8b5cf6);
  border-radius: 4px 4px 0 0;
  transition: height 0.3s ease;
  min-height: 4px;
}

.trend-label {
  font-size: 0.75rem;
  color: #64748b;
  margin-top: 0.25rem;
}

.empty-state {
  padding: 2rem;
  text-align: center;
  color: #9ca3af;
  font-size: 0.9rem;
}

.card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 1.25rem;
}

.muted {
  color: #64748b;
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .dashboard-header {
    flex-direction: column;
    gap: 1rem;
  }
  
  .kpi-cards {
    grid-template-columns: 1fr;
  }
  
  .stats-sections {
    grid-template-columns: 1fr;
  }
  
  .actions-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>


