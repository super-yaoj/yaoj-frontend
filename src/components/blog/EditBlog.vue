<template>
<div class="mt-4 container" style="">
    <div class="h3 mb-4">Blog Editing</div>
    <div class="mb-4">
        <div class="row px-3">
            <input class="form-control col me-3" style="font-size:1rem;min-width:150px" placeholder="Title" maxlength="80" @input="unsave = true" v-model="blog.title">
            <button :class="'btn col-2 btn-' + (unsave ? 'danger' : 'success')" style="font-size:1rem;pointer-events:none;min-width:100px;">{{unsave ? 'Unsaved' : 'Saved'}}</button>
        </div>
        <div class="text-danger small" v-if="title_blank">
            Title cannot be blank.
        </div>
    </div>
    <v-md-editor v-model="blog.content" height="600px" @save="save" @change="unsave = true"></v-md-editor>
    <div class="row mt-4">
        <div class="col"></div>
        <button class="btn btn-primary col-lg-3 col-5 ms-3" style="font-size:1rem" @click="submit">Submit</button>
        <div class="col" style="text-align:right">
            <input type="checkbox" class="btn-check" id="btncheck1" autocomplete="off" v-model="blog.private">
            <label class="btn btn-outline-secondary" for="btncheck1">Private</label>
        </div>
    </div>
</div>
</template>

<script>
import VMdEditor from '@/models/VMdEditor.js'
import { callAPI } from '@/utils'
import { saveDraft, removeDraft, getDraft } from './blog'
export default {
    name: 'EditBlog',
    data() {
        window.onbeforeunload = () => {
            return this.unsave ? 1 : null
		}
        return {
            blog: { blog_id: null, title: '', content: '', private: false },
            title_blank: false,
            local: '',
            unsave: false,
        }
    },
    components: {
        VMdEditor
    },
    methods: {
        fetchdata(route) {
            if (this.$store.user.user_id < 0) {
                this.$router.replace("/403Forbidden")
                return
            }
            this.local = route.query.local
            this.blog = getDraft(this.local)
            this.unsave = false
            this.title_blank = false
        },
        save() {
            saveDraft(this.blog, this.local)
            this.unsave = false
        },
        submit() {
            this.save()
            if (this.blog.title.trim() == "") {
                this.title_blank = true
                return
            }
            this.title_blank = false
            callAPI('blog', this.blog.blog_id == null ? 'post' : 'put', {
                    blog_id: this.blog.blog_id,
                    title: this.blog.title,
                    content: this.blog.content,
                    private: this.blog.private ? '1' : '0',
                }, (res) => {
                    removeDraft(this.local)
                    this.$router.replace("/blog/" + (this.blog.blog_id == null ? res.data.id : this.blog.blog_id))
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

<style scoped>
.v-md-editor {
    border: 1px solid #DDD;
    box-shadow: none;
}
</style>