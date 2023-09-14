        /* 
        
        enrollments: [
      {
        code: '1234ref',
        announcement: {
          announcement_id: 2,
          name: 'Septiembre 2022',
          grades_publication: '2022-09-10T21:23:54Z'
        },
        subjects: {
          'Fase General': [
            {
              subject_id: 1,
              name: 'Lengua Y Literatura',
              exam: [
                {
                  exam: 'Lengua Y Literatura - Septiembre 2022',
                  grade: 7,
                  start_time: '12:00:00',
                  end_time: '16:08:47',
                  exam_date: '2022-09-05'
                }
              ]
            },
            {
              subject_id: 4,
              name: 'Historia de la filosofía',
              exam: [
                {
                  exam: 'Historia de la filosofía - Septiembre 2022',
                  grade: 4,
                  start_time: '10:59:25',
                  end_time: '16:00:48',
                  exam_date: '2022-09-05'
                }
              ]
            },
            {
              subject_id: 5,
              name: 'Inglés',
              exam: [
                {
                  exam: 'Inglés - Septiembre 2022',
                  grade: 7,
                  start_time: '10:59:25',
                  end_time: '16:00:48',
                  exam_date: '2022-09-05'
                }
              ]
            }
          ],
          'Fase Especifica': [
            {
              subject_id: 9,
              name: 'Matemáticas II',
              exam: [
                {
                  exam: 'Matemáticas II - Septiembre 2022',
                  grade: 4,
                  start_time: '10:59:25',
                  end_time: '16:00:48',
                  exam_date: '2022-09-06'
                }
              ]
            },
            {
              subject_id: 10,
              name: 'Física',
              exam: [
                {
                  exam: 'Física - Septiembre 2022',
                  grade: 3,
                  start_time: '15:10:17',
                  end_time: '17:10:22',
                  exam_date: '2022-09-06'
                }
              ]
            }
          ]
        },
        degrees: [
          {
            degree_id: 1,
            name: 'Infromática de Gestion'
          },
          {
            degree_id: 3,
            name: 'Ingenieria Quimica'
          },
          {
            degree_id: 4,
            name: 'Ingenieria Informatica'
          }
        ],
        enrollment_date: '2022-08-25T16:01:43+02:00',
        price: 4500,
        copy_id_card: 'http://localhost:8000/media/enrollments/Septiembre%202022/1234ref/cita_previa_huella.pdf',
        proof_of_payment: 'http://localhost:8000/media/enrollments/Septiembre%202022/1234ref/cita_previa_huella_CRn2xJF.pdf',
        student: {
          student: 44,
          name: 'Pascualina Eburi Biloko',
          photo: '/media/img/students/eburi.dev%40gmail.com/home-banner-image.png',
          institute: 'Claret Malabo',
          modality: 'Tecnología'
        },
        exam_class_room: {
          classroom_id: 1,
          name: 'ST-BAJA-01',
          examCenter: 'Santa Teresita'
        },
        status: 2,
        status_id_card: 1,
        status_proof_payment: 1,
        previous_enrollments: [],
        phase_results: {
          'Fase General': {
            subjects: [
              7,
              4,
              7
            ],
            average_grade: 6
          },
          'Fase Especifica': {
            subjects: [
              4,
              3
            ],
            average_grade: 3.5
          }
        }
      }
    ],
        
        */
export async function determinePhaseRequired(enrollments){
  let required = {
    'Fase General': {required: true, higestEnrollmentGrade: null},
    'Fase Especifica': {required: true, higestEnrollmentGrade: null},
  }

  if(!enrollments){ return required; }

  for (const enrollment of enrollments){
    if(!(enrollment.hasOwnProperty('phase_results'))){
      continue;
    }

    const phase_results = enrollment.phase_results;
    // getHighestAverageGradeEnrollment
    for (const phase in phase_results){
      const grade = phase_results[phase].average_grade || 0.0;
      if (grade >= 5){
        required[phase].required = false;

      }else{
        continue;
      }
    }
  }

  for (const phase in required){
    if(required[phase].required == false){
      const highest = await getHighestAverageGradeEnrollment(enrollments, phase);
      required[phase].higestEnrollmentGrade = {
        code: highest.code,
        announcement: highest.announcement.name,
        grade: highest.phase_results[phase].average_grade.toFixed(2)
      } ;

    }else{
      continue
    }
  }

  return required;
}

export function calculateAverageGrade(enrollment ) {
    let totalSubjects = 0;
    let totalGrade = 0;
  
    for (const phase in enrollment.phase_results) {
      if (enrollment.phase_results.hasOwnProperty(phase)) {
        const grade = enrollment.phase_results[phase].average_grade;
        
        // Verificar si la nota es un número válido
        if (!isNaN(grade)) {
          totalGrade += grade;
          totalSubjects++;
        }
  
      }
    }
  
    if (totalSubjects === 0) {
      return 0;
    }
  
    const averageGrade = (totalGrade / totalSubjects).toFixed(2);
    return averageGrade;
  }
  
export function filterHighestAverageEnrollment( enrollments ) {
    let highestAverage = 0.0;
    let highest = null;
  
    for (const enrollment of  enrollments ) {
      const general_phase = enrollment.phase_results['Fase General'] || 0.0;
      const specific_phase = enrollment.phase_results['Fase Especifica'] || 0.0;
  
      const average = ((general_phase + specific_phase) / 2).toFixed(2);
  
      if (average > highestAverage) {
        highestAverage = average;
        highest = enrollment;
      }
    }
  
    return highest;
}
  

