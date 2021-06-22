import Vue from 'vue';
import Router from 'vue-router';
//import HelloWorld from '@/components/HelloWorld';
import Login from '@/components/pages/Login';
import Dashboard from '@/components/Dashboard';
import Products from '@/components/pages/Products';
import OrderList from '@/components/pages/OrderList';
import Coupon from '@/components/pages/Coupon';
import CustomerOrder from '@/components/pages/CustomerOrder';
import CustomerOrderCheck from '@/components/pages/CustomerOrderCheck';

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '*',
      redirect: '/login',
    },
    // {
    //   path: '/',
    //   name: 'HelloWorld',
    //   component: HelloWorld,
    //   meta: { requiresAuth: true }
    // },
    {
      path: '/login',
      name: 'Login',
      component: Login,
    },

    {
      path: '/admin',
      name: 'Dashboard',
      component: Dashboard,
      children: [
        {
          path: 'products',
          name: 'Products',
          component: Products,
          meta: { requiresAuth: true },
        },
      ]
    },

    {
      path: '/admin',
      name: 'Dashboard',
      component: Dashboard,
      children: [
        {
          path: 'order_list',
          name: 'OrderList',
          component: OrderList,
          meta: { requiresAuth: true },
        },
      ]
    },

    {
      path: '/admin',
      name: 'Dashboard',
      component: Dashboard,
      children: [
        {
          path: 'coupon',
          name: 'Coupon',
          component: Coupon,
          meta: { requiresAuth: true },
        },
      ]
    },

    {
      path: '/',
      name: 'Dashboard',
      component: Dashboard,
      children: [
        {
          path: 'customer_order',
          name: 'CustomerOrder',
          component: CustomerOrder,
        },
        {
          path: 'customer_order_check/:orderId',
          name: 'CustomerOrderCheck',
          component: CustomerOrderCheck,
        },
      ]
    },
  ],
})
