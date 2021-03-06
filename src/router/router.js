import Vue from 'vue'
import Router from 'vue-router'
import Index from '../views/Index.vue'
import bankCard from '../views/bankCard.vue'
import bankProducts from '../views/bankProducts.vue'
import bankMyProduct from '../views/bankMyProduct.vue'
import homePage from '../views/homePage.vue'
import bankLog from '../views/bankLog.vue'
import Login from '../views/Login.vue'
import NotFound from '../views/NotFound.vue'
import uploadFile from '../views/uploadFile.vue'
import earningsStatistics from '../views/earningsStatistics.vue'
import echarts from '../views/echarts.vue'
import expectedIncome from '../views/expectedIncome.vue'
import expectedIncomeTotal from '../views/expectedIncomeTotal.vue'

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
          path: '/homePage',
          name: 'homePage',
          component: homePage
        },
        {
          path: '/Index',
          name: 'Index',
          component: Index
        },
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
          path: '/bankMyProduct',
          name: 'bankMyProduct',
          component: bankMyProduct
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
        {
          path: '/expectedIncome',
          name: 'expectedIncome',
          component: expectedIncome
        },
        {
          path: '/expectedIncomeTotal',
          name: 'expectedIncomeTotal',
          component: expectedIncomeTotal
        },
        {
          path: '/echarts',
          name: 'echarts',
          component: echarts
        },

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
