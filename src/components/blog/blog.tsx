import { format } from "silly-datetime";
import { randomString } from "@/utils"
import { RouterLink } from "vue-router"
import { DataHead } from "@/core/DataTable";
import ClickLike from "@/models/ClickLike.vue";

export {
    createDraft,
    saveDraft,
    removeDraft,
    getDraft,
}

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

export const blog_table: DataHead[] = [{
  name: 'title', title: 'Title',
  renderer: (title, row) => <RouterLink to={'/blog/' + row.blog_id}>
    {row.private ? <span style="color: gray">[Private] </span> : null}
    {title}
  </RouterLink>
}, {
  name: 'author', title: 'Author',
  columnClass: 'text-end',
  renderer: (author, row) => <RouterLink to={'/user/' + author}>{row.author_name}</RouterLink>,
}, {
  name: 'create_time', title: 'Created',
  style: 'width: 15%; min-width: 100px',
  renderer: create_time => format(create_time, "YYYY-MM-DD"),
}, {
  name: 'comments', title: 'Comments',
  style: 'width: 10%',
  renderer: (_, row) => <div class="d-flex justify-content-between">
    {/* @ts-ignore */}
    <ClickLike icon="chatbox-outline" number={row.comments} />
    {/* @ts-ignore */}
    <ClickLike
      icon="thumbs-up-outline" number={row.like}
      target={{ name: "blog", id: row.blog_id }}
      active={row.liked}
    />
  </div>
}]