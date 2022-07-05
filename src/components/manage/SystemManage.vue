<template>
<div class="mt-4 container" style=""><div class="row">
    <ul class="nav nav-tabs" id="myTab" role="tablist">
        <li class="nav-item" role="presentation">
            <button class="nav-link active" id="permissions-tab" data-bs-toggle="tab" data-bs-target="#permissions" type="button" role="tab" aria-controls="permissions" aria-selected="true">Permissions</button>
        </li>
        <li class="nav-item" role="presentation">
            <button class="nav-link" id="submissions-tab" data-bs-toggle="tab" data-bs-target="#submissions" type="button" role="tab" aria-controls="submissions" aria-selected="false">Submissions</button>
        </li>
        <li class="nav-item" role="presentation">
            <button class="nav-link" id="thumbs-tab" data-bs-toggle="tab" data-bs-target="#thumbs" type="button" role="tab" aria-controls="thumbs" aria-selected="false">Thumbs</button>
        </li>
    </ul>
    <div class="tab-content container mt-3" id="myTabContent">
        <div class="tab-pane fade show active" id="permissions" role="tabpanel" aria-labelledby="permissions-tab">
            <strong style="font-size:1.1rem;">
                <ion-icon name="alert-circle" style="vertical-align:middle;"></ion-icon>
                Notice that you must input user id in this page instead of username.
            </strong>
            <div class="mb-4">
                <div class="row">
                    <div class="col-lg-9 input-group mt-3">
                        <span class="input-group-text">Change</span>
                        <input type="text" class="form-control" placeholder="User id" v-model="user1">
                        <span class="input-group-text" style="border-right:0px">to</span>
                        <input type="radio" class="btn-check" id="btnradio1" autocomplete="off" v-if="$user.user_group == 0" :checked="permission1 == 1">
                        <label class="btn btn-outline-secondary" for="btnradio1" style="border-right:0px" v-if="$user.user_group == 0" @click.prevent="selectPermission(1)">Administrator</label>
                        <input type="radio" class="btn-check" id="btnradio2" autocomplete="off" :checked="permission1 == 2">
                        <label class="btn btn-outline-secondary" for="btnradio2" style="border-right:0px" @click.prevent="selectPermission(2)">Normal User</label>
                        <input type="radio" class="btn-check" id="btnradio3" autocomplete="off" :checked="permission1 == 3">
                        <label class="btn btn-outline-secondary" for="btnradio3" @click.prevent="selectPermission(3)">Banned User</label>
                    </div>
                    <button class="btn btn-primary col-lg-2 mt-3" @click="submit1('user', 'patch', { user_id: user1, user_group: permission1 }, 0)">Submit</button>
                </div>
                <div class="text-success small mt-1" v-if="success[0]">
                    Successfully modified.
                </div>
                <div class="text-danger small mt-1" v-if="fail[0]">
                    Invalid request.
                </div>
            </div>
            <hr>
            <div class="mb-4">
                <strong>
                    <ion-icon name="alert-circle" style="font-size:1rem;vertical-align:middle;"></ion-icon>
                    You cannot modify the default permission group 1 except its name. You can view all permission groups at
                    <a href="#permissions" style="text-decoration: none;">this page</a>.
                </strong>
                <div class="row">
                    <div class="input-group col-lg-9 mt-2">
                        <span class="input-group-text">Add permission group</span>
                        <input type="text" class="form-control" placeholder="Permission name" v-model="permission_name1" maxlength="60">
                    </div>
                    <button class="btn btn-primary col-lg-2 mt-2" @click="submit1('permissions', 'post', { permission_name: permission_name1 }, 1)">Submit</button>
                </div>
                <div class="row">
                    <div class="input-group col-lg-9 mt-3">
                        <span class="input-group-text">Delete permission group</span>
                        <input type="text" class="form-control" placeholder="Permission id" v-model="permission_id1">
                    </div>
                    <button class="btn btn-primary col-lg-2 mt-3" @click="submit1('permissions', 'delete', { permission_id: permission_id1 }, 1)">Submit</button>
                </div>
                <div class="row">
                    <div class="input-group col-lg-9 mt-3">
                        <span class="input-group-text">Change name of</span>
                        <input type="text" class="form-control" placeholder="Permission id" v-model="permission_id2">
                        <span class="input-group-text">to</span>
                        <input type="text" class="form-control" placeholder="Permission name" v-model="permission_name2" maxlength="60">
                    </div>
                    <button class="btn btn-primary col-lg-2 mt-3" @click="submit1('permissions', 'patch', { permission_id: permission_id2, permission_name: permission_name2 }, 1)">Submit</button>
                </div>
                <div class="text-success small mt-1" v-if="success[1]">
                    Successfully modified.
                </div>
                <div class="text-danger small mt-1" v-if="fail[1]">
                    Data is unchanged or arguments are invalid.
                </div>
            </div>
            <hr>
            <div class="mb-4">
                <div class="row mb-2">
                    <div class="col-lg-9 input-group mt-2">
                        <span class="input-group-text">Add users to permission group</span>
                        <input type="text" class="form-control" placeholder="Permission id" v-model="permission_id3">
                    </div>
                    <button class="btn btn-primary col-lg-2 mt-2" @click="submit5">Submit</button>
                </div>
                <strong>
                    <ion-icon name="alert-circle" style="font-size:1rem;vertical-align:middle;"></ion-icon>
                    You should type user ids below and split them with any blank characters. (i.e. Enter, Space etc.)
                </strong>
                <div class="input-group mt-1">
                    <textarea class="form-control" placeholder="Users" id="textArea" v-model="user2" style></textarea>
                </div>
                <div class="text-success small mt-1" v-if="success3 != ''">
                    {{success3}}
                </div>
                <div class="text-danger small mt-1" v-if="fail3 != ''">
                    {{fail3}}
                </div>
            </div>
            <hr>
            <div class="mb-4">
                <div class="row mb-2">
                    <div class="col-lg-9 input-group mt-2">
                        <span class="input-group-text">Delete</span>
                        <input type="text" class="form-control" placeholder="User id" v-model="user3">
                        <span class="input-group-text">from permission group</span>
                        <input type="text" class="form-control" placeholder="Permission id" v-model="permission_id4">
                    </div>
                    <button class="btn btn-primary col-lg-2 mt-2" @click="submit1('user_permissions', 'delete', { permission_id: permission_id4, user_id: user3 }, 2)">Submit</button>
                </div>
                <div class="text-success small mt-1" v-if="success[2]">
                    Successfully modified.
                </div>
                <div class="text-danger small mt-1" v-if="fail[2]">
                    Data is unchanged or arguments are invalid.
                </div>
            </div>
        </div>
        <div class="tab-pane fade" id="submissions" role="tabpanel" aria-labelledby="submissions-tab">Not decided....</div>
        <div class="tab-pane fade" id="thumbs" role="tabpanel" aria-labelledby="thumbs-tab">Working now!!!</div>
    </div>
