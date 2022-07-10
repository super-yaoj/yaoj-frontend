<template>
<div class="mt-5 container" style=""><div class="row">
    <div class="col-lg-3 col-sm-4 col-8" style="max-width:300px">
        <div><img src="/icons/default_icon.svg" /></div>
        <div class="mt-2" style="font-size:1.5rem;color:gray">{{user.user_name}}</div>
        <div class="mt-2 row px-2 mb-2">
        <button class="btn btn-outline-primary col mx-1" role="button" style="width:100%" @click="submit">Submit</button>
        <a class="btn btn-outline-secondary col mx-1" role="button" :href="'#/user/' + user.user_id" style="width:100%">Go Back</a>
        </div>
    </div>
     <div class="col-12 col-sm-8 col-lg-9">
        <ul class="nav nav-tabs" id="myTab" role="tablist">
            <li class="nav-item" role="presentation">
                <button class="nav-link active" id="home-tab" data-bs-toggle="tab" data-bs-target="#home" type="button">Normal</button>
            </li>
            <li class="nav-item" role="presentation">
                <button class="nav-link" id="profile-tab" data-bs-toggle="tab" data-bs-target="#preference" type="button">Preference</button>
            </li>
        </ul>
        <div class="tab-content container mt-3" id="myTabContent">
            <div class="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">
                <label class="ml-1"><strong>Password:</strong></label>
                <input type="password" class="form-control info-input-form" placeholder="Password" v-model="upassword">
                <div class="text-danger small mt-1" v-if="invalid_p">
                    Password must be made up by letters or numbers or any special characters and contains at least 6 at most 18 characters.
                </div>
                <div class="text-danger small mt-1" v-if="wrong_p">
                    Password is wrong.
                </div>
                <label class="ml-1 small mb-0" style="color:gray">You must type your password to modify personal information.</label>
                <hr />
                
                <label class="ml-1"><strong>Modified Password:</strong></label>
                <input type="password" class="form-control info-input-form" placeholder="Modified Password" v-model="npassword">
                <div class="text-danger small mt-1" v-if="invalid_p1">
                    Password must be made up by letters or numbers or any special characters and contains at least 6 at most 18 characters.
                </div>
                <label class="ml-1"><strong>Confirm Password:</strong></label>
                <input type="password" class="form-control info-input-form" placeholder="Confirm Password" v-model="cpassword">
                <div class="text-danger small mt-1" v-if="invalid_c">
                    Confirming password and password are different.
                </div>
                <label class="ml-1 small mb-0" style="color:gray">If you don't want to modify your password, just leave this empty.</label>
                <hr />
                
                <label class="ml-1"><strong>Gender:</strong></label><br />
                <div class="btn-group btn-group-toggle info-input-form" data-toggle="buttons" id="toggle">
                    <div class="btn-group" role="group" aria-label="Basic radio toggle button group">
                        <input type="radio" class="btn-check" name="btnradio" id="btnradio1" autocomplete="off" :checked="user.gender == 0" @click="user.gender = 0">
                        <label class="btn btn-outline-secondary" for="btnradio1" style="border-right:0px">Secret</label>
                        <input type="radio" class="btn-check" name="btnradio" id="btnradio2" autocomplete="off" :checked="user.gender == 1" @click="user.gender = 1">
                        <label class="btn btn-outline-secondary" for="btnradio2" style="border-right:0px">Male</label>
                        <input type="radio" class="btn-check" name="btnradio" id="btnradio3" autocomplete="off" :checked="user.gender == 2" @click="user.gender = 2">
                        <label class="btn btn-outline-secondary" for="btnradio3">Female</label>
                    </div>
                </div>
                <br />
                
                <label class="ml-1"><strong>Motto ({{user.motto.length}}/100):</strong></label>
                <input type="text" class="form-control info-input-form" placeholder="Motto" style="max-width:100%" maxlength="100" v-model="user.motto">
                <label class="ml-1"><strong>E-mail:</strong></label>
                <input type="text" class="form-control info-input-form" placeholder="E-mail" v-model="user.email" maxlength="50">
                <div class="text-danger small mt-1" v-if="invalid_email">
                    E-mail format is invalid.
                </div>
                <label class="ml-1"><strong>Organizaton:</strong></label>
                <input type="text" class="form-control info-input-form" placeholder="Organization" v-model="user.organization" maxlength="50">
            </div>
            <div class="tab-pane fade" id="preference" role="tabpanel">
                <label class="ml-1 small" style="color:gray">Settings in this page become effective immediately after modification.</label>
            </div>
        </div>
    </div>
</div></div>
</template>

<script>
import { queryUser, validPassword, validEmail, callAPI, SHA256 } from '@/utils'

export default {
    data() {
        return {
            user: { motto: "" }, upassword: "", npassword: "", cpassword: "",
            invalid_email: false, invalid_p: false, invalid_p1: false, invalid_c: false, wrong_p: false,
            advanced_editor: localStorage.getItem("advanced_editor") == "true",
        }
    },
    async mounted() {
        if (this.$user.user_id != this.$route.params.id) {
            this.$router.replace("/403Forbidden")
            return ''
        }
        this.user = await queryUser({user_id: this.$route.params.id})
    },
    methods: {
        submit() {
            this.invalid_p = !validPassword(this.upassword)
            this.invalid_p1 = this.npassword != "" && !validPassword(this.npassword)
            this.invalid_c = this.npassword != this.cpassword
            this.invalid_email = this.user.email != "" && !validEmail(this.user.email)
            this.wrong_p = false
            if (!this.invalid_p && !this.invalid_p1 && !this.invalid_c && !this.invalid_email) {
                var data = { user_id: this.user.user_id, password: SHA256(this.upassword),
                    gender: this.user.gender, motto: this.user.motto, email: this.user.email, organization: this.user.organization }
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
}
</script>

<style>
</style>