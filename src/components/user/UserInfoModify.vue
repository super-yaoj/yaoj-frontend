<template>
  <div class="mt-5 container-md">
    <div class="row">
      <div class="col-lg-3 col-sm-4 col-8" style="max-width:300px">
        <div><img src="/icons/default_icon.svg" /></div>
        <UserName :id="user.user_id" :name="user.user_name" :rating="user.rating" style="font-size:1.5rem" class="mt-2" />
        <div class="mt-2 row px-2 mb-2">
          <button class="btn btn-outline-primary col mx-1" role="button" style="width:100%"
            @click="submit">Submit</button>
          <router-link class="btn btn-outline-secondary col mx-1" role="button" :to="`/user/${user.user_id}`"
            style="width:100%">Go Back</router-link>
        </div>
      </div>
      <div class="col-12 col-sm-8 col-lg-9">
        <TabView>
          <TabPane name="Normal">
            <div class="mt-3">
              <label class="ml-1"><strong>Password:</strong></label>
              <input type="password" class="form-control info-input-form" placeholder="Password" v-model="upassword">
              <div class="text-danger small mt-1" v-if="invalid_p">
                Password must be made up by letters or numbers or any special characters and contains at least 6 at most
                18 characters.
              </div>
              <div class="text-danger small mt-1" v-if="wrong_p">
                Password is wrong.
              </div>
              <label class="ml-1 small mb-0" style="color:gray">You must type your password to modify personal
                information.</label>
              <hr />

              <label class="ml-1"><strong>Modified Password:</strong></label>
              <input type="password" class="form-control info-input-form" placeholder="Modified Password"
                v-model="npassword">
              <div class="text-danger small mt-1" v-if="invalid_p1">
                Password must be made up by letters or numbers or any special characters and contains at least 6 at most
                18 characters.
              </div>
              <label class="ml-1"><strong>Confirm Password:</strong></label>
              <input type="password" class="form-control info-input-form" placeholder="Confirm Password"
                v-model="cpassword">
              <div class="text-danger small mt-1" v-if="invalid_c">
                Confirming password and password are different.
              </div>
              <label class="ml-1 small mb-0" style="color:gray">If you don't want to modify your password, just leave
                this
                empty.</label>
              <hr />

              <label class="ml-1"><strong>Gender:</strong></label><br />
              <div class="btn-group btn-group-toggle info-input-form" data-toggle="buttons" id="toggle">
                <div class="btn-group" role="group">
                  <input type="radio" class="btn-check" name="btnradio" id="btnradio1" autocomplete="off"
                    :checked="user.gender == 0" @click="user.gender = 0">
                  <label class="btn btn-outline-secondary" for="btnradio1" style="border-right:0px">Secret</label>
                  <input type="radio" class="btn-check" name="btnradio" id="btnradio2" autocomplete="off"
                    :checked="user.gender == 1" @click="user.gender = 1">
                  <label class="btn btn-outline-secondary" for="btnradio2" style="border-right:0px">Male</label>
                  <input type="radio" class="btn-check" name="btnradio" id="btnradio3" autocomplete="off"
                    :checked="user.gender == 2" @click="user.gender = 2">
                  <label class="btn btn-outline-secondary" for="btnradio3">Female</label>
                </div>
              </div>
              <br />

              <label class="ml-1"><strong>Motto ({{ user.motto.length }}/100):</strong></label>
              <input type="text" class="form-control info-input-form" placeholder="Motto" style="max-width:100%"
                maxlength="100" v-model="user.motto">
              <label class="ml-1"><strong>E-mail:</strong></label>
              <input type="text" class="form-control info-input-form" placeholder="E-mail" v-model="user.email"
                maxlength="50">
              <div class="text-danger small mt-1" v-if="invalid_email">
                E-mail format is invalid.
              </div>
              <label class="ml-1"><strong>Organizaton:</strong></label>
              <input type="text" class="form-control info-input-form" placeholder="Organization"
                v-model="user.organization" maxlength="50">
            </div>
          </TabPane>
          <TabPane name="Preference">
            <div class="mt-3">
              <label class="ml-1 small" style="color:gray">Settings in this page become effective immediately after
                modification.</label>
            </div>
          </TabPane>
        </TabView>
      </div>
    </div>
  </div>
</template>

<script>
import { queryUser, validPassword, validEmail, callAPI, SHA256 } from '@/utils'
import UserName from '@/models/UserName.vue'
import { TabView, TabPane } from '@/core'

export default {
  data() {
    return {
      user: { motto: "" }, upassword: "", npassword: "", cpassword: "",
      invalid_email: false, invalid_p: false, invalid_p1: false, invalid_c: false, wrong_p: false,
      advanced_editor: localStorage.getItem("advanced_editor") == "true",
    }
  },
  async mounted() {
    if (this.$store.user.user_id != this.$route.params.id) {
      this.$router.replace("/403Forbidden")
      return ''
    }
    this.user = await queryUser({ user_id: this.$route.params.id })
  },
  methods: {
    submit() {
      this.invalid_p = !validPassword(this.upassword)
      this.invalid_p1 = this.npassword != "" && !validPassword(this.npassword)
      this.invalid_c = this.npassword != this.cpassword
      this.invalid_email = this.user.email != "" && !validEmail(this.user.email)
      this.wrong_p = false
      if (!this.invalid_p && !this.invalid_p1 && !this.invalid_c && !this.invalid_email) {
        var data = {
          user_id: this.user.user_id, password: SHA256(this.upassword),
          gender: this.user.gender, motto: this.user.motto, email: this.user.email, organization: this.user.organization
        }
        if (this.npassword != "") data.new_password = SHA256(this.npassword)
        callAPI('user', 'put', data, (res) => {
          this.$router.push('/user/' + this.user.user_id)
        }, (res) => {
          if (res.data._error == "invalid password") {
            this.wrong_p = true
          } else alert(res.data._error)
        })
      }
    },
  },
  components: {
    UserName,
    TabView,
    TabPane
  }
}
</script>

<style>
</style>