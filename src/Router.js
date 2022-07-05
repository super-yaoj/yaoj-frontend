import * as VueRouter from 'vue-router'

const routes = [
    { path: '/', name: 'Dashboard', component: () => import('./components/Dashboard.vue') },
    { path: '/404NotFound', name: '404NotFound', component: () => import('./components/404NotFound.vue') },
    { path: '/403Forbidden', name: '403Forbidden', component: () => import('./components/403Forbidden.vue') },
    
    { path: '/problems', name: 'ProblemList', component: () => import('./components/problem/ProblemList.vue') },
    { path: '/problem/:id', name: 'Problem', component: () => import('./components/problem/Problem.vue') },
    
    { path: '/submissions', name: 'SubmissionList', component: () => import('./components/submission/SubmissionList.vue') },
    
    { path: '/contests', name: 'ContestList', component: () => import('./components/contest/ContestList.vue') },
    { path: '/contest/:id', name: 'Contest', component: () => import('./components/contest/Contest.vue') },
    { path: '/contest/:id/participants', name: 'ContestParticipants', component: () => import('./components/contest/ContestParticipants.vue') },
    
    { path: '/blogs', name: 'BlogList', component: () => import('./components/blog/BlogList.vue') },
    { path: '/editblog', name: 'EditBlog', component: () => import('./components/blog/EditBlog.vue') },
    { path: '/blog/:id', name: 'Blog', component: () => import('./components/blog/Blog.vue') },
    
    { path: '/manage', name: 'SystemManage', component: () => import('./components/manage/SystemManage.vue') },
    { path: '/permissions', name: 'PermissionList', component: () => import('./components/manage/PermissionList.vue') },
    { path: '/permission/:id', name: 'PermissionUserList', component: () => import('./components/manage/PermissionUserList.vue') },
    
    { path: '/login', name: 'Login', component: () => import('./components/user/Login.vue') },
    { path: '/signup', name: 'Signup', component: () => import('./components/user/Signup.vue') },
    { path: '/logout', name: 'Logout', component: () => import('./components/user/Logout.vue') },
    { path: '/users', name: 'UserList', component: () => import('./components/user/UserList.vue') },
    { path: '/user/:id', name: 'UserInfo', component: () => import('./components/user/UserInfo.vue') },
    { path: '/user/:id/modify', name: 'UserInfoModify', component: () => import('./components/user/UserInfoModify.vue') },
]

const router = VueRouter.createRouter({
    history: VueRouter.createWebHashHistory(),
    routes,
})

export default router