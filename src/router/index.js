import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/views/Home'
import Login from '@/views/Login'
import AccessCode from '@/views/AccessCode'
import SignUpStudent from '@/views/student/SignUp'
import SignUpMentor from '@/views/mentor/SignUp'
import SignUpAdmin from '@/views/admin/SignUp'
import Confirmation from '@/views/mentor/Confirmation'
import Dashboard from '@/views/Dashboard'
import About from '@/views/About'
import Profile from '@/views/Profile'
import ResetPassword from '@/views/ResetPassword'
import Docusign from '@/views/mentor/Docusign'

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/about',
      name: 'About',
      component: About
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/signup',
      name: 'AccessCode',
      component: AccessCode,
    },
    {
      path: '/signup/student',
      name: 'SignUpStudent',
      component: SignUpStudent
    },
    {
      path: '/signup/mentor',
      name: 'SignUpMentor',
      component: SignUpMentor
    },
    {
      path: '/signup/admin',
      name: 'SignUpAdmin',
      component: SignUpAdmin
    },
    {
      path: '/signup/:accessCode',
      name: 'SignUpWithAccessCode',
      component: AccessCode
    },
    {
      path: '/password-reset',
      name: 'ResetPassword',
      component: ResetPassword
    },
    {
      path: '/confirmation',
      name: 'Confirmation',
      component: Confirmation
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: Dashboard
    },
    {
      path: '/profile',
      name: 'Profile',
      component: Profile
    },
    {
      path: '/docusign',
      name: 'Docusign',
      component: Docusign
    }
  ]
})
