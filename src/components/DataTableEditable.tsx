import { defineComponent, onUpdated, PropType, ref } from "vue";
import DataTable, { Option } from "./DataTable";

const AddIcon = ({ onClick }) =>
    <ion-icon
        onClick={onClick} name="add-outline"
        class="cursor-hover"
        style="font-size: 1.2rem; vertical-align: text-bottom; color: gray; --ionicon-stroke-width: 40px;"
    />

const SubIcon = ({ onClick }) =>
    <ion-icon
        onClick={onClick} name="remove-outline"
        class="cursor-hover"
        style="font-size: 1.2rem; vertical-align: text-bottom; color: gray; --ionicon-stroke-width: 40px;"
    />

// inject an add button in table header row and a delete button in data row each.
// emits "create" and "delete" events, which provide "next" trigger for refetching
const DataTableEditable = defineComponent({
    props: {
        dataprovider: {
            type: Object as PropType<Option<any>>,
            required: true
        },
        tableclass: String,
    },
    emits: {
        create: (payload: {data: null; next: () => void}) => true,
        delete: (payload: {data: any; next: () => void}) => true,
    },

    setup(props, ctx) {
        const datatable = ref(null)
        const provider = { ...props.dataprovider }

        // inject controler
        provider.head = [
            ...provider.head,
            {
                name: "ctrl",
                title: <AddIcon onClick={() => {
                    ctx.emit("create", {
                        data: null,
                        next() {
                            // after create refetch data
                            datatable.value.driver.fetch()
                        }
                    })
                }} />,
                renderer: (_, target) => <SubIcon onClick={() => {
                    ctx.emit("delete", {
                        data: target,
                        next() {
                            datatable.value.driver.fetch()
                        }
                    })
                }} />,
                columnClass: "text-end",
            }
        ]
        onUpdated(() => {
            console.log('updated datatableedit!')
        })


        ctx.expose({
            // expost fetch trigger
            fetch() {
                return datatable.value.driver.fetch();
            }
        })

        return () => <DataTable tableclass={props.tableclass} dataprovider={provider} ref={datatable} />
    },
})

export default DataTableEditable