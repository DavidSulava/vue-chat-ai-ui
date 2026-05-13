import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import ChatView from '../views/ChatView.vue';
import {useUserStore} from "../stores/user.ts";

const routes = [
  { path: '/', name: 'login', component: HomeView },
  { path: '/chat', name: 'chat', component: ChatView },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to) => {
  const userStore = useUserStore();
  const isAuthenticated = !!userStore.userId;

  if (!isAuthenticated && to.name !== 'login') {
    return { name: 'login' };
  }

  return true;
});

export default router;
