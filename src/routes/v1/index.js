const express = require('express');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const roleRoute = require('./role.route');
const videoRoute = require('./video.route');
const planvideoRoute = require('./today.plan.route');
const boardRoute = require('./board.route');
const classesRoute = require('./classes.route');
const chapterRoute = require('./chapter.route');
const docsRoute = require('./docs.route');
const config = require('../../config/config');
const mediumRoute = require('./medium.route');
const lessionRoute = require('./lession.route');
const subjectRoute = require('./subject.route');
const bookRoute = require('./book.route');
const broadcast = require('./broadcast.route');
const quizeRoute = require('./quiz.route');
const presentatorRoute = require('./presentator.route');
const studioRoute = require('./studio.route');
const multimediaRoute = require('./multimedia.route');
const ebookRoute = require('./ebook.route');
const homeworkRoute = require('./homework.route');
const quickRecapRoute = require('./quickrecap.route');
const demolishedRoute = require('./demolished.route');
const studentRoute = require('./student.route');
const saralRoute = require('./saral.info.route');
const campusRoute = require('./campus.route');
const mappingRoute = require('./mapping.route');
const SessionRoute = require('./sessions.route');
const sectionRoute = require('./section.route');
const studentSessionRoute = require('./student.session.route');
const StudentAttendanceRoute = require('./studentattendance.route');
const quizSubmitRoute = require('./quizSubmit.route');
const ClassTeacherAssignRoute = require('./classteacherassign.route');
const departmentRoute = require('./department.user.route');
const studentLeftReasonRoute = require('./student.left.reason.route');
const grievanceRedressalRoute = require('./grievance.redressal.route');
const assectRoute = require('./assect.route');
const hostel = require('./hostel.route');
const attendanceVerifyRoute = require('./attendance.verify.route');
const menuRoute = require('./menu.router');
const lectureAttendance = require('./lecture.attendance.route');
const staffAttendance = require('./staff.attendance.route');
const recordedBroadcastRoute = require('./recorded.broadcast.route');
const studentPromoteRoute = require('./student.promote.route');
const leavingCertRoute = require('./leavingcert.route');
const studentQuestion = require('./student.question.route');
const lectureVideoRoute = require('./lecture.route');
const caseStudyRoute = require('./case.studies.route');
const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/studentpromote',
    route: studentPromoteRoute,
  },
  {
    path: '/users',
    route: userRoute,
  },
  {
    path: '/sections',
    route: sectionRoute,
  },
  {
    path: '/videos',
    route: videoRoute,
  },
  {
    path: '/todayplan',
    route: planvideoRoute,
  },
  {
    path: '/boards',
    route: boardRoute,
  },
  {
    path: '/classes',
    route: classesRoute,
  },
  {
    path: '/medium',
    route: mediumRoute,
  },
  {
    path: '/lession',
    route: lessionRoute,
  },
  {
    path: '/chapter',
    route: chapterRoute,
  },
  {
    path: '/subjects',
    route: subjectRoute,
  },
  {
    path: '/books',
    route: bookRoute,
  },
  {
    path: '/broadcast',
    route: broadcast,
  },
  {
    path: '/quizes',
    route: quizeRoute,
  },
  {
    path: '/presentator',
    route: presentatorRoute,
  },
  {
    path: '/studio',
    route: studioRoute,
  },
  {
    path: '/multimedia',
    route: multimediaRoute,
  },
  {
    path: '/ebooks',
    route: ebookRoute,
  },
  {
    path: '/homework',
    route: homeworkRoute,
  },
  {
    path: '/quickrecaps',
    route: quickRecapRoute,
  },
  {
    path: '/roles',
    route: roleRoute,
  },

  {
    path: '/demolished',
    route: demolishedRoute,
  },
  {
    path: '/saralInfo',
    route: saralRoute,
  },
  {
    path: '/student',
    route: studentRoute,
  },
  {
    path: '/campus',
    route: campusRoute,
  },
  {
    path: '/mapping',
    route: mappingRoute,
  },
  {
    path: '/session',
    route: SessionRoute,
  },
  {
    path: '/studentSession',
    route: studentSessionRoute,
  },
  {
    path: '/classteacher',
    route: ClassTeacherAssignRoute,
  },
  {
    path: '/studentattendance',
    route: StudentAttendanceRoute,
  },
  {
    path: '/lectureattendance',
    route: lectureAttendance,
  },
  {
    path: '/staffattendancenew',
    route: staffAttendance,
  },
  {
    path: '/quiz-submissions',
    route: quizSubmitRoute,
  },

  {
    path: '/department',
    route: departmentRoute,
  },
  {
    path: '/studentleft',
    route: studentLeftReasonRoute,
  },
  {
    path: '/grievanceredressal',
    route: grievanceRedressalRoute,
  },
  {
    path: '/assets',
    route: assectRoute,
  },
  {
    path: '/hostel',
    route: hostel,
  },
  {
    path: '/attendance-verify',
    route: attendanceVerifyRoute,
  },
  {
    path: '/menu',
    route: menuRoute,
  },
  {
    path: '/recordedbroadcast',
    route: recordedBroadcastRoute,
  },
  {
    path: '/leaving-cert',
    route: leavingCertRoute,
  },
  {
    path: '/student-question',
    route: studentQuestion,
  },
  {
    path: '/lecture-video',
    route: lectureVideoRoute,
  },
   {
    path: '/case-study',
    route: caseStudyRoute,
  },
];

const devRoutes = [
  // routes available only in development mode
  {
    path: '/docs',
    route: docsRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
if (config.env === 'development') {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

module.exports = router;
