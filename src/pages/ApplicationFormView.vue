<template>
  <section>
    <h2 class="page-title">Заявка студента</h2>
    <p class="muted">
      Форма заполняется локально. После сохранения данные добавляются в список студентов.
    </p>

    <div v-if="statusMessage" class="status-banner">
      {{ statusMessage }}
    </div>

    <div class="grid two-columns">
      <article class="card">
        <StudentForm v-model="draft" @save="handleSave" />
      </article>
      <ApplicationTemplate :student="draft" />
    </div>
  </section>
</template>

<script setup>
import { reactive, ref } from 'vue';
import StudentForm from '../components/StudentForm.vue';
import ApplicationTemplate from '../components/ApplicationTemplate.vue';
import { useStudentsStore } from '../stores/students';

const studentsStore = useStudentsStore();

const draft = reactive(createEmptyStudent());
const statusMessage = ref('');

function createEmptyStudent() {
  return {
    fullName: '',
    lastName: '',
    firstName: '',
    middleName: '',
    address: '',
      gender: '',
    schoolName: '',
    schoolNumber: '',
    graduationYear: '',
    studyForm: '',
    facultyId: '',
    specialtyId: '',
    specialty: '',
    facultyName: '',
    // programName and groupCode removed
    language: '',
    dormitoryNeed: '',
    birthDate: '',
    birthPlace: '',
    socialStatus: '',
    fatherName: '',
    fatherJob: '',
    fatherPhone: '',
    motherName: '',
    motherJob: '',
    motherPhone: '',
    contactPhone: '',
    extraInfo: '',
    applicationNumber: '',
    applicationDate: '',
    rulesAcknowledged: '',
  };
}

function handleSave(studentData) {
  studentsStore.addStudent(studentData);
  Object.assign(draft, createEmptyStudent());
  statusMessage.value = 'Заявка успешно сохранена и добавлена в список студентов.';
  setTimeout(() => (statusMessage.value = ''), 4000);
}
</script>


