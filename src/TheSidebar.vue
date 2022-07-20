<template>
    <nav
        id="sidebarMenu"
        class="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse"
        style="min-width: 180px;"
    >
        <div class="sidebar-sticky px-3">
            <div class="row">
                <ul class="nav flex-column">
                    <nav-item
                        icon="file-tray-full-outline"
                        title="Problems"
                        href="/problems"
                    />
                    <nav-item
                        icon="hourglass-outline"
                        title="Submissions"
                        href="/submissions"
                    />
                    <nav-item
                        icon="bar-chart-outline"
                        title="Contests"
                        href="/contests"
                    />
                    <nav-item
                        icon="create-outline"
                        title="Blogs"
                        href="/blogs"
                    />
                    <div class="row">
                        <div class="col">
                            <nav-item
                                icon="refresh-outline"
                                title="Refresh"
                                @click.prevent="$props.reload"
                                :href="$route.fullPath"
                            />
                        </div>
                        <div
                            class="col-2"
                            style="height: 100%; padding-top: 10px"
                            v-if="$props.refreshed"
                        >
                            <ion-icon
                                name="checkmark-circle-outline"
                                style="font-size: 1.1rem; color: green"
                            />
                        </div>
                    </div>
                </ul>
            </div>
            <hr />
            <div v-if="$user.user_id > 0">
                <div class="row">
                    <span
                        class="col align-items-center px-3 text-muted"
                        style="text-transform: uppercase; color: #444"
                        >{{ $user.user_name }}</span
                    >
                </div>
                <div id="userForm" class="row mt-2">
                    <ul class="nav flex-column">
                        <nav-item
                            icon="newspaper-outline"
                            title="Profile"
                            :href="'/user/' + $user.user_id"
                        />
                        <nav-item
                            icon="pulse-outline"
                            title="Custom Test"
                            href="/customtest"
                        />
                        <nav-item
                            icon="build-outline"
                            title="System Manage"
                            href="/manage"
                            v-if="isAdmin()"
                        />
                        <nav-item
                            icon="keypad-outline"
                            title="Permission List"
                            href="/permissions"
                            v-if="isAdmin()"
                        />
                        <nav-item
                            icon="exit-outline"
                            title="Log Out"
                            href="/logout"
                        />
                    </ul>
                </div>
            </div>
            <div v-else>
                <div class="row">
                    <h6
                        class="
                            d-flex
                            justify-content-between
                            align-items-center
                            px-3
                            mt-2
                            mb-1
                            text-muted
                        "
                        style="text-transform: uppercase"
                    >
                        <span style="color: #444">please login</span>
                    </h6>
                </div>
                <div class="row mt-2">
                    <ul class="nav flex-column">
                        <nav-item
                            icon="enter-outline"
                            title="Log In"
                            href="/login"
                        />
                        <nav-item
                            icon="person-add-outline"
                            title="Sign Up"
                            href="/signup"
                        />
                    </ul>
                </div>
            </div>
            <hr />
            <div class="row" style="text-align: center">
                <div class="px-3 col small" style="color: gray">
                    Yao Online Judge
                    <br />
                    Server time: {{ $props.servertime }}
                </div>
            </div>
        </div>
    </nav>
</template>

<script>
export default {
    props: ["servertime", "reload", "refreshed"],
    inject: ["isAdmin"],
    components: {
        NavItem: {
            props: ["icon", "title", "href"],
            template: `<li class="nav-item">
                <router-link class="nav-link" :to="href">
                <ion-icon :name="icon" class="feather" />
                <span>{{ title }}</span>
                </router-link>
            </li>`,
        },
    },
    mounted() {
        console.log(this.$props.servertime);
    },
};
</script>

<style>
</style>