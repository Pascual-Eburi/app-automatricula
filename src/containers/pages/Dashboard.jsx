/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import AnnouncementSchedule from '../../components/dashboard/AnnouncementSchedule';
import CalendarComponent from '../../components/dashboard/calendar';
import ExamSchedule from '../../components/dashboard/ExamSchedule';
import KTComponents, { KTAppSidebar } from '../../helpers/AppComponents';
import Layout from "../../hocs/Layout"
import usePageTitle from '../../hooks/hooks';
import { get_exams, get_institute_exams, get_student_exams } from '../../redux/actions/exams';

function Dashboard ({
  user,
  isAuthenticated,
  enrollments,
  announcements,
  get_exams,
  exams,
  get_institute_exams,
  get_student_exams

}) {
    usePageTitle('Panel'); // title
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
      if (user){
        const userRole = user.user_data.rol;

        switch (userRole) {
          case "student":
            const id = user.user_data.id;
            get_student_exams(id);
            break;
    
          case "institute_staff":
            const institute = user.staff_data.institute.code;
            get_institute_exams(institute);
            break;
    
          default:
            get_exams();
            break;
        }
    
        window.scrollTo(0, 0);
        setIsMounted(true);

      }
    }, [user]);
  
    useEffect(() => {
      if (isMounted) { 
        KTComponents.init();
        KTAppSidebar.init();
      
      }
  
      return () => { setIsMounted(false); };
    }, [isMounted]);

    return(
        <Layout>
            <div className="row g-5 g-xl-10 mb-5 mb-xl-10">
              <div className="col-md-4">
                <AnnouncementSchedule announcements={announcements} />
                <ExamSchedule exams={exams} announcements={announcements} />
              </div>
              <div className="col-md-8">
                <CalendarComponent 
                announcements={announcements} 
                enrollments = {enrollments} />
              </div>
            </div>
        </Layout>
    )
}


const mapStateToProps = (state) => ({
  exams: state.Exam.exams,
  enrollments: state.Enrollment.enrollment,
  announcements: state.Announcement.announcements,
  user: state.Auth.user,
  isAuthenticated: state.Auth.isAuthenticated,

});

export default connect(mapStateToProps, {
get_exams,
get_institute_exams,
get_student_exams
})(Dashboard);