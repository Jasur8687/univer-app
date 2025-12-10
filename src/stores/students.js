import { defineStore } from 'pinia';
import { v4 as uuidv4 } from 'uuid';

// Временно отключаем API до настройки Supabase
// import { applicationsApi, facultiesApi, specialtiesApi } from '../services/api.ts';

const BASE_FIELDS = {
  fullName: '',
  lastName: '',
  firstName: '',
  middleName: '',
  photo: '',
  address: '',
  applicantPhone: '',
  schoolName: '',
  schoolNumber: '',
  graduationYear: '',
  studyForm: '',
  language: '',
  specialty: '',
  specialtyId: '',
  facultyName: '',
  facultyId: '',
  examSubjects: '',
  examCertificateStatus: '',
  examLocation: '',
  examResult: '',
  note: '',
  birthDate: '',
  birthPlace: '',
  gender: '',
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
  status: 'новый',
  history: [],
};

const createSample = (overrides) => ({
  ...BASE_FIELDS,
  ...overrides,
});

const SAMPLE_STUDENTS = [
  createSample({
    id: 'stu-001',
    fullName: 'Додов Абдумалик Абдумаликович',
    address: '8 микрорайон, дом 30, кв. 77',
    studyForm: 'Рӯзона',
    specialty: 'Ҳуқуқ',
    facultyName: 'Факултети ҳуқуқ ва идоракунӣ',
    programName: 'Ҳуқуқшиноси хоҷагии молия',
    groupCode: 'H-25-01',
    examSubjects: 'математика, англисӣ, забони тоҷикӣ',
    examCertificateStatus: 'нест',
    examLocation: 'ДДТТ дар ш. Хуҷанд',
    examResult: 'қабул шуд',
    note: 'нест',
    schoolName: 'Литсейи Рустамов',
    schoolNumber: '15',
    graduationYear: '2025',
    birthDate: '2007-08-27',
    birthPlace: 'ш. Гузар',
    fatherName: 'Додов Абдумалик Абдуматинович',
    fatherJob: 'сардор',
    fatherPhone: '+992 92 744 88 74',
    motherName: 'Додобоева Парвина Низомовна',
    motherJob: 'хонашин',
    motherPhone: '+992 92 744 88 80',
    contactPhone: '+992 92 744 88 74',
    extraInfo: 'Маълумоти иловагӣ нест',
    applicationNumber: '58',
    applicationDate: '2025-09-23',
  }),
  createSample({
    id: 'stu-002',
    fullName: 'Азиза Курбанова',
    address: 'г. Самарканд, ул. Регистан, 5',
    studyForm: 'Рӯзона',
    specialty: 'Молия ва қарз',
    facultyName: 'Факултети молия',
    programName: 'Банақшагирии давлатии молия',
    groupCode: 'F-25-03',
    examSubjects: 'математика, таърих, забони англисӣ',
    schoolName: 'Гимназия №7',
    graduationYear: '2024',
    contactPhone: '+998 97 555 66 33',
    fatherName: 'Курбанов Хикмат',
    fatherPhone: '+998 97 111 22 33',
    motherName: 'Курбанова Шахноза',
    motherPhone: '+998 97 555 66 33',
  }),
  createSample({
    id: 'stu-003',
    fullName: 'Улугбек Хакимов',
    address: 'г. Нукус, пр. Беруни, 45',
    studyForm: 'Шомгоҳӣ',
    specialty: 'Логистика ва савдо',
    facultyName: 'Факултети савдо',
    groupCode: 'L-24-02',
    examSubjects: 'география, математика',
    contactPhone: '+998 93 777 88 11',
    fatherName: 'Хакимов Илхом',
    fatherPhone: '+998 90 777 88 11',
  }),
  createSample({
    id: 'stu-004',
    fullName: 'Севара Каримова',
    address: 'г. Фергана, ул. Маргилан, 17',
    studyForm: 'Рӯзона',
    specialty: 'Педагогикаи иқтисодӣ',
    facultyName: 'Факултети педагогика',
    groupCode: 'P-23-04',
    examSubjects: 'педагогика, забони русӣ',
    contactPhone: '+998 91 234 56 78',
    motherName: 'Каримова Саида',
    motherPhone: '+998 91 234 56 78',
  }),
  createSample({
    id: 'stu-005',
    fullName: 'Дониёр Мирзаев',
    address: 'г. Бухара, ул. Арк, 33',
    studyForm: 'Рӯзона',
    specialty: 'Иқтисодиёти рақамӣ',
    facultyName: 'Факултети рақамӣ',
    programName: 'Аналитикаи маълумот',
    groupCode: 'D-25-05',
    examSubjects: 'информатика, математика, англисӣ',
    contactPhone: '+998 95 112 23 34',
    fatherName: 'Мирзаев Одил',
    fatherPhone: '+998 95 112 23 34',
  }),
];

export const useStudentsStore = defineStore('students', {
  state: () => ({
    students: [...SAMPLE_STUDENTS],
    loading: false,
    error: null,
  }),
  getters: {
    total: (state) => state.students.length,
  },
  actions: {
    // Добавить заявку (локально)
    addStudent(payload) {
      const withId = { ...BASE_FIELDS, ...payload, id: uuidv4() };
      this.students.unshift(withId);
      return withId;
    },

    // Обновить заявку (локально)
    updateStudent(id, payload) {
      const idx = this.students.findIndex((s) => s.id === id);
      if (idx === -1) return false;
      
      const previous = { ...this.students[idx] };
      if (!this.students[idx].history) this.students[idx].history = [];
      this.students[idx].history.unshift(previous);
      
      this.students[idx] = { ...this.students[idx], ...payload };
      return true;
    },

    // Получить историю изменений
    getHistory(id) {
      const s = this.students.find((s) => s.id === id);
      return s ? (s.history || []) : [];
    },

    // Заглушки для совместимости с API (пока Supabase не настроен)
    async loadApplications() {
      // Ничего не делаем, используем SAMPLE_STUDENTS
      return Promise.resolve();
    },

    async loadStats() {
      // Возвращаем локальную статистику
      const now = new Date();
      const thisYear = now.getFullYear();
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

      const stats = {
        total: this.students.length,
        thisYear: 0,
        last30Days: 0,
        last7Days: 0,
        byFaculty: {},
        byStatus: {}
      };

      this.students.forEach(s => {
        const faculty = s.facultyName || 'Не указан';
        stats.byFaculty[faculty] = (stats.byFaculty[faculty] || 0) + 1;

        const appDate = s.applicationDate ? new Date(s.applicationDate) : new Date();
        if (appDate.getFullYear() === thisYear) stats.thisYear++;
        if (appDate >= thirtyDaysAgo) stats.last30Days++;
        if (appDate >= sevenDaysAgo) stats.last7Days++;
      });

      return Promise.resolve(stats);
    },
  },
});