</div></div>
</template>

<script>
import { callAPI } from '@/utils'
import { getCurrentInstance, onBeforeMount } from 'vue'

export default {
    setup() {
        onBeforeMount(() => {
            var tmp = getCurrentInstance().appContext.config.globalProperties
            if (tmp.$user.user_group > 1) {
                tmp.$router.replace("/403Forbidden")
            }
        })
    },
    data() {
        return { user1: "", user2: "", user3: "", permission1: 0, permission_name1: "", permission_name2: "",
            permission_id1: "", permission_id2: "", permission_id3: "", permission_id4: "",
            success: [false, false, false], fail: [false, false, false], success3: "", fail3: "" }
    },
    methods: {
        selectPermission(val) {
            if (this.permission1 == val) {
                this.permission1 = 0
            } else {
                this.permission1 = val
            }
        },
        submit1(name, method, data, status_id) {
            this.success[status_id] = this.fail[status_id] = false
            callAPI(name, method, data,
                (res) => {
                    this.success[status_id] = true
                    setTimeout(() => { this.success[status_id] = false }, 1000)
                }, (res) => {
                    this.fail[status_id] = true
                })
        },
        submit5() {
            this.success3 = this.fail3 = ""
            callAPI('user_permissions', 'post', { permission_id: this.permission_id3, user_ids: this.user2.replace(/[\s]+/g, ',') },
                (res) => {
                    this.success3 = `Successfully added, ${res.data.affected} users affected.`
                    setTimeout(() => { this.success3 = "" }, 1000)
                }, (res) => {
                    this.fail3 = res.data._error
                    if (this.fail3 == "invalid ids exist") {
                        this.fail3 += ": " + res.data.invalid_ids
                    }
                })
        },
    },
    watch: {
        user2() {
            var textarea = document.getElementById("textArea")
            textarea.style.height = '20px'
            textarea.style.height = (textarea.scrollHeight + 20) + 'px'
        }
    }
}
</script>

<style>
.col-lg-9 {
    width: 75%!important;
}
.form-control {
    min-width: 100px;
}
</style>