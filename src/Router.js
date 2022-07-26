import * as VueRouter from 'vue-router'

const routes = [
    { path: '/', name: 'Dashboard', component: () => import(/* webpackChunkName: "router-all" */ './components/Dashboard.vue') },
    { path: '/404NotFound', name: '404NotFound', component: () => import(/* webpackChunkName: "router-all" */ './components/404NotFound.vue') },
    { path: '/403Forbidden', name: '403Forbidden', component: () => import(/* webpackChunkName: "router-all" */ './components/403Forbidden.vue') },
    { path: '/judgerlog', name: 'JudgerLog', component: () => import(/* webpackChunkName: "router-all" */ './components/JudgerLog.vue') },
    
    { path: '/problems', name: 'ProblemList', component: () => import(/* webpackChunkName: "router-all" */ './components/problem/ProblemList.vue') },
    { path: '/problem/:id', name: 'Problem', component: () => import(/* webpackChunkName: "router-all" */ './components/problem/Problem.vue') },
    { path: '/problem/:id/statistic', name: 'ProblemStatistic', component: () => import(/* webpackChunkName: "router-all" */ './components/problem/ProblemStatistic.vue') },
    
    { path: '/submissions', name: 'SubmissionList', component: () => import(/* webpackChunkName: "router-all" */ './components/submission/SubmissionList.vue') },
    { path: '/submission/:id', name: 'Submission', component: () => import(/* webpackChunkName: "router-all" */ './components/submission/Submission.vue') },
    { path: '/customtest', name: 'CustomTest', component: () => import(/* webpackChunkName: "router-all" */ './components/submission/CustomTest.vue') },
    
    { path: '/contests', name: 'ContestList', component: () => import(/* webpackChunkName: "router-all" */ './components/contest/ContestList.vue') },
    { path: '/contest/:id', name: 'Contest', component: () => import(/* webpackChunkName: "router-all" */ './components/contest/Contest.vue') },
    { path: '/contest/:id/participants', name: 'ContestParticipants', component: () => import(/* webpackChunkName: "router-all" */ './components/contest/ContestParticipants.vue') },
    
    { path: '/blogs', name: 'BlogList', component: () => import(/* webpackChunkName: "router-all" */ './components/blog/BlogList.vue') },
    { path: '/editblog', name: 'EditBlog', component: () => import(/* webpackChunkName: "router-all" */ './components/blog/EditBlog.vue') },
    { path: '/blog/:id', name: 'Blog', component: () => import(/* webpackChunkName: "router-all" */ './components/blog/Blog.vue') },
    
    { path: '/manage', name: 'SystemManage', component: () => import(/* webpackChunkName: "router-all" */ './components/manage/SystemManage.vue') },
    { path: '/permissions', name: 'PermissionList', component: () => import(/* webpackChunkName: "router-all" */ './components/manage/PermissionList.vue') },
    { path: '/permission/:id', name: 'PermissionUserList', component: () => import(/* webpackChunkName: "router-all" */ './components/manage/PermissionUserList.vue') },
    
    { path: '/login', name: 'Login', component: () => import(/* webpackChunkName: "router-all" */ './components/user/Login.vue') },
    { path: '/signup', name: 'Signup', component: () => import(/* webpackChunkName: "router-all" */ './components/user/Signup.vue') },
    { path: '/logout', name: 'Logout', component: () => import(/* webpackChunkName: "router-all" */ './components/user/Logout.vue') },
    { path: '/users', name: 'UserList', component: () => import(/* webpackChunkName: "router-all" */ './components/user/UserList.vue') },
    { path: '/user/:id', name: 'UserInfo', component: () => import(/* webpackChunkName: "router-all" */ './components/user/UserInfo.vue') },
    { path: '/user/:id/modify', name: 'UserInfoModify', component: () => import(/* webpackChunkName: "router-all" */ './components/user/UserInfoModify.vue') },
]

const router = VueRouter.createRouter({
    history: VueRouter.createWebHashHistory(),
    routes,
})

export default router