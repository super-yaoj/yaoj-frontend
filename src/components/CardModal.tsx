import { defineComponent } from "vue";
import BaseModal from "./BaseModal";

// provide #header, #body, #footer slots
// provide @clickdialog event
// provide "close" method in slot context
export default defineComponent({
    props: {
        display: {
            type: Boolean,
            default: false,
        },
    },
    emits: {
        clickdialog: (event: MouseEvent) => true,
        close: null,
    },
    setup(props, ctx) {
        const { header, body, footer } = ctx.slots

        const attrs = { ...ctx.attrs }
        const originOnclick: any = attrs.onClick;
        attrs.onClick = (event: MouseEvent) => {
            if (originOnclick instanceof Function) {
                originOnclick(event);
            }
            // click on shadow
            if (event.currentTarget === event.target) {
                ctx.emit("close", null);
            }
        }

        const slotContext = {
            close: () => ctx.emit("close", null)
        }

        return () => <BaseModal display={props.display} {...attrs}>
            <div class="modal-dialog" onClick={event => ctx.emit("clickdialog", event)}>
                <div class="modal-content">
                    {header instanceof Function && <div class="modal-header">{header(slotContext)}</div>}
                    {body instanceof Function && <div class="modal-body">{body(slotContext)}</div>}
                    {footer instanceof Function && <div class="modal-footer">{footer(slotContext)}</div>}
                </div>
            </div>
        </BaseModal>
    },
})