<template>
<div class="text-center align-items-center d-flex h-100" style="padding-bottom:80px">
    <form class="form-signin" @submit.prevent="signup">
        <h1 class="h3 mb-3 font-weight-normal">Please Sign Up</h1>
        <input type="username" class="form-control form-signin-top" placeholder="Username" v-model="user_name"/>
        <input type="password" class="form-control form-signin-middle" placeholder="Password" v-model="password"/>
        <input type="password" class="form-control form-signin-middle" placeholder="Confirm Password" v-model="cpassword"/>
        <input type="text" class="form-control form-signin-bottom" placeholder="Verification Code" v-model="vcode"/>
        <img :src="getVSrc" @click="reloadVCode">
        <div class="text-danger small mt-1" v-if="invalid_u">
            Username must be made up by letters or numbers or underline and contains at least 3 at most 18 characters.
        </div>
        <div class="text-danger small mt-1" v-if="repeat_u">
            Username has been used by other users.
        </div>
        <div class="text-danger small mt-1" v-if="invalid_p">
            Password must be made up by letters or numbers or any special characters and contains at least 6 at most 18 characters.
        </div>
        <div class="text-danger small mt-1" v-if="invalid_c">
            Confirming password and password are different.
        </div>
        <div class="text-danger small mt-1" v-if="invalid_v">
            Verify code is wrong.
        </div>
        <div class="form-check mt-3 mb-3">
            <input class="form-check-input" type="checkbox" value="" id="remember_me" style="float:none" v-model="remember">
            <label class="form-check-label ms-1" for="remember_me">
                Remember me
            </label>
        </div>
        <button class="btn btn btn-primary btn-block" type="submit" style="width:50%">Sign Up</button>
    </form>
</div>
</template>

<script>
import { validUsername, validPassword, SHA256, callAPI } from '@/utils.js'
import { BASE_URL } from '@/config.js'
import { getCurrentInstance, onMounted } from 'vue'

export default {
    setup() {
        onMounted(() => {
            var t = getCurrentInstance()
            callAPI('captcha', 'post', {}, function(response) {
                t.data.vid = response.data.id
            })
        })
    },
    data() {
        return { user_name: "", password: "", cpassword: "", vcode: "", vid: "", version: Math.random(), remember: false,
            invalid_u: false, invalid_p: false, invalid_c: false, repeat_u: false, invalid_v: false  }
    },
    computed: {
        getVSrc() {
            return BASE_URL + "captcha?id=" + this.vid + "&v=" + this.version
        }
    },
    methods: {
        reloadVCode() {
            callAPI('captcha', 'patch', { id: this.vid }, (res) => {
                this.version = Math.random()
            })
        },
        signup() {
            this.invalid_u = !validUsername(this.user_name)
            this.invalid_p = !validPassword(this.password)
            this.invalid_c = this.password != this.cpassword
            this.repeat_u = this.invalid_v = false
            if (!this.invalid_u && !this.invalid_p && !this.invalid_c) {
                var ppassword = SHA256(this.password)
                callAPI('user', 'post', {
                    user_name: this.user_name,
                    password: ppassword,
                    remember: this.remember,
                    verify_id: this.vid,
                    verify_code: this.vcode,
                }, (res) => {
                    window.location.href = "/"
                }, (res) => {
                    if (res.data._error.includes("username")) {
                        this.repeat_u = true
                    } else {
                        this.invalid_v = true
                    }
                    callAPI('captcha', 'post', {}, (res) => {
                        this.vid = res.data.id
                    })
                })
            }
        },
    }
}
</script>

<style>
</style>