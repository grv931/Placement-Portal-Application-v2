const API = "/api";

const routes = [
  { path: "/", redirect: "/login" },

  { path: "/login", component: Login },
  { path: "/register-student", component: RegisterStudent },
  { path: "/register-company", component: RegisterCompany },

  { path: "/admin/dashboard", component: AdminDashboard },
  { path: "/company/dashboard", component: CompanyDashboard },
  { path: "/student/dashboard", component: StudentDashboard }
];

const router = VueRouter.createRouter({
  history: VueRouter.createWebHashHistory(),
  routes
});

const app = Vue.createApp({});

app.component('app-navbar', Navbar);

app.use(router);

app.mount("#app");
