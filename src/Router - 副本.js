import * as VueRouter from /* webpackChunkName: "router-all" */ 'vue-router'

import DashBoard from /* webpackChunkName: "router-all" */ './components/Dashboard.vue'
import NotFound from /* webpackChunkName: "router-all" */ './components/404NotFound.vue'
import Forbidden from /* webpackChunkName: "router-all" */ './components/403Forbidden.vue'

import ProblemList from /* webpackChunkName: "router-all" */ './components/problem/ProblemList.vue'
import Problem from /* webpackChunkName: "router-all" */ './components/problem/Problem.vue'

import SubmissionList from /* webpackChunkName: "router-all" */ './components/submission/SubmissionList.vue'

import ContestList from /* webpackChunkName: "router-all" */ './components/contest/ContestList.vue'
import Contest from /* webpackChunkName: "router-all" */ './components/contest/Contest.vue'
import ContestParticipants from /* webpackChunkName: "router-all" */ './components/contest/ContestParticipants.vue'

import BlogList from /* webpackChunkName: "router-all" */ './components/blog/BlogList.vue'
import EditBlog from /* webpackChunkName: "router-all" */ './components/blog/EditBlog.vue'
import Blog from /* webpackChunkName: "router-all" */ './components/blog/Blog.vue'

import SystemManage from /* webpackChunkName: "router-all" */ './components/manage/SystemManage.vue'
import PermissionList from /* webpackChunkName: "router-all" */ './components/manage/PermissionList.vue'
import PermissionUserList from /* webpackChunkName: "router-all" */ './components/manage/PermissionUserList.vue'

import Login from /* webpackChunkName: "router-all" */ './components/user/Login.vue'
import Signup from /* webpackChunkName: "router-all" */ './components/user/Signup.vue'
import Logout from /* webpackChunkName: "router-all" */ './components/user/Logout.vue'
import UserList from /* webpackChunkName: "router-all" */ './components/user/UserList.vue'
import UserInfo from /* webpackChunkName: "router-all" */ './components/user/UserInfo.vue'
import UserInfoModify from /* webpackChunkName: "router-all" */ './components/user/UserInfoModify.vue'

const routes = [
    { path: '/', name: 'Dashboard', component: DashBoard },
    { path: '/404NotFound', name: '404NotFound', NotFound },
    { path: '/403Forbidden', name: '403Forbidden', Forbidden },
    
    { path: '/problems', name: 'ProblemList', component: ProblemList },
    { path: '/problem/:id', name: 'Problem', component: Problem },
    
    { path: '/submissions', name: 'SubmissionList', component: SubmissionList },
    
    { path: '/contests', name: 'ContestList', component: ContestList },
    { path: '/contest/:id', name: 'Contest', component: Contest },
    { path: '/contest/:id/participants', name: 'ContestParticipants', ContestParticipants },
    
    { path: '/blogs', name: 'BlogList', component: BlogList },
    { path: '/editblog', name: 'EditBlog', component: EditBlog },
    { path: '/blog/:id', name: 'Blog', Blog },
    
    { path: '/manage', name: 'SystemManage', component: SystemManage },
    { path: '/permissions', name: 'PermissionList', component: PermissionList },
    { path: '/permission/:id', name: 'PermissionUserList', component: PermissionUserList },
    
    { path: '/login', name: 'Login', component: Login },
    { path: '/signup', name: 'Signup', component: Signup },
    { path: '/logout', name: 'Logout', component: Logout },
    { path: '/users', name: 'UserList', component: UserList },
    { path: '/user/:id', name: 'UserInfo', component: UserInfo },
    { path: '/user/:id/modify', name: 'UserInfoModify', component: UserInfoModify },
]

const router = VueRouter.createRouter({
    history: VueRouter.createWebHashHistory(),
    routes,
})

export default router