// Данные о факультетах и ихтисосах (специальностях)
export const FACULTIES = [
  {
    id: 'finance',
    name: 'Молия ва баҳисобгирии бухгалтерӣ',
    nameRu: 'Финансы и бухгалтерский учет',
    specialties: [
      {
        id: '1-250108',
        code: '1-250108',
        name: 'Баҳисобгирии бухгалтерӣ, таҳлил ва аудит',
        nameRu: 'Бухгалтерский учет, анализ и аудит',
      },
      {
        id: '1-250109',
        code: '1-250109',
        name: 'Молия ва қарз',
        nameRu: 'Финансы и кредит',
      },
    ],
  },
  {
    id: 'economics',
    name: 'Иқтисодиёт',
    nameRu: 'Экономика',
    specialties: [
      {
        id: '1-250101',
        code: '1-250101',
        name: 'Иқтисодиёти умумӣ',
        nameRu: 'Общая экономика',
      },
      {
        id: '1-250102',
        code: '1-250102',
        name: 'Иқтисодиёти корхона',
        nameRu: 'Экономика предприятия',
      },
      {
        id: '1-250103',
        code: '1-250103',
        name: 'Банақшагирии иқтисодӣ',
        nameRu: 'Экономическое планирование',
      },
    ],
  },
  {
    id: 'trade',
    name: 'Тиҷорат',
    nameRu: 'Торговля',
    specialties: [
      {
        id: '1-250201',
        code: '1-250201',
        name: 'Тиҷорати беруна',
        nameRu: 'Внешняя торговля',
      },
      {
        id: '1-250202',
        code: '1-250202',
        name: 'Тиҷорати дохилӣ',
        nameRu: 'Внутренняя торговля',
      },
      {
        id: '1-250203',
        code: '1-250203',
        name: 'Маркетинг',
        nameRu: 'Маркетинг',
      },
    ],
  },
  {
    id: 'management',
    name: 'Идоракунӣ',
    nameRu: 'Управление',
    specialties: [
      {
        id: '1-250301',
        code: '1-250301',
        name: 'Идоракунии корхона',
        nameRu: 'Управление предприятием',
      },
      {
        id: '1-250302',
        code: '1-250302',
        name: 'Менеҷмент',
        nameRu: 'Менеджмент',
      },
    ],
  },
  {
    id: 'law',
    name: 'Ҳуқуқ',
    nameRu: 'Право',
    specialties: [
      {
        id: '1-400101',
        code: '1-400101',
        name: 'Ҳуқуқшиносӣ',
        nameRu: 'Юриспруденция',
      },
      {
        id: '1-400102',
        code: '1-400102',
        name: 'Ҳуқуқи тиҷоратӣ',
        nameRu: 'Коммерческое право',
      },
    ],
  },
];

// Получить ихтисосы по ID факультета
export function getSpecialtiesByFacultyId(facultyId) {
  const faculty = FACULTIES.find((f) => f.id === facultyId);
  return faculty ? faculty.specialties : [];
}

// Получить факультет по ID
export function getFacultyById(facultyId) {
  return FACULTIES.find((f) => f.id === facultyId);
}

// Получить ихтисос по ID
export function getSpecialtyById(facultyId, specialtyId) {
  const faculty = getFacultyById(facultyId);
  if (!faculty) return null;
  return faculty.specialties.find((s) => s.id === specialtyId);
}

