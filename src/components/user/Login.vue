<template>
  <div class="text-center align-items-center d-flex h-100">
    <form class="form-signin" @submit.prevent="login">
      <h1 class="h3 mb-3 font-weight-normal" v-t="'sign.login_title'"></h1>
      <input type="username" class="form-control form-signin-top" :placeholder="$t('sign.username')"
        v-model="user_name" />
      <input type="password" class="form-control form-signin-bottom" :placeholder="$t('sign.password')"
        v-model="password" />
      <div class="text-danger small mt-1" v-if="!valid_u" v-t="'sign.msg.valid_username'"></div>
      <div class="text-danger small mt-1" v-if="!valid_p" v-t="'sign.msg.valid_password'"></div>
      <div class="text-danger small mt-1" v-if="wrong_login != ''">
        {{  wrong_login  }}
      </div>
      <div class="form-check mt-3 mb-3">
        <input class="form-check-input" type="checkbox" value="" id="rememberme" style="float:none" v-model="remember">
        <label class="form-check-label ms-1" for="rememberme" v-t="'sign.remember'"></label>
      </div>
      <button class="btn btn btn-primary btn-block" type="submit" style="width:50%" v-t="'sign.login'"></button>
    </form>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { validUsername, validPassword, SHA256, callRPC } from '@/utils'

const user_name = ref(''),
  password = ref(''),
  remember = ref(false),
  wrong_login = ref(''),
  valid_u = computed(() => validUsername(user_name.value)),
  valid_p = computed(() => validPassword(password.value));

const login = () => {
  wrong_login.value = ""
  if (valid_u.value && valid_p.value) {
    var ppassword = SHA256(password.value)
    callRPC('UserLogin', {
      user_name: user_name.value,
      password: ppassword,
      remember: remember.value,
    }, (res) => {
      window.location.href = "/"
    }, (res) => {
      wrong_login.value = res.data._error.message
    })
  }
}
</script>

<style>
</style>