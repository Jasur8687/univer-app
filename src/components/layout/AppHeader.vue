<template>
  <header class="app-header">
    <div class="brand">
      <span class="badge">UI Demo</span>
      <div>
        <h1>Университетская система</h1>
        <p>Интерактивный прототип интерфейса</p>
      </div>
    </div>
    <nav class="nav">
      <RouterLink to="/" exact-active-class="active">Главная</RouterLink>
      <RouterLink to="/students" exact-active-class="active">Студенты</RouterLink>
      <RouterLink to="/military-records-list" exact-active-class="active">Военный учёт</RouterLink>
      <RouterLink to="/forms" exact-active-class="active">Формы</RouterLink>
    </nav>
  </header>
</template>

<script setup>
</script>

<style scoped>
.app-header {
  background: #fff;
  border-bottom: 1px solid #e5e7eb;
  padding: 1rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.08);
}

.brand {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.brand h1 {
  font-size: 1.1rem;
  margin: 0;
}

.brand p {
  margin: 0.15rem 0 0;
  color: #6b7280;
  font-size: 0.9rem;
}

.badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 54px;
  height: 54px;
  border-radius: 50%;
  background: linear-gradient(180deg, #2563eb, #1d4ed8);
  color: #fff;
  font-weight: 600;
}

.nav {
  display: flex;
  gap: 0.75rem;
}

.nav a {
  padding: 0.6rem 1rem;
  border-radius: 999px;
  font-weight: 500;
  color: #1d4ed8;
  border: 1px solid transparent;
}

.nav a.active {
  background: #dbeafe;
  border-color: #bfdbfe;
}

@media (max-width: 768px) {
  .app-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .nav {
    width: 100%;
  }

  .nav a {
    flex: 1;
    text-align: center;
  }
}
</style>


