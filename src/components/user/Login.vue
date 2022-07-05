<template>
<div class="text-center align-items-center d-flex h-100" style="padding-bottom:80px">
    <form class="form-signin" @submit.prevent="login">
        <h1 class="h3 mb-3 font-weight-normal">Please Log In</h1>
        <input type="username" class="form-control form-signin-top" placeholder="Username" v-model="user_name"/>
        <input type="password" class="form-control form-signin-bottom" placeholder="Password" v-model="password"/>
        <div class="text-danger small mt-1" v-if="invalid_u">
            Username must be made up by letters or numbers or underline and contains at least 3 at most 18 characters.
        </div>
        <div class="text-danger small mt-1" v-if="invalid_p">
            Password must be made up by letters or numbers or any special characters and contains at least 6 at most 18 characters.
        </div>
        <div class="text-danger small mt-1" v-if="wrong_login != ''">
            {{wrong_login}}
        </div>
        <div class="form-check mt-3 mb-3">
            <input class="form-check-input" type="checkbox" value="" id="remember_me" style="float:none" v-model="remember">
            <label class="form-check-label ms-1" for="remember_me">
                Remember me
            </label>
        </div>
        <button class="btn btn btn-primary btn-block" type="submit" style="width:50%">Log In</button>
    </form>
</div>
</template>

<script>
import { validUsername, validPassword, SHA256, callRPC } from '@/utils.js'

export default {
    data() {
        return { user_name: "", password: "", remember: false, invalid_u: false, invalid_p: false, wrong_login: "" }
    },
    methods: {
        login() {
            this.invalid_u = !validUsername(this.user_name)
            this.invalid_p = !validPassword(this.password)
            this.wrong_login = ""
            if (!this.invalid_u && !this.invalid_p) {
                var ppassword = SHA256(this.password)
                callRPC('UserLogin', {
                    user_name: this.user_name,
                    password: ppassword,
                    remember: this.remember,
                }, (res) => {
                    window.location.href = "/"
                }, (res) => {
                    this.wrong_login = res.data._error.message
                })
            }
        },
    }
}
</script>

<style>
</style>