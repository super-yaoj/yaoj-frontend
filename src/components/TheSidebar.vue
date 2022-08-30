<template>
  <input type="checkbox" id="sidebar-toggler-checkbox" style="display: none" />
  <nav id="sidebar-menu" class="col-md-3 col-lg-2 d-block bg-light sidebar" style="min-width: 180px;">
    <div class="sidebar-sticky">
      <ul class="nav flex-column">
        <sidebar-item icon="file-tray-full-outline" t="sidebar.problems" href="/problems" />
        <sidebar-item icon="hourglass-outline" t="sidebar.submissions" href="/submissions" />
        <sidebar-item icon="bar-chart-outline" t="sidebar.contests" href="/contests" />
        <sidebar-item icon="create-outline" t="sidebar.blogs" href="/blogs" />
        <li class="d-flex justify-content-between">
          <sidebar-item class="w-100" icon="refresh-outline" t="sidebar.refresh" @click.prevent="$props.reload"
            :href="$route.fullPath" />
          <div v-if="$props.refreshed" style="height: 100%; padding-top: 10px" class="pe-3">
            <ion-icon name="checkmark-circle-outline" style="font-size: 1.1rem; color: green" />
          </div>
        </li>
      </ul>
      <hr class="mx-2" />
      <div v-if="$store.user.user_id > 0">
        <div>
          <span class="col align-items-center px-3 text-muted" style="text-transform: uppercase; color: #444">{{
             $store.user.user_name 
            }}</span>
        </div>
        <div id="userForm" class="mt-2">
          <ul class="nav flex-column">
            <sidebar-item icon="newspaper-outline" t="sidebar.profile" :href="'/user/' + $store.user.user_id" />
            <sidebar-item icon="pulse-outline" t="sidebar.custom_test" href="/customtest" />
            <sidebar-item icon="build-outline" t="sidebar.system_manage" href="/manage" v-if="isAdmin()" />
            <sidebar-item icon="keypad-outline" t="sidebar.permissions" href="/permissions" v-if="isAdmin()" />
            <sidebar-item icon="exit-outline" t="sidebar.logout" href="/logout" />
          </ul>
        </div>
      </div>
      <div v-else>
        <div>
          <h6 class="
                    d-flex justify-content-between
                    align-items-center px-3 mt-2 mb-1 text-muted
                " style="text-transform: uppercase">
            <span style="color: #444">please login</span>
          </h6>
        </div>
        <ul class="nav flex-column mt-2">
          <sidebar-item icon="enter-outline" t="sidebar.login" href="/login" />
          <sidebar-item icon="person-add-outline" t="sidebar.signup" href="/signup" />
        </ul>
      </div>
      <hr class="mx-2" />
      <div class="px-3">
        <div class="row" style="text-align: center">
          <div class="px-3 col small" style="color: gray">
            Yao Online Judge
            <br />
            Server time: {{  $props.servertime  }}
          </div>
        </div>
        <div class="locale-changer mt-3">
          <select v-model="$i18n.locale" class="form-select" @change="onChangeLocale($event)">
            <option v-for="locale in $i18n.availableLocales" :key="`locale-${locale}`" :value="locale">{{
               $i18n.getLocaleMessage(locale).name 
              }}</option>
          </select>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { inject } from 'vue';
import SidebarItem from './SidebarItem.vue';


const props = defineProps({
  servertime: null,
  reload: Function,
  refreshed: Boolean,
})

const isAdmin = inject('isAdmin')

function onChangeLocale() {
  props.reload()
}
</script>

<style>
#sidebar-menu ul>li:hover {
  background-color: rgba(0, 0, 0, 0.040);
}

/* `md` applies to small devices (landscape phones, less than 768px) */
@media (max-width: 767.98px) {
  #sidebar-toggler-checkbox:not(:checked)~#sidebar-menu {
    transform: translateX(-100%);
  }

  #sidebar-toggler-checkbox:checked~#sidebar-menu {
    box-shadow: 0 .5rem 1rem rgba(0, 0, 0, .15) !important;
  }

  #sidebar-menu {
    transition: all .2s ease;
    width: 250px;
  }
}
</style>