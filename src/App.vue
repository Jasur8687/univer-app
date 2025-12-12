<template>
  <div class="app-shell">
    <AppHeader />
    <main class="app-main">
      <router-view v-slot="{ Component, route }">
        <transition name="fade" mode="out-in">
          <component :is="Component" :key="route.fullPath" class="view-card card" />
        </transition>
      </router-view>
    </main>
    <BackupReminder />
  </div>
</template>

<script setup>
import AppHeader from './components/layout/AppHeader.vue';
import BackupReminder from './components/BackupReminder.vue';
</script>

<style scoped>
.app-shell {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-main {
  flex: 1;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 2rem 1.5rem 3rem;
}

.view-card {
  margin-top: 1rem;
}

@media (max-width: 768px) {
  .app-main {
    padding: 1.5rem 1rem 2rem;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
</style>


