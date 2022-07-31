<template>
    <nav
        id="sidebarMenu"
        class="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse"
        style="min-width: 180px;"
    ><div class="sidebar-sticky px-3">
        <div class="row"><ul class="nav flex-column">
            <ni-i18n icon="file-tray-full-outline" t="sidebar.problems" href="/problems" />
            <ni-i18n icon="hourglass-outline" t="sidebar.submissions" href="/submissions" />
            <ni-i18n icon="bar-chart-outline" t="sidebar.contests" href="/contests" />
            <ni-i18n icon="create-outline" t="sidebar.blogs" href="/blogs" />
            <div class="row">
                <div class="col">
                    <ni-i18n
                        icon="refresh-outline"
                        t="sidebar.refresh"
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
        </ul></div>
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
                    <ni-i18n
                        icon="newspaper-outline"
                        t="sidebar.profile"
                        :href="'/user/' + $user.user_id"
                    />
                    <ni-i18n
                        icon="pulse-outline"
                        t="sidebar.custom_test"
                        href="/customtest"
                    />
                    <ni-i18n
                        icon="build-outline"
                        t="sidebar.system_manage"
                        href="/manage"
                        v-if="isAdmin()"
                    />
                    <ni-i18n
                        icon="keypad-outline"
                        t="sidebar.permissions"
                        href="/permissions"
                        v-if="isAdmin()"
                    />
                    <ni-i18n
                        icon="exit-outline"
                        t="sidebar.logout"
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
                    <ni-i18n
                        icon="enter-outline"
                        t="sidebar.login"
                        href="/login"
                    />
                    <ni-i18n
                        icon="person-add-outline"
                        t="sidebar.signup"
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
        <div class="locale-changer mt-3">
            <select v-model="$i18n.locale" class="form-select" @change="onChangeLocale($event)">
                <option v-for="locale in $i18n.availableLocales" :key="`locale-${locale}`" :value="locale">{{ 
                    $i18n.getLocaleMessage(locale).name
                }}</option>
            </select>
        </div>
    </div></nav>
</template>

<script>
export default {
    props: ["servertime", "reload", "refreshed"],
    inject: ["isAdmin"],
    components: {
        NiI18n: { // nav item i18n
            props: ["icon", "t", "href"],
            template: `<li class="nav-item">
                <router-link class="nav-link" :to="href">
                <ion-icon :name="icon" class="feather" />
                <span v-t="t"></span>
                </router-link>
            </li>`,
        },
    },
    methods: {
        onChangeLocale() {
            this.$props.reload()
        },
    },
};
</script>

<style>
</style>