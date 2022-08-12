import { defineComponent, Teleport } from "vue";

const BaseModal = defineComponent({
    props: {
        display: {
            type: Boolean,
            default: false,
        },
    },
    setup(props, ctx) {
        return () => props.display && <Teleport to="body">
            <div class="modal" {...ctx.attrs} style="display: block;">
                {ctx.slots.default()}
            </div>
        </Teleport>
    },
});

export default BaseModal;