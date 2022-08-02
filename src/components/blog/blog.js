export {
    createDraft,
    saveDraft,
    removeDraft,
    getDraft,
}

import { randomString } from "@/utils"

function createDraft(blog) {
    var local = randomString(16)
    if (blog.blog_id != undefined)
        localStorage.setItem(local + "_blog_id", blog.blog_id)
    localStorage.setItem(local + "_title", blog.title)
    localStorage.setItem(local + "_content", blog.content)
    localStorage.setItem(local + "_private", blog.private)
    return local
}

function saveDraft(blog, local) {
    localStorage.setItem(local + "_title", blog.title)
    localStorage.setItem(local + "_content", blog.content)
    localStorage.setItem(local + "_private", blog.private)
}

function removeDraft(local) {
    console.log(local)
    localStorage.removeItem(local + "_blog_id")
    localStorage.removeItem(local + "_title")
    localStorage.removeItem(local + "_content")
    localStorage.removeItem(local + "_private")
}

function getDraft(local) {
    var id = localStorage.getItem(local + "_blog_id")
    var title = localStorage.getItem(local + "_title")
    var text = localStorage.getItem(local + "_content")
    var priv = localStorage.getItem(local + "_private")
    return {
        blog_id: id,
        title: title == null ? "" : title,
        content: text == null ? "" : text,
        private: priv == null ? false : priv == "true",
    }
}