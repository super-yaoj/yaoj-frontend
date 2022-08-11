<template>
  <div class="mt-4 container-md">
    <div class="row mb-3 align-items-end">
      <div class="col-md-8">
        <div class="h3 mb-0" v-t="'blogs.title'" />
        <div class="small" style="color: gray" v-t="'blogs.tip'" />
      </div>
      <div class="col-md-4 btn-group mt-1" style="text-align: right" v-if="$store.user.user_id > 0">
        <router-link class="btn btn-sm btn-outline-primary" :to="`/user/${$store.user.user_id}?tab=blogs`"
          v-t="'blogs.my'" />
        <router-link class="btn btn-sm btn-primary" :to="createBlog" v-t="'blogs.new'" />
      </div>
    </div>
    <DataTable :dataprovider="bloglist_option" ref="bloglist" />
  </div>
</template>

<script lang="tsx">
import { RouterLink } from "vue-router";
import ClickLike from "@/models/ClickLike.vue";
import DataTable, { Option } from "../DataTable";

import { callAPI, randomString } from "@/utils";
import { format } from "silly-datetime";

const bloglist_option: Option<{ blog_id: number }> = {
  head: [{
    name: 'title', title: <strong>Title</strong>,
    renderer: (title, row) => <RouterLink to={'/blog/' + row.blog_id}>
      {row.private ? <span style="color: gray">[Private] </span> : null}
      {title}
    </RouterLink>
  }, {
    name: 'author', title: <strong>Author</strong>,
    style: 'text-align: right',
    renderer: (author, row) => <RouterLink to={'/user/' + author}>{row.author_name}</RouterLink>,
  }, {
    name: 'create_time', title: <strong>Create Date</strong>,
    style: 'width: 15%',
    renderer: create_time => format(create_time, "YYYY-MM-DD"),
  }, {
    name: 'comments', title: <strong>Comments</strong>,
    style: 'width: 10%',
    renderer: (_, row) => <div class="d-flex justify-content-between">
      <ClickLike icon="chatbox-outline" number={row.comments} />
      <ClickLike
        icon="thumbs-up-outline" number={row.like}
        target={{ name: "blog", id: row.blog_id }}
        active={row.liked}
      />
    </div>
  }],
  paging: {
    beginKey: { blog_id: 1e9 },
    endKey: { blog_id: 0 },
    next: o => ({ blog_id: o.blog_id - 1 }),
    prev: o => ({ blog_id: o.blog_id + 1 }),
    sizes: [20, 50, 100],
    defaultsize: 20,
  },
  async fetch({ pagesize, queryKey, queryType }) {
    let qry: any = { pagesize }
    if (queryType === 'left') qry.left = queryKey.blog_id
    else qry.right = queryKey.blog_id
    try {
      var res: any = await new Promise((res, rej) =>
        callAPI("blogs", "get", qry, res, rej)
      );
      return [res.data.data, res.data.isfull]
    } catch (e) {
      console.log(e);
    }
  },
};

export default {
  name: "BlogList",
  data() {
    return {
      createBlog: "/editblog?local=" + randomString(16),
      bloglist_option,
    };
  },
  components: {
    DataTable,
  },
  methods: {
    fetchdata() {
      this.$refs.bloglist?.driver.fetch()
    },
  },
};
</script>

<style>
</style>