import Vue from 'vue'
import Router from 'vue-router'
import Index from '../views/Index.vue'
import Console from '../views/Console.vue'
import bankCard from '../views/bankCard.vue'
import bankProducts from '../views/bankProducts.vue'
import bankLog from '../views/bankLog.vue'
import Login from '../views/Login.vue'
import NotFound from '../views/NotFound.vue'
import uploadFile from '../views/uploadFile.vue'
import earningsStatistics from '../views/earningsStatistics.vue'

Vue.use(Router);

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/login',
      component: Login
    },
    {
      path: '/',
      component: Index,
      children: [
        {
          path: '/console',
          name: 'console',
          component: Console
        },
        // {
        //   path: '/users',
        //   name: 'users',
        //   component: Users
        // },
        {
          path: '/bankCard',
          name: 'bankCard',
          component: bankCard
        },
        {
          path: '/bankProducts',
          name: 'bankProducts',
          component: bankProducts
        },
        {
          path: '/bankLog',
          name: 'bankLog',
          component: bankLog
        },
        {
          path: '/uploadFile',
          name: 'uploadFile',
          component: uploadFile
        },
        {
          path: '/earningsStatistics',
          name: 'earningsStatistics',
          component: earningsStatistics
        },

        // {
        //   path: '/articles',
        //   name: 'articles',
        //   component: Articles
        // },
        // {
        //   path: '/echarts',
        //   name: 'echarts',
        //   component: Echarts
        // },

        {
          path: '/404',
          component: NotFound
        }
      ]
    },
    {
      path: '*',
      redirect: { path: '/404' }
    }
  ]
});

// 全局路由守卫
router.beforeEach((to, from, next) => {
  const LOGINURL = '/login'
  let url, user

  url = to.path
  user = sessionStorage.getItem('user')

  if (url === LOGINURL) {
    sessionStorage.removeItem('user')
  }

  // 判断是否登录
  if (!user && url !== LOGINURL) {
    next({ path: LOGINURL })
  } else {
    next()
  }
})

export default router