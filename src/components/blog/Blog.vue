<template>
<div class="container mt-4">
    <div class="row align-items-end mb-3">
        <div class="col">
            <h3><strong>{{blog.title}}</strong></h3>
        </div>
        <div class="col-3 btn-group" style="text-align: right;" v-if="isAdmin() || $user.user_id == blog.author">
            <button class="btn btn-primary" @click="edit">Edit</button>
            <button class="btn btn-danger" @click="remove">Delete</button>
        </div>
    </div>
    <div class="card">
        <div class="card-body px-0 pb-0">
            <v-md-preview :text="blog.content"></v-md-preview>
        </div>
        <div class="card-footer">
            <div class="row">
                <div class="small ms-3 col" style="color:gray">
                    by <a :href="'#/user/' + blog.author">{{blog.author_name}}</a> at {{blog.create_time}}
                </div>
                <ClickLike class="col px-0" icon="chatbox-outline" style="max-width: 50px" :number="blog.comments"></ClickLike>
                <ClickLike class="col px-0 me-2" icon="thumbs-up-outline" style="max-width: 50px" :number="blog.like" :active="blog.liked" :target="{name:'blog',id:id}"></ClickLike>
            </div>
        </div>
    </div>
    <h4 class="mt-4" v-if="comments != null">Comments</h4>
    <div class="card mt-3" v-for="comment in comments" :key="comment.comment_id">
        <div class="card-body px-0 pb-0" style="margin-bottom: -20px">
            <v-md-preview :text="comment.content"></v-md-preview>
        </div>
        <div class="card-footer">
            <div class="row">
                <div class="small ms-3 col" style="color:gray">
                    by <a :href="'#/user/' + comment.author">{{comment.author_name}}</a> at {{comment.create_time.replace(/[A-Z]/g, ' ')}}
                </div>
                <a href="#" class="col px-0" style="max-width: 60px;" @click.prevent="deleteComment(comment.comment_id)" v-if="isAdmin() || comment.author == $user.user_id">delete</a>
                <ClickLike class="col px-0 me-2" icon="thumbs-up-outline" style="max-width: 50px" :number="comment.like" :active="comment.liked" :target="{name:'comment',id:comment.comment_id}"></ClickLike>
            </div>
        </div>
    </div>
    <h4 class="mt-4 mb-3">Write Your Comment</h4>
    <v-md-editor height="300px" left-toolbar="undo redo clear" v-model="new_comment"></v-md-editor>
    <div class="text-center mt-3">
        <button class="btn btn-primary" style="min-width: 100px" @click="newComment">Submit</button>
    </div>
</div>
</template>

<script>
import { callAPI, randomString } from '@/utils'
import VMdPreview from '@/models/VMdPreview'
import ClickLike from '@/models/ClickLike.vue'
import VMdEditor from '@/models/VMdEditor'
import { format } from 'silly-datetime'


export default {
    inject: ['isAdmin'],
    data() {
        return {
            id: this.$route.params.id,
            blog: { author: "", title: "", content: "", create_time: "", comments: 0, like: 0, liked: false },
            new_comment: "",
            comments: null
        }
    },
    created() {
        callAPI('blog', 'get', { blog_id: this.id }, (res) => {
            this.blog = res.data
            this.blog.create_time = format(new Date(this.blog.create_time))
        }, (res) => {
            this.$router.replace('/404NotFound')
        })
        this.getComments()
    },
    components: {
        VMdPreview,
        ClickLike,
        VMdEditor
    },
    methods: {
        edit() {
            var local = randomString(16)
            localStorage.setItem(local + "_blog_id", this.id)
            localStorage.setItem(local + "_title", this.blog.title)
            localStorage.setItem(local + "_content", this.blog.content)
            this.$router.push("/editblog?local=" + local)
        },
        remove() {
            if (confirm("Do you really want to delete?")) {
                callAPI('blog', 'delete', { blog_id: this.id }, (res) => {
                    this.$router.replace("/blogs")
                }, (res) => {
                    alert(res.data._error)
                })
            }
        },
        getComments() {
            callAPI('blog_comments', 'get', { blog_id: this.id }, (res) => {
                this.comments = res.data.data
            }, (res) => {
                alert(res.data._error)
            })
        },
        newComment() {
            callAPI('blog_comments', 'post', { blog_id: this.id, content: this.new_comment }, (res) => {
                var height = document.body.scrollHeight;
                window.scroll({ top: height , left: 0 })
                this.new_comment = ""
                this.getComments()
            }, (res) => {
                alert(res.data._error)
            })
        },
        deleteComment(id) {
            if (confirm("Do you really want to delete?")) {
                callAPI('blog_comments', 'delete', { comment_id: id }, (res) => {
                    this.getComments()
                }, (res) => {
                    alert(res.data._error)
                })
            }
        }
    }
}
</script>

<style>
</style>