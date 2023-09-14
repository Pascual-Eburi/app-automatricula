# File serializers
from rest_framework import serializers
# from apps.announcement.serializers import AnnouncementSerializer
# from apps.degree.serializers import DegreeSerializer
from .models import Enrollment
from apps.exam.models import Exam
from apps.grade.models import Grade
from django.utils import timezone
from core.utils import is_valid_number
# from apps.subject.serializers import SubjectSerializer

# Serializer
""" class EnrollmentSerializer(serializers.ModelSerializer):
    # all phase's subjects
    #subjects = SubjectSerializer(many = True, read_only = True)
    class Meta:
        model = Enrollment
        fields = '__all__' 
        
class EnrollmentSerializer(serializers.ModelSerializer):
    announcement = AnnouncementSerializer()
    subjects = serializers.SerializerMethodField()
    degrees = serializers.SerializerMethodField()

    class Meta:
        model = Enrollment
        fields = '__all__'

    def get_announcement(self, obj):
        return {'name': obj.announcement.name, 'announcement_id': obj.announcement.pk}

    def get_subjects(self, obj):
        return obj.subjects.values_list('pk', flat=True)

    def get_degrees(self, obj):
        return obj.degrees.values_list('pk', flat=True)       


"""

class EnrollmentDocumentsSerializer(serializers.ModelSerializer):
    announcement = serializers.SerializerMethodField()
    student = serializers.SerializerMethodField()
    
    class Meta:
        model = Enrollment
        fields = ('code', 'announcement', 'enrollment_date',
                   'copy_id_card', 'proof_of_payment', 'student', 'status', 'status_id_card', 'status_proof_payment', 
        )
        
    def get_announcement(self, obj):
        return {
            'id': obj.announcement.pk,
            'name': obj.announcement.name,
            'list_submision_start' : obj.announcement.list_submision_start,
            'enrollment_start' : obj.announcement.enrollment_start,
            'enrollment_end' : obj.announcement.enrollment_end,
        }
        
    def get_student(self, obj):
        return {
            'code': obj.student.pk,
            'name': obj.student.user.get_full_name(),
            'institute': obj.student.institute.name,
        }
        
        
class EnrollmentListSerializer(serializers.ModelSerializer):
    announcement = serializers.SerializerMethodField()
    student = serializers.SerializerMethodField()
    
    class Meta:
        model = Enrollment
        fields = ('code', 'announcement', 'student')
        
    
    def get_announcement(self, obj):
        return {
            'announcement_id': obj.announcement.pk,
            'name': obj.announcement.name,
            'grades_publication': obj.announcement.grades_publication
        }

    def get_student(self, obj):
        return {
            'student': obj.student.pk,
            'name': obj.student.user.get_full_name(),
            # 'photo': obj.student.photo.url if obj.student.photo else '',
            'institute': obj.student.institute.name,
            #'modality': obj.student.modality.name
        }
        
class EnrollmentExamSerializer(serializers.ModelSerializer):
    subjects = serializers.SerializerMethodField()
    class Meta:
        model = Enrollment
        fields = ('code', 'subjects')
        
    def get_subjects(self, obj):
        subjects = {}
        for subject in obj.subjects.all():
            phase = subject.phase_id.name
            exam = self.get_exam(subject.subject_id, obj)
            subject_data = {
                "subject_id": subject.subject_id,
                "name": subject.name,
                "exam": exam
            }

            if phase not in subjects:
                subjects[phase] = [subject_data]
            else:
                subjects[phase].append(subject_data)

        return subjects
    
    
    def get_exam_grade(self, exam, obj):

        if Grade.objects.filter(
            exam_id=exam, enrollment=obj.code
        ).exists():
            grade = Grade.objects.get(exam_id=exam, enrollment=obj.code)

            return grade.grade

        return ''

    
    def get_exam(self, subject, obj):
        exam = Exam.objects.filter(subject_id=subject, announcement_id=obj.announcement)


        if exam:
            exam = Exam.objects.get(subject_id=subject, announcement_id=obj.announcement)
            return {
                'id': exam.exam_id,
                'exam': exam.__str__(),
                'grade': self.get_exam_grade(exam.exam_id, obj),
                
            }

        return None
        
        
        
        
        

class EnrollmentSerializer(serializers.ModelSerializer):
    announcement = serializers.SerializerMethodField()
    student = serializers.SerializerMethodField()
    subjects = serializers.SerializerMethodField()
    degrees = serializers.SerializerMethodField()
    exam_class_room = serializers.SerializerMethodField()
    previous_enrollments = serializers.SerializerMethodField()
    
    # degrees = DegreeSerializer(many=True)

    class Meta:
        model = Enrollment
        # fields = ('code', 'announcement', 'subjects', 'degrees', 'enrollment_date', 'price', 'copy_id_card', 'proof_of_payment', 'student')
        # fields = ('code', 'announcement', 'subjects', 'degrees', 'enrollment_date', 'price', 'copy_id_card', 'proof_of_payment', 'student', 'phase_results') 'previous_enrollments'
        
        fields = ('code', 'announcement', 'subjects', 'degrees', 'enrollment_date',
                    'price', 'copy_id_card', 'proof_of_payment', 'student', 'exam_class_room', 'status', 'status_id_card', 'status_proof_payment', 'previous_enrollments'
                )
        
        
    def get_previous_enrollments(self, obj):
        previous_enrollments = []

        # Obtener las matrículas previas del alumno
        enrollments = Enrollment.objects.filter(student=obj.student, enrollment_date__lt=obj.enrollment_date) #.exclude(code=obj.code)

        for enrollment in enrollments:
            phase_results = self.get_phase_results(enrollment)
            average_grades = {phase: result['average_grade'] for phase, result in phase_results.items()}
            
            previous_enrollments.append({
                'enrollment': enrollment.code,
                'date': enrollment.enrollment_date,
                'phase_results': average_grades
            })

        return previous_enrollments


    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['previous_enrollments'] = self.get_previous_enrollments(instance)
        phase_results = {}
        if timezone.now() < instance.announcement.grades_publication:
            return data

        for subject in instance.subjects.all():
            phase = subject.phase_id.name
            exams = self.get_exam(subject.subject_id, instance)

            
            for exam in exams:
                if phase not in phase_results:
                    phase_results[phase] = {'subjects': [], 'average_grade': 0}

                grade = 0

                if is_valid_number(exam['grade']):
                    grade = exam['grade']

                phase_results[phase]['subjects'].append(grade)

        for phase in phase_results:
            subjects = phase_results[phase]['subjects']
            if subjects:
                phase_results[phase]['average_grade'] = sum(
                    subjects) / len(subjects)

        data['phase_results'] = phase_results
        
        return data

    def get_exam_grade(self, exam, obj):

        # chech if grade publication date
        if timezone.now() < obj.announcement.grades_publication:
            return ''

        if Grade.objects.filter(
            exam_id=exam, enrollment=obj.code
        ).exists():
            grade = Grade.objects.get(exam_id=exam, enrollment=obj.code)

            return grade.grade

        return 0

    
    def get_exam(self, subject, obj):
        exams = Exam.objects.filter(subject_id=subject, announcement_id=obj.announcement)
        results = []

        for exam in exams:
            results.append({
                'exam': exam.__str__(),
                'grade': self.get_exam_grade(exam.exam_id, obj),
                'start_time': exam.start_time,
                'end_time': exam.end_time,
                'exam_date': exam.exam_date
                
            })

        return results
    



    def get_exam_class_room(self, obj):
        
        if hasattr(obj.exam_class_room, 'pk'):
            return {
                'classroom_id': obj.exam_class_room.pk,
                'name': obj.exam_class_room.name,
                'examCenter': obj.exam_class_room.center_id.name
            }
            
        return {
                'clasroom_id': None,
                'name': 'No asignado',
                'examCenter': 'No asignado'
            }
        

            
    def get_announcement(self, obj):
        return {
            'announcement_id': obj.announcement.pk,
            'name': obj.announcement.name,
            'grades_publication': obj.announcement.grades_publication
        }

    def get_student(self, obj):
        return {
            'student': obj.student.pk,
            'name': obj.student.user.get_full_name(),
            'photo': obj.student.photo.url if obj.student.photo else '',
            'institute': obj.student.institute.name,
            'modality': obj.student.modality.name
        }

    def get_subjects(self, obj):
        subjects = {}
        for subject in obj.subjects.all():
            phase = subject.phase_id.name
            exam = self.get_exam(subject.subject_id, obj)
            subject_data = {
                "subject_id": subject.subject_id,
                "name": subject.name,
                "exam": exam
            }

            if phase not in subjects:
                subjects[phase] = [subject_data]
            else:
                subjects[phase].append(subject_data)

        return subjects

    def get_degrees(self, obj):
        degrees = []
        for degree in obj.degrees.all():
            degrees.append({
                'degree_id': degree.degree_id,
                'name': degree.name
            })

        return degrees

    def get_phase_results(self, obj):
        phase_results = {}

        for subject in obj.subjects.all():
            phase = subject.phase_id.name
            exams = self.get_exam(subject.subject_id, obj)

            for exam in exams:
                if phase not in phase_results:
                    phase_results[phase] = {'subjects': [], 'average_grade': 0}

                phase_results[phase]['subjects'].append(exam['grade'])

        for phase in phase_results:
            subjects = phase_results[phase]['subjects']
            if subjects:
                phase_results[phase]['average_grade'] = round(sum(
                    subjects) / len(subjects), 2)

        return phase_results


"""
{
    "enrollments": [
        {
            "code": "1234re",
            "announcement": {
                "name": "Junio 2023",
                "announcement_id": 1
            },
            "subjects": {
              "Fase General": [
                  { "id": 1, "name": ""}
              ],
              "Fase Especifica": [
                  { "id": 4, "name": ""}
              ]  
            },
            "degrees": [
                { "id": 1, "name": ""},
                { "id": 3, "name": ""},
                { "id": 4, "name": ""}
            ],
            "enrollment_date": "2023-04-30T16:23:43+02:00",
            "price": 4500,
            "copy_id_card": "/media/enrollments/Junio%202023/1234re/DNI_CONYUGE_Lvcrs5W.pdf",
            "proof_of_payment": "/media/enrollments/Junio%202023/1234re/TASA_TARJETA_7yEKjo5.pdf",
            "student": 44
        }
    ]
}




"""
