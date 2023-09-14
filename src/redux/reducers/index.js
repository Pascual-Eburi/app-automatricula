import { combineReducers } from 'redux';
import Auth from './auth';
import Alert from './alert';
import Announcement from './announcement';
import Enrollment from './enrollment';
import Exam from './exam';
import Institute from './institutes';
import Modality from './modality';
import Province from './provinces';
import Student from './student';
import Subject from './subject';
import Degree from './degrees';


export default combineReducers({
    Auth, 
    Alert,
    Announcement,
    Enrollment,
    Exam,
    Institute,
    Modality,
    Province,
    Student,
    Subject,
    Degree

})