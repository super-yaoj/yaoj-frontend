<template>
<div class="mt-4 container" style="">
    <div class="h3 mb-4">Blog Editing</div>
    <div class="mb-4">
        <div class="row px-3">
            <input class="form-control col me-3" style="font-size:1rem;min-width:150px" placeholder="Title" maxlength="80" @input="unsave = true" v-model="title">
            <button :class="'btn col-2 btn-' + (unsave ? 'danger' : 'success')" style="font-size:1rem;pointer-events:none;min-width:100px;">{{unsave ? 'Unsaved' : 'Saved'}}</button>
        </div>
        <div class="text-danger small" v-if="title_blank">
            Title cannot be blank.
        </div>
    </div>
    <v-md-editor v-model="text" height="600px" @save="save" @change="unsave = true"></v-md-editor>
    <div class="row mt-4">
        <div class="col"></div>
        <button class="btn btn-primary col-lg-3 col-5 ms-3" style="font-size:1rem" @click="submit">Submit</button>
        <div class="col" style="text-align:right">
            <input type="checkbox" class="btn-check" id="btncheck1" autocomplete="off" v-model="secret">
            <label class="btn btn-outline-secondary" for="btncheck1">Private</label>
        </div>
    </div>
</div>
</template>

<script>
import VMdEditor from '@/models/VMdEditor.js'
import { callAPI } from '@/utils'
export default {
    created() {
        if (this.$user.user_id < 0) {
            this.$router.replace("/403Forbidden")
            return
        }
    },
    data() {
        window.onbeforeunload = () => {
            return this.unsave ? 1 : null
		}
        var local = this.$route.query.local
        var id = localStorage.getItem(local + "_blog_id")
        var title = localStorage.getItem(local + "_title")
        var text = localStorage.getItem(local + "_content")
        return {
            id: id,
            title: title == null ? "" : title,
            title_blank: false,
            text: text == null ? "" : text,
            local: this.$route.query.local,
            unsave: false,
            secret: false
        };
    },
    components: {
        VMdEditor
    },
    methods: {
        save() {
            localStorage.setItem(this.local + "_title", this.title)
            localStorage.setItem(this.local + "_content", this.text)
            this.unsave = false
        },
        submit() {
            this.save()
            if (this.title.trim() == "") {
                this.title_blank = true
                return
            }
            this.title_blank = false
            callAPI('blog', this.id == null ? 'post' : 'put',
                { blog_id: this.id, title: this.title, content: this.text, private: this.secret ? '1' : '0' },
            (res) => {
                localStorage.removeItem(this.local + "_blog_id")
                localStorage.removeItem(this.local + "_title")
                localStorage.removeItem(this.local + "_content")
                this.$router.replace("/blog/" + (this.id == null ? res.data.id : this.id))
            }, (res) => {
                alert(res.data._error)
            })
        }
    },
    unmounted() {
        if (this.unsave) this.save()
    }
}
</script>

<style>
.v-md-editor {
    border: 1px solid #DDD;
    box-shadow: none;
}
</style>