export async function getHighestAverageGradeEnrollment(enrollments = [], phase = null ) {
    let highestEnrollment = null;
    let highestAverageGrade = 0.0;

    
    if (phase){



        for (const enrollment of enrollments) {
          const phaseAverageGrade = enrollment.phase_results[phase].average_grade || 0.0;
      
          if (phaseAverageGrade > highestAverageGrade) {
            highestAverageGrade = phaseAverageGrade;
            highestEnrollment = enrollment;
          }
        }
    
      
        return highestEnrollment;
    }
    
    return filterHighestAverageEnrollment(enrollments);
  }



export function getGradeStatus(nota = 0) {
    if (nota < 5) {
      return 'Suspenso';

    } else if (nota >= 5 && nota < 7) {
      return 'Apto';

    } else if (nota >= 7 && nota < 9) {
      return 'Notable';

    } else {
      return 'Sobresaliente';
    }
}


export function extractExams(enrollments = null) {
    const extractedData = {};
    if (!enrollments) {
      return extractedData;
    }
  
    enrollments.forEach((enrollment) => {
      const { code, announcement, subjects } = enrollment;
  
      if (!(code in extractedData)) {
        extractedData[code] = {
          name: announcement.name,
          exams: []
        };
      }
  
      for (const phase in subjects) {
        const subjectsInPhase = subjects[phase];
  
        subjectsInPhase.forEach((subject) => {
          const { name, exam } = subject;
  
          exam.forEach((examDetails) => {
            const { exam: examName, grade, start_time, end_time, exam_date } = examDetails;
  
            const examData = {
              subject: name,
              exam: examName,
              phase: phase,
              grade: grade,
              start_time: start_time,
              end_time: end_time,
              exam_date: exam_date
            };
  
            extractedData[code].exams.push(examData);
          });
        });
      }
    });
  
    return extractedData;
  }
  
  export async function generatePassword(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let password = '';
  
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      password += characters.charAt(randomIndex);
    }
  
    return password;
  }
  
  export async function generateUniqueCode(institute = '', student, announcement, join_element = '-') {
    const insititueInitials = institute
      .split(' ')
      .map(word => word.charAt(0))
      .join('');

    const timestamp = Date.now().toString().slice(0, 4);
  
    const announcementInitials = announcement.slice(0, 2).toUpperCase();
  
    const uniqueCode = insititueInitials + join_element + timestamp + announcementInitials + join_element + student;
  
    return uniqueCode;
  }
  


  



  export function getEnrollmentExamDates(subjects) {
    let startDate = '';
    let endDate = '';
  
    for (const phase in subjects) {
      for (const subject of subjects[phase]) {
        for (const examen of subject.exam) {
          const date = examen.exam_date;
          if (!startDate || date < startDate) {
            startDate = date;
          }
          if (!endDate || date > endDate) {
            endDate = date;
          }
        }
      }
    }
  
    return { startDate, endDate };
  }


/**
 * 
 * @param {*} exams 
 * exams:{
 *  id_convocatoria: {
 *    name: 'name',
 *    exams: {
 *      fecha: [ {exam: 'nombre', start: 'inicio', end: 'fin' } ]
 *      fecha: [ {exam: 'nombre', start: 'inicio', end: 'fin' } ]
 *    }
 *  }
 * }
 */

export async function groupExamsByAnnouncementAndDate(exams) {
  const groupedExams = {};

  for (const exam of exams) {
    const { announcement, exam_date, subject, start_time, end_time } = exam;
    const announcementId = announcement.id;

    if (!groupedExams.hasOwnProperty(announcementId)) {
      groupedExams[announcementId] = {
        name: announcement.name,
        exams: {},
      };
    }

    const examsByDate = groupedExams[announcementId].exams;

    if (!examsByDate.hasOwnProperty(exam_date)) {
      examsByDate[exam_date] = [];
    }

    const examsOnDate = examsByDate[exam_date];
    const existingExam = examsOnDate.find(e => e.exam === subject.name);

    if (!existingExam) {
      examsOnDate.push({
        exam: subject.name,
        phase: subject.phase,
        start: start_time,
        end: end_time,
      });
    }
  }

  return groupedExams;
}

export async function groupExamsByAnnouncementAndDates(exams) {
  const groupedExams = {};

  for (const exam of exams) {
    const { announcement, exam_date, subject, start_time, end_time } = exam;
    const announcementId = announcement.id;

    if (!(announcementId in groupedExams)) {
      groupedExams[announcementId] = {
        name: announcement.name,
        exams: {},
      };
    }

    const examsByDate = groupedExams[announcementId].exams;

    if (!examsByDate.hasOwnProperty(exam_date)) {
      examsByDate[exam_date] = new Set();
    }

    const examsOnDate = examsByDate[exam_date];
    const existingExams = examsOnDate.has(subject.name);

    if (!existingExams) {
      examsOnDate.add({
        exam: subject.name,
        start: start_time,
        end: end_time,
      });
    }
  }

  // Convertir conjuntos a matrices si es necesario
  for (const announcementId in groupedExams) {
    const examsByDate = groupedExams[announcementId].exams;

    for (const examDate in examsByDate) {
      examsByDate[examDate] = Array.from(examsByDate[examDate]);
    }
  }

  return groupedExams;
}


