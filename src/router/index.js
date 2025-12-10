import { createRouter, createWebHistory } from 'vue-router';

const HomeView = () => import('../pages/HomeView.vue');
const StudentsListView = () => import('../pages/StudentsListView.vue');
const ApplicationFormView = () => import('../pages/ApplicationFormView.vue');
const FormsMenuView = () => import('../pages/FormsMenuView.vue');
const MilitaryRecordView = () => import('../pages/MilitaryRecordView.vue');
const MilitaryRecordsListView = () => import('../pages/MilitaryRecordsListView.vue');

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/students', name: 'students', component: StudentsListView },
    { path: '/forms', name: 'forms', component: FormsMenuView },
    { path: '/application', name: 'application', component: ApplicationFormView },
    { path: '/military-record', name: 'military-record', component: MilitaryRecordView },
    { path: '/military-records-list', name: 'military-records-list', component: MilitaryRecordsListView },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
});

export default router;


