<template>
  <main class="main">
    <div class="container">
      <h1>Выбор формы документа</h1>
      <p class="hint muted">Выберите тип формы для заполнения</p>

      <div class="cards-grid">
        <div class="card application-card" @click="goToApplication">
          <div class="icon">📝</div>
          <h2>Заявка на поступление</h2>
          <p>Форма для подачи заявки на поступление в университет</p>
          <button class="card-button">Перейти к заявке</button>
        </div>

        <div class="card military-card" @click="goToMilitary">
          <div class="icon">🪖</div>
          <h2>Военный учёт</h2>
          <p>Личная карточка воинского учёта</p>
          <button class="card-button">Перейти к военному учёту</button>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

function goToApplication() {
  router.push('/application');
}

function goToMilitary() {
  router.push('/military-record');
}
</script>

<style scoped>
.main {
  padding: 4rem 0;
  min-height: 100vh;
  background: linear-gradient(160deg, #dbeafe 0%, #ede9fe 100%);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

h1 {
  font-size: 3rem;
  font-weight: 800;
  margin: 0 0 0.5rem;
  color: #1e3a8a;
  text-align: center;
}

.hint {
  text-align: center;
  font-size: 1.125rem;
  margin-bottom: 3rem;
  color: #6b7280;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 2rem;
  max-width: 800px;
  margin: 0 auto;
}

.card {
  background: #fff;
  padding: 2.5rem 2rem;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
  border: 2px solid transparent;
}

.card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
}

.application-card:hover {
  border-color: #3b82f6;
}

.military-card:hover {
  border-color: #10b981;
}

.icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.card h2 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 0.75rem;
}

.card p {
  color: #64748b;
  font-size: 0.95rem;
  margin: 0 0 1.5rem;
  line-height: 1.5;
}

.card-button {
  background: linear-gradient(120deg, #2563eb, #1d4ed8);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.95rem;
}

.card-button:hover {
  background: linear-gradient(120deg, #1d4ed8, #1e40af);
  transform: scale(1.05);
}

.military-card .card-button {
  background: linear-gradient(120deg, #10b981, #059669);
}

.military-card .card-button:hover {
  background: linear-gradient(120deg, #059669, #047857);
}

@media (max-width: 768px) {
  h1 {
    font-size: 2rem;
  }
  
  .cards-grid {
    grid-template-columns: 1fr;
  }
}
</style>
