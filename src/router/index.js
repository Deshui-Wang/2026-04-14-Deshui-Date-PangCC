import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Square from '../views/Square.vue'
import Appointment from '../views/Appointment.vue'
import Profile from '../views/Profile.vue'
import Publish from '../views/Publish.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/square', name: 'Square', component: Square },
  { path: '/appointment', name: 'Appointment', component: Appointment },
  { path: '/profile', name: 'Profile', component: Profile },
  { path: '/publish/:id?', name: 'Publish', component: Publish }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
