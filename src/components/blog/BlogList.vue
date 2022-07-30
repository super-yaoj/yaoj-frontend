<template>
    <div class="mt-4 container-md">
        <div class="row mb-3 align-items-end">
            <div class="col-md-8">
                <div class="h3 mb-0">Blog List</div>
                <div class="small" style="color: gray">
                    You can view your drafts by clicking "My blogs".
                </div>
            </div>
            <div
                class="col-md-4 btn-group mt-1"
                style="text-align: right"
                v-if="$user.user_id > 0"
            >
                <router-link
                    class="btn btn-sm btn-outline-primary"
                    :to="'/user/' + $user.user_id + '?tab=blogs'"
                >
                    My blogs
                </router-link>
                <router-link class="btn btn-sm btn-primary" :to="createBlog">
                    New blog
                </router-link>
            </div>
        </div>
        <Table
            :row="getLine"
            :sizes="[10, 20, 50, 100]"
            :get="update"
            :next="next"
            :pagination="true"
        ></Table>
    </div>
</template>

<script>
import { callAPI, randomString } from "@/utils";
import { h } from "vue";
import Table from "@/models/Table";
import ClickLike from "@/models/ClickLike.vue";
import { format } from "silly-datetime";

export default {
    data() {
        return { createBlog: "/editblog?local=" + randomString(16) };
    },
    components: {
        Table,
        ClickLike,
    },
    methods: {
        getLine(row) {
            if (row == null)
                return [
                    h(
                        "td",
                        { style: "text-align: left" },
                        h("strong", "Title")
                    ),
                    h(
                        "td",
                        { style: "text-align: right" },
                        h("strong", "Author")
                    ),
                    h("td", { style: "width:15%" }, h("strong", "Create date")),
                    h(
                        "td",
                        { style: "width: 10%; text-align: right" },
                        h("strong", "Comments")
                    ),
                ];
            else
                return [
                    h(
                        "td",
                        { style: "text-align: left" },
                        h("a", { href: "#/blog/" + row.blog_id }, [
                            h(
                                "span",
                                { style: "color: gray" },
                                row.private ? "[Private]" : ""
                            ),
                            row.title,
                        ])
                    ),
                    h(
                        "td",
                        { style: "text-align: right" },
                        h(
                            "a",
                            { href: "#/user/" + row.author },
                            row.author_name
                        )
                    ),
                    h("td", {}, format(row.create_time, "YYYY-MM-DD")),
                    h(
                        "td",
                        h("div", { class: "row" }, [
                            h(ClickLike, {
                                class: "col px-0",
                                icon: "chatbox-outline",
                                number: row.comments,
                            }),
                            h(ClickLike, {
                                class: "col px-0",
                                icon: "thumbs-up-outline",
                                number: row.like,
                                target: { name: "blog", id: row.blog_id },
                                active: row.liked,
                            }),
                        ])
                    ),
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