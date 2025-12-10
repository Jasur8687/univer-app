import * as XLSX from 'xlsx';

/**
 * Импорт заявок из Excel файла
 * 
 * Ожидаемые колонки в Excel:
 * Фамилия | Имя | Отчество | Дата рождения | Телефон | Email | Факультет | Специальность | Курс | Группа
 */
export async function importApplicationsFromExcel(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        
        // Берем первый лист
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(firstSheet);

        // Преобразуем данные в формат заявок
        const applications = jsonData.map((row) => ({
          lastName: row['Фамилия'] || row['Насаб'] || '',
          firstName: row['Имя'] || row['Ном'] || '',
          middleName: row['Отчество'] || row['Номи падар'] || '',
          birthDate: formatExcelDate(row['Дата рождения'] || row['Санаи таваллуд']),
          phone: String(row['Телефон'] || row['Телефон №'] || ''),
          email: row['Email'] || row['E-mail'] || '',
          faculty: row['Факультет'] || row['Факултет'] || '',
          specialty: row['Специальность'] || row['Ихтисос'] || '',
          course: row['Курс'] || row['Курси'] || '',
          group: row['Группа'] || row['Гурӯҳ'] || '',
        }));

        resolve(applications);
      } catch (error) {
        reject(new Error('Ошибка при чтении Excel файла: ' + error.message));
      }
    };

    reader.onerror = () => reject(new Error('Ошибка при чтении файла'));
    reader.readAsArrayBuffer(file);
  });
}

/**
 * Импорт военных учетов из Excel файла
 * 
 * Ожидаемые колонки:
 * Фамилия | Имя | Отчество | Дата рождения | Место рождения | Национальность | Адрес | Телефон | 
 * Организация | Образование | Учебное заведение | Год окончания | Специальность | Номер диплома
 */
export async function importMilitaryRecordsFromExcel(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(firstSheet);

        const records = jsonData.map((row) => ({
          lastName: row['Фамилия'] || row['Насаб'] || '',
          firstName: row['Имя'] || row['Ном'] || '',
          middleName: row['Отчество'] || row['Номи падар'] || '',
          birthDate: formatExcelDate(row['Дата рождения'] || row['Санаи таваллуд']),
          birthPlace: row['Место рождения'] || row['Ҷои таваллуд'] || '',
          nationality: row['Национальность'] || row['Миллат'] || '',
          address: row['Адрес'] || row['Суроға'] || '',
          phone: String(row['Телефон'] || ''),
          organization: row['Организация'] || row['Ташкилот'] || '',
          alphabetNumber: row['Алфавитный номер'] || row['Рақами алфавит'] || '',
          personalCardNumber: row['Номер карточки'] || row['Рақами барака'] || '',
          unionMember: row['Член профсоюза'] || row['Аъзои иттифоқ'] || '',
          educationType: row['Образование'] || row['Маълумот'] || '',
          educationInstitution: row['Учебное заведение'] || row['Муассисаи таҳсил'] || '',
          graduationYear: row['Год окончания'] || row['Соли тамом'] || '',
          studyForm: row['Форма обучения'] || row['Намуди таҳсил'] || '',
          diplomaSpecialty: row['Специальность'] || row['Ихтисос'] || '',
          diplomaNumber: row['Номер диплома'] || row['Рақами диплом'] || '',
          diplomaDay: '',
          diplomaMonth: '',
          diplomaYear: '',
          maritalStatus: row['Семейное положение'] || row['Аҳволи оилавӣ'] || '',
          familyMember1: row['Член семьи 1'] || '',
          familyMember2: row['Член семьи 2'] || '',
          familyMember3: row['Член семьи 3'] || '',
          familyMember4: row['Член семьи 4'] || '',
          passportSeries: row['Паспорт'] || row['Шиносномa'] || '',
          militaryGroup: row['Группа учета'] || row['Гурӯҳи қайд'] || '',
          militarySpecialty: row['Военная специальность'] || row['Ихтисоси ҳарбӣ'] || '',
          militaryUnit: row['Воинская часть'] || row['Қисми ҳарбӣ'] || '',
          militaryNumber: row['Военный номер'] || row['Рақами ҳарбӣ'] || '',
          militaryRank: row['Звание'] || row['Дараҷа'] || '',
          militarySuitability: row['Годность'] || row['Мунособият'] || '',
          militaryCommissariat: row['Военкомат'] || row['Комиссариати ҳарбӣ'] || '',
        }));

        resolve(records);
      } catch (error) {
        reject(new Error('Ошибка при чтении Excel файла: ' + error.message));
      }
    };

    reader.onerror = () => reject(new Error('Ошибка при чтении файла'));
    reader.readAsArrayBuffer(file);
  });
}

/**
 * Экспорт заявок в Excel файл
 */
