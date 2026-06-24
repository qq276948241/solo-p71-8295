import { createRouter, createWebHistory } from 'vue-router'
import PetList from '@/pages/PetList.vue'
import PetDetail from '@/pages/PetDetail.vue'
import CalendarView from '@/pages/CalendarView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: PetList,
  },
  {
    path: '/pet/:id',
    name: 'pet-detail',
    component: PetDetail,
  },
  {
    path: '/calendar',
    name: 'calendar',
    component: CalendarView,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
