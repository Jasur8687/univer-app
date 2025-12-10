<template>
  <section class="home">
    <h2 class="page-title">Главная панель</h2>
    <p class="muted">
      Это демонстрационный прототип интерфейса для университетской системы. Используйте навигацию
      выше для просмотра списка студентов и заполнения форм.
    </p>

    <div class="grid three-columns">
      <article class="card highlight">
        <h3>📝 Формы</h3>
        <p>Выбор между заявкой на поступление и формой военного учёта с предпросмотром в реальном времени.</p>
      </article>
      <article class="card highlight">
        <h3>👥 Список студентов</h3>
        <p>Статические записи и добавленные заявки отображаются в общей таблице.</p>
      </article>
      <article class="card highlight">
        <h3>📊 Статистика</h3>
        <p>Общие показатели и распределение заявок по факультетам.</p>
      </article>
    </div>

    <!-- Statistics block -->
    <section class="stats card" style="margin-top:1.25rem;">
      <div class="stats-header">
        <div>
          <h3>Статистика заявок</h3>
          <p class="muted small">Общие показатели и распределение по факультетам</p>
        </div>
      </div>
      <div class="kpi-grid">
        <div class="kpi">
          <div class="kpi-label">Всего заявок</div>
          <div class="kpi-value">{{ total }}</div>
        </div>
        <div class="kpi">
          <div class="kpi-label">За текущий год</div>
          <div class="kpi-value">{{ thisYear }}</div>
        </div>
        <div class="kpi">
          <div class="kpi-label">За 30 дней</div>
          <div class="kpi-value">{{ last30 }}</div>
        </div>
        <div class="kpi">
          <div class="kpi-label">За 7 дней</div>
          <div class="kpi-value">{{ last7 }}</div>
        </div>
      </div>

      <div class="chart-card">
        <div class="chart-header">
          <span>Распределение по факультетам</span>
          <div class="legend">
            <span class="legend-item">
              <span class="legend-swatch swatch-a"></span> Заявки
            </span>
            <span class="legend-item">ТОП-6</span>
          </div>
        </div>
        <div class="stat-chart" v-if="Object.keys(perFaculty).length">
          <div class="chart-row" v-for="(count, fac) in topFaculties" :key="fac">
            <div class="fac-name" :title="fac">{{ fac }}</div>
            <div class="bar-wrap" aria-label="bar">
              <div class="bar gradient-a" :style="{ width: (count / maxFacultyCount * 100) + '%' }"></div>
            </div>
            <div class="fac-count">{{ count }}</div>
          </div>
        </div>
        <div v-else class="muted small">Нет данных для построения графика</div>
      </div>
    </section>
  </section>
</template>

<script setup>
import { computed } from 'vue';
import { useStudentsStore } from '../stores/students';
import { FACULTIES } from '../data/faculties';

const store = useStudentsStore();
const students = computed(() => store.students);

const total = computed(() => students.value.length);
const thisYear = computed(() => {
  const y = new Date().getFullYear();
  return students.value.filter((s) => s.applicationDate && new Date(s.applicationDate).getFullYear() === y).length;
});

const perFaculty = computed(() => {
  const map = {};
  students.value.forEach((s) => {
    const key = s.facultyName || (FACULTIES.find(f => f.id === s.facultyId)?.name) || 'Не указан';
    map[key] = (map[key] || 0) + 1;
  });
  return map;
});

const topFaculties = computed(() => {
  return Object.entries(perFaculty.value).sort((a,b) => b[1] - a[1]).slice(0,6).reduce((acc, [k,v]) => {
    acc[k] = v; return acc;
  }, {});
});

const maxFacultyCount = computed(() => Math.max(...Object.values(topFaculties.value || { '': 0 })));

const last7 = computed(() => {
  const now = Date.now();
  const sevenDays = 7 * 24 * 60 * 60 * 1000;
  return students.value.filter((s) => {
    if (!s.applicationDate) return false;
    const t = new Date(s.applicationDate).getTime();
    return now - t <= sevenDays;
  }).length;
});

const last30 = computed(() => {
  const now = Date.now();
  const thirtyDays = 30 * 24 * 60 * 60 * 1000;
  return students.value.filter((s) => {
    if (!s.applicationDate) return false;
    const t = new Date(s.applicationDate).getTime();
    return now - t <= thirtyDays;
  }).length;
});
</script>

<style scoped>
.grid {
  display: grid;
  gap: 1rem;
}

.three-columns {
  grid-template-columns: repeat(3, 1fr);
}

@media (max-width: 968px) {
  .three-columns {
    grid-template-columns: 1fr;
  }
}

.highlight {
  border: 1px solid #e0e7ff;
  background: linear-gradient(180deg, #eef2ff 0%, #fff 70%);
}

.highlight h3 {
  margin-top: 0;
}

.stats { padding: 1rem; }
.stats-header { display:flex; align-items:flex-end; justify-content:space-between; }
.kpi-grid {
  display:grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 0.75rem;
  margin-top: 0.75rem;
}
.kpi { background:#f8fafc; border:1px solid #e5e7eb; border-radius:10px; padding:0.75rem }
.kpi-label { color:#64748b; font-size:0.85rem }
.kpi-value { font-weight:800; font-size:1.4rem; margin-top:4px; color:#0f172a }

.chart-card { margin-top: 1rem; border:1px solid #e5e7eb; border-radius:10px; padding:0.75rem; background:#fff }
.chart-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:0.5rem }
.legend { display:flex; align-items:center; gap:12px }
.legend-item { display:flex; align-items:center; gap:6px; color:#64748b; font-size:0.85rem }
.legend-swatch { width:12px; height:12px; border-radius:3px; display:inline-block }
.swatch-a { background: linear-gradient(90deg,#6366f1,#06b6d4) }

.stat-chart { padding-left: 4px }
.chart-row { display:flex; align-items:center; gap:10px; margin:8px 0 }
.fac-name { width: clamp(160px, 22vw, 280px); font-size:0.95rem; color:#374151; white-space:nowrap; overflow:hidden; text-overflow:ellipsis }
.bar-wrap { flex:1; background:#f3f4f6; border-radius:999px; height:12px; overflow:hidden }
.bar { height:12px; }
.gradient-a { background: linear-gradient(90deg,#6366f1,#06b6d4); }
.fac-count { width:48px; text-align:right; font-weight:700; color:#0f172a }
</style>