export function exportApplicationsToExcel(applications, filename = 'Заявки') {
  const data = applications.map((app) => ({
    'Фамилия': app.lastName,
    'Имя': app.firstName,
    'Отчество': app.middleName,
    'Дата рождения': app.birthDate,
    'Телефон': app.phone,
    'Email': app.email,
    'Факультет': app.faculty,
    'Специальность': app.specialty,
    'Курс': app.course,
    'Группа': app.group,
    'Дата создания': app.createdAt ? new Date(app.createdAt).toLocaleDateString('ru-RU') : '',
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Заявки');

  // Автоматическая ширина колонок
  const maxWidth = 50;
  const cols = Object.keys(data[0] || {}).map(() => ({ wch: maxWidth }));
  worksheet['!cols'] = cols;

  XLSX.writeFile(workbook, `${filename}_${new Date().toISOString().split('T')[0]}.xlsx`);
}

/**
 * Экспорт военных учетов в Excel файл
 */
export function exportMilitaryRecordsToExcel(records, filename = 'Военный_учет') {
  const data = records.map((rec) => ({
    'Фамилия': rec.lastName,
    'Имя': rec.firstName,
    'Отчество': rec.middleName,
    'Дата рождения': rec.birthDate,
    'Место рождения': rec.birthPlace,
    'Национальность': rec.nationality,
    'Адрес': rec.address,
    'Телефон': rec.phone,
    'Организация': rec.organization,
    'Алфавитный номер': rec.alphabetNumber,
    'Номер карточки': rec.personalCardNumber,
    'Член профсоюза': rec.unionMember,
    'Образование': rec.educationType,
    'Учебное заведение': rec.educationInstitution,
    'Год окончания': rec.graduationYear,
    'Форма обучения': rec.studyForm,
    'Специальность': rec.diplomaSpecialty,
    'Номер диплома': rec.diplomaNumber,
    'Семейное положение': rec.maritalStatus,
    'Член семьи 1': rec.familyMember1,
    'Член семьи 2': rec.familyMember2,
    'Член семьи 3': rec.familyMember3,
    'Член семьи 4': rec.familyMember4,
    'Паспорт': rec.passportSeries,
    'Группа учета': rec.militaryGroup,
    'Военная специальность': rec.militarySpecialty,
    'Воинская часть': rec.militaryUnit,
    'Военный номер': rec.militaryNumber,
    'Звание': rec.militaryRank,
    'Годность': rec.militarySuitability,
    'Военкомат': rec.militaryCommissariat,
    'Дата создания': rec.createdAt ? new Date(rec.createdAt).toLocaleDateString('ru-RU') : '',
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Военный учет');

  // Автоматическая ширина колонок
  const maxWidth = 30;
  const cols = Object.keys(data[0] || {}).map(() => ({ wch: maxWidth }));
  worksheet['!cols'] = cols;

  XLSX.writeFile(workbook, `${filename}_${new Date().toISOString().split('T')[0]}.xlsx`);
}

/**
 * Преобразование даты из Excel формата
 */
function formatExcelDate(excelDate) {
  if (!excelDate) return '';
  
  // Если уже строка в формате даты
  if (typeof excelDate === 'string') {
    return excelDate;
  }
  
  // Если это число (Excel serial date)
  if (typeof excelDate === 'number') {
    const date = XLSX.SSF.parse_date_code(excelDate);
    return `${date.y}-${String(date.m).padStart(2, '0')}-${String(date.d).padStart(2, '0')}`;
  }
  
  return '';
}

/**
 * Создание шаблона Excel для заявок
 */
export function createApplicationTemplate() {
  const template = [
    {
      'Фамилия': 'Иванов',
      'Имя': 'Иван',
      'Отчество': 'Иванович',
      'Дата рождения': '1990-01-01',
      'Телефон': '+992123456789',
      'Email': 'example@mail.com',
      'Факультет': 'Математический',
      'Специальность': 'Прикладная математика',
      'Курс': '1',
      'Группа': 'ПМ-101',
    },
  ];

  const worksheet = XLSX.utils.json_to_sheet(template);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Шаблон');

  XLSX.writeFile(workbook, 'Шаблон_заявки.xlsx');
}

/**
 * Создание шаблона Excel для военных учетов
 */
export function createMilitaryRecordTemplate() {
  const template = [
    {
      'Фамилия': 'Иванов',
      'Имя': 'Иван',
      'Отчество': 'Иванович',
      'Дата рождения': '1990-01-01',
      'Место рождения': 'г. Душанбе',
      'Национальность': 'тоҷик',
      'Адрес': 'г. Душанбе, ул. Рудаки 123',
      'Телефон': '+992123456789',
      'Организация': 'ТНУ',
      'Алфавитный номер': 'А-123',
      'Номер карточки': '0001',
      'Член профсоюза': 'Ҳа',
      'Образование': 'маълумоти оли',
      'Учебное заведение': 'ТНУ',
      'Год окончания': '2020',
      'Форма обучения': 'рӯзона',
      'Специальность': 'Программист',
      'Номер диплома': 'ВАТ 1247391',
      'Семейное положение': 'мучаррад',
      'Член семьи 1': 'Супруга, Иванова М. 1985 г.р.',
      'Член семьи 2': '',
      'Член семьи 3': '',
      'Член семьи 4': '',
      'Паспорт': 'AA 1234567',
      'Группа учета': 'Запас',
      'Военная специальность': 'Стрелок',
      'Воинская часть': 'в/ч 12345',
      'Военный номер': '123456',
      'Звание': 'рядовой',
      'Годность': 'Мунособ',
      'Военкомат': 'Военкомат г. Душанбе',
    },
  ];

  const worksheet = XLSX.utils.json_to_sheet(template);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Шаблон');

  XLSX.writeFile(workbook, 'Шаблон_военный_учет.xlsx');
}
