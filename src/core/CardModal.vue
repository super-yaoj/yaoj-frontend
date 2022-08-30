<script lang="ts" setup>
/**
 * - provide #header, #body, #footer slots
 * - provide @clickdialog @close event
 * - provide "close" method in slot context
 * - auto close when click shadow
 */
import { useSlots, useAttrs } from "vue";
import BaseModal from "./BaseModal.vue";

const props = defineProps({
  display: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits({
  clickdialog: (event: MouseEvent) => true,
  close: null,
})

const { header, body, footer } = useSlots()
const newattrs = { ...useAttrs() }

const originOnclick: any = newattrs.onClick;
newattrs.onClick = (event: MouseEvent) => {
  if (originOnclick instanceof Function) {
    originOnclick(event);
  }
  // click on shadow
  if (event.currentTarget === event.target) {
    emit('close', null);
  }
}

const close = () => emit('close', null)
</script>

<template>
  <BaseModal :display="props.display" v-bind="newattrs">
    <div class="modal-dialog" :onClick="event => emit('clickdialog', event)">
      <div class="modal-content">
        <div v-if="header" class="modal-header">
          <slot name="header" :close="close"></slot>
        </div>
        <div v-if="body" class="modal-body">
          <slot name="body" :close="close"></slot>
        </div>
        <div v-if="footer" class="modal-footer">
          <slot name="footer" :close="close"></slot>
        </div>
      </div>
    </div>
  </BaseModal>
</template>