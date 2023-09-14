# File serializers
from rest_framework import serializers
from django.core.exceptions import MultipleObjectsReturned
from .models import Exam, ExamCenter, Classroom
from apps.enrollment.models import EnrollmentSubjects, Enrollment
from apps.institute.models import ExamCenterAssignment
from django.utils import timezone


# Examen serializer
class ExamSerializer(serializers.ModelSerializer):
    subject = serializers.SerializerMethodField()
    announcement = serializers.SerializerMethodField()

    class Meta:
        model = Exam
        fields = ('exam_id','exam_date','start_time','end_time','subject','announcement',)


    def get_subject(self, obj):
        return {
            'id': obj.subject_id.pk,
            'name': obj.subject_id.name,
            'phase': obj.subject_id.phase_id.name
        }


    def get_announcement(self, obj):
        status_grade = {'type': '', 'msg': ''}
        if  obj.announcement_id.grades_publication <= timezone.now():
            status_grade['type'] = 'success'
            status_grade['msg'] = 'Publicada'
        else:            
            status_grade['type'] = 'danger'
            status_grade['msg'] = 'No Publicada'
          
        return {
            'id': obj.announcement_id.pk,
            'name': obj.announcement_id.name,
            'status_grade': status_grade
        }
    
    
    def get_student(self, obj):
        try:
            enrollment_subject = EnrollmentSubjects.objects.get(subject=obj.subject_id)
            student = enrollment_subject.enrollment.student
        except MultipleObjectsReturned:
            enrollment_subject = EnrollmentSubjects.objects.filter(subject=obj.subject_id).first()
            student = enrollment_subject.enrollment.student

        enrollment = Enrollment.objects.get(code = enrollment_subject.enrollment) or None


        return {
            'id': student.user.pk,
            'name': student.user.get_full_name(),
            'photo': student.photo.url,
            'institute': student.institute.name,
            'exam_center': self.get_exam_class_room(enrollment)
        } 
            
    """     def get_student(self, obj):
            enrollment_subject = None

            try:
                enrollment_subjects = EnrollmentSubjects.objects.filter(subject=obj.subject_id)
                students = [enrollment_subject.enrollment.student for enrollment_subject in enrollment_subjects]
                enrollment_subject = enrollment_subjects.first()  # Actualizar enrollment_subject con el primer objeto de la lista
            except MultipleObjectsReturned:
                enrollment_subject = EnrollmentSubjects.objects.filter(subject=obj.subject_id).first()
                students = [enrollment_subject.enrollment.student]

            student_data = []
            for student in students:
                enrollment = Enrollment.objects.get(code=enrollment_subject.enrollment)
                student_data.append({
                    'id': student.user.pk,
                    'name': student.user.get_full_name(),
                    'photo': student.photo.url,
                    'institute': student.institute.name,
                    'exam_center': self.get_exam_class_room(enrollment)
                })

            return student_data
 """

    def get_exam_class_room(self, enrollment):

        if enrollment:
            return {
                'exam_center': enrollment.exam_class_room.center_id.name,
                'class_room': enrollment.exam_class_room.name,
                'address': enrollment.exam_class_room.center_id.address
            }
        else:
            return None

   
    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['student'] = self.get_student(instance)
        
        return data

# Exam Center serializer   
class ExamCenterSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExamCenter
        fields = '__all__'


# Classroom serialezer
class ClassroomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Classroom
        fields = '__all__'





class EnrollmentSubjectsSerializer(serializers.ModelSerializer):
    #exam_id = serializers.IntegerField(source='subject.exam.id')
    #exam_date = serializers.DateField(source='subject.exam.exam_date')
    #start_time = serializers.TimeField(source='subject.exam.start_time')
    #end_time = serializers.TimeField(source='subject.exam.end_time')
    subject = serializers.SerializerMethodField()
    announcement = serializers.SerializerMethodField()
    student = serializers.SerializerMethodField()

    class Meta:
        model = EnrollmentSubjects
        fields = (
            'subject',
            'announcement',
            'student'
        )

    def get_subject_exam(self, obj):
        announcement = obj.enrollment.announcement.pk
        exam = Exam.objects.filter(subject_id=obj.subject_id, announcement_id=announcement)
        if not exam.exists():
            return {}
        #enrollment = Enrollment.objects.get(code = enrollment_subject.enrollment) or None
        return Exam.objects.get(subject_id=obj.subject_id, announcement_id=announcement)
        
        
    def to_representation(self, instance):
        data = super().to_representation(instance)
        exam_data = self.get_subject_exam(instance)
        data['exam_id'] = exam_data.exam_id or None
        data['exam_date'] = exam_data.exam_date or None
        data['start_time'] = exam_data.start_time or None
        data['end_time'] = exam_data.end_time or None
        
        return data

    def get_subject(self, obj):
        subject = obj.subject
        return {
            'id': subject.pk,
            'name': subject.name,
            'phase': subject.phase_id.name
        }

    def get_announcement(self, obj):
        announcement = obj.enrollment.announcement
        status_grade = {'type': '', 'msg': ''}
        if  announcement.grades_publication <= timezone.now():
            status_grade['type'] = 'success'
            status_grade['msg'] = 'Publicada'
        else:            
            status_grade['type'] = 'danger'
            status_grade['msg'] = 'No Publicada'
          
        return {
            'id': announcement.pk,
            'name': announcement.name,
            'status_grade': status_grade
        }

    def get_student(self, obj):
        enrollment = obj.enrollment
        student = enrollment.student
        return {
            'id': student.pk,
            'name': student.user.get_full_name(),
            'photo': student.photo.url,
            'institute': student.institute.name,
            'exam_center': {
                'exam_center': enrollment.exam_class_room.center_id.name,
                'class_room': enrollment.exam_class_room.name,
                'address': enrollment.exam_class_room.center_id.address
            }
        }
