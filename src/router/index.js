import { createRouter, createWebHistory } from 'vue-router'
import { useAuthService } from '@/core/service/auth.service'

import AppLayout from '@/layouts/app/AppLayout.vue'
import InitView from '@/views/app/init-view/InitView.vue'
import UsersView from '@/views/app/users-list/UsersView.vue'
import UserInfoView from '@/views/app/user-info/UserInfoView.vue'
import TopUpsView from '@/views/app/top-ups/TopUpsView.vue'
import MyProfileView from '@/views/app/my-profile/MyProfileView.vue'
import GeneralSettingsView from '@/views/app/general-settings/GeneralSettingsView.vue'

import AuthLayout from '@/layouts/auth/AuthLayout.vue'
import LoginView from '@/views/auth/LoginView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'app layout',
      component: AppLayout,
      children: [
        { path: '/', name: 'init', meta: { middleware: ['app'] }, component: InitView },
        {
          path: 'users-list',
          name: 'Users list',
          meta: { middleware: ['app'] },
          component: UsersView
        },
        {
          path: 'users-list/:userId',
          name: 'User info',
          props: true,
          meta: {
            middleware: ['app'],
            breadcrumbs: [{ name: 'users', attrs: { to: '/users-list' } }, { name: 'user info' }]
          },
          component: UserInfoView
        },
        {
          path: 'top-ups',
          name: 'Top ups',
          meta: { middleware: ['app'] },
          component: TopUpsView
        },
        {
          path: 'my-profile',
          name: 'My profile',
          meta: { middleware: ['app'] },
          component: MyProfileView
        },
        {
          path: 'general-settings',
          name: 'General settings',
          meta: { middleware: ['app'] },
          component: GeneralSettingsView
        },
        {
          path: '/dev-icons',
          name: 'Dev Icons',
          meta: { middleware: ['app'] },
          component: () => import('@/views/dev/ProjectIconsView.vue')
        },
        {
          path: '/dev-buttons',
          name: 'Dev Buttons',
          meta: { middleware: ['app'] },
          component: () => import('@/views/dev/ButtonsView.vue')
        },
        {
          path: '/dev-fonts',
          name: 'Dev Fonts',
          meta: { middleware: ['app'] },
          component: () => import('@/views/dev/FontsView.vue')
        }
      ]
    },
    {
      path: '/',
      name: 'auth layout',
      redirect: { name: 'login' },
      component: AuthLayout,
      children: [
        { path: 'login', name: 'login', component: LoginView },
        {
          path: 'forgot-password',
          name: 'Forgot Password',
          component: () => import('@/views/auth/ForgotPasswordView.vue')
        },
        {
          path: 'password-changed',
          name: 'Password Changed',
          component: () => import('@/views/auth/PasswordChangedView.vue')
        },
        {
          path: 'auth-wrong',
          name: 'Auth wrong',
          component: () => import('@/views/auth/AuthWrongView.vue')
        }
      ]
    },
    {
      path: '/:pathMatch(.*)*',
      name: '404',
      meta: { middleware: ['shared'] },
      component: () => import('@/views/Error404View.vue')
    }
  ]
})

router.beforeEach(async (to, from, next) => {
  const authService = useAuthService()
  const isLoggedIn = async () => {
    if (!authService.localCheckAuthToken()) {
      return false
    }
    return authService.isAuth || (await authService.checkAuth().catch(() => false))
  }

  if (await isLoggedIn()) {
    if (to.meta?.middleware?.find((el) => el.match('app|shared'))) return next()
    else return next({ to: '/' })
  } else {
    if (to.meta?.middleware?.includes('app')) return next({ path: '/login' })
    else return next()
  }
})

export default router
