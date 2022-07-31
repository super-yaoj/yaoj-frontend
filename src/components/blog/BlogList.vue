<template>
    <div class="mt-4 container-md">
        <div class="row mb-3 align-items-end">
            <div class="col-md-8">
                <div class="h3 mb-0" v-t="'blogs.title'" />
                <div class="small" style="color: gray" v-t="'blogs.tip'" />
            </div>
            <div
                class="col-md-4 btn-group mt-1"
                style="text-align: right"
                v-if="$user.user_id > 0"
            >
                <router-link
                    class="btn btn-sm btn-outline-primary"
                    :to="'/user/' + $user.user_id + '?tab=blogs'"
                    v-t="'blogs.my'"
                />
                <router-link class="btn btn-sm btn-primary" :to="createBlog" v-t="'blogs.new'" />
            </div>
        </div>
        <Table
            :row="getLine"
            :sizes="[10, 20, 50, 100]"
            :get="update"
            :next="next"
            :pagination="true"
            :timestamp="timestamp"
        />
    </div>
</template>

<script>
import { callAPI, randomString } from "@/utils";
import Table from "@/models/Table";
import ClickLike from "@/models/ClickLike.vue";
import { format } from "silly-datetime";

export default {
    name: "BlogList",
    data() {
        return {
            createBlog: "/editblog?local=" + randomString(16),
            timestamp: 0,
        };
    },
    components: {
        Table,
        ClickLike,
    },
    methods: {
        fetchdata() {
            this.timestamp = new Date().getTime()
        },
        getLine(row) {
            if (row == null)
                return [
                    <td style="text-align: left"><strong>Title</strong></td>,
                    <td style="text-align: right"><strong>Author</strong></td>,
                    <td style="width: 15%"><strong>Create Date</strong></td>,
                    <td style="width: 10%; text-align: right"><strong>Comments</strong></td>,
                ];
            else
                return [
                    <td style="text-align: left">
                        <router-link to={'/blog/' + row.blog_id}>
                            {row.private ? <span style="color: gray">[Private] </span> : null}
                            {row.title}
                        </router-link>
                    </td>,
                    <td style="text-align: right">
                        <router-link to={'/user/' + row.author}>{row.author_name}</router-link>
                    </td>,
                    <td>{format(row.create_time, "YYYY-MM-DD")}</td>,
                    <td>
                        <div class="d-flex justify-content-between">
                        <ClickLike icon="chatbox-outline" number={row.comments}/>
                        <ClickLike 
                            icon="thumbs-up-outline" number={row.like} 
                            target={{name: "blog", id: row.blog_id}}
                            active={row.liked}
                        />
                        </div>
                    </td>
                ];
        },
        async update(query) {
            try {
                var res = await new Promise((res, rej) =>
                    callAPI("blogs", "get", query, res, rej)
                );
                return res.data;
            } catch (e) {
                console.log(e);
            }
        },
        next(a, b) {
            if (a == null) {
                if (b > 0) return 0;
                return 1 << 30;
            }
            return a.blog_id - b;
        },
    },
};
</script>

<style>
</style>