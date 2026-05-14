import { createRouter, createWebHistory } from 'vue-router';
import type { RouteLocationRaw } from 'vue-router';
import {useUserStore} from "../stores/user.ts";

const HomeView = () => import('../views/HomeView.vue');
const ChatView = () => import('../views/ChatView.vue');

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
    return { name: 'login' } as RouteLocationRaw;
  }

  return true;
});

export default router;
