import Vue, { defineComponent, PropType, reactive, VNode } from "vue";
import BaseTable from "./BaseTable";
import { deepEqual } from '@/utils'

class Pagination<Key> {
    size = 0;
    atBegin = true // 如果 true，就不能向左翻页
    atEnd = true // 如果 true，就不能向右翻页
    queryKey: Key
    beginKey: Key
    endKey: Key
    next: (key: Key) => Key
    prev: (key: Key) => Key
    queryType = 'left' // 'right'
    sizes = []

    constructor({ beginKey, endKey, next, prev, sizes, defaultsize }: Paging<Key>) {
        this.queryKey = beginKey
        this.beginKey = beginKey
        this.endKey = endKey
        this.next = next
        this.prev = prev
        this.sizes = sizes
        this.size = defaultsize
    }
}

interface Paging<QueryKey> {
    beginKey: QueryKey;
    endKey: QueryKey;
    next: (key: QueryKey) => QueryKey;
    prev: (key: QueryKey) => QueryKey;
    sizes: number[];
    defaultsize: number;
}
interface DataHead {
    name: string;
    title: string | VNode;
    columnClass?: string;
    class?: string;
    renderer?: (o: any, target: any) => string | VNode;
}
interface Option<QueryKey> {
    head: Array<DataHead>
    paging: Paging<QueryKey>,
    fetch: (ctxt: any) => Promise<[data: any[], isfull: boolean]>
}

interface FetchContext<QueryKey> {
    queryKey: QueryKey;
    queryType: string;
    pagesize: number;
}

interface DataDriver<QueryKey> {
    data: any;
    context: () => FetchContext<QueryKey>;
    goLeft: () => Promise<void>
    goRight: () => Promise<void>
    goBegin: () => Promise<void>
    goEnd: () => Promise<void>
    queryKeyOf: (o: any) => any;
    head: Array<DataHead>
    fetchWithCtxt: (context: FetchContext<QueryKey>) => Promise<[data: any[], isfull: boolean]>
    fetch: () => Promise<void>;
    pagination?: Pagination<QueryKey>;
}

function defineTableDataDriver<QueryKey>({ head, fetch, paging }: Option<QueryKey>): DataDriver<QueryKey> {
    return ({
        data: reactive({ tabledata: [] }),
        // context for fetching data
        context() {
            return {
                queryKey: this.pagination.queryKey,
                queryType: this.pagination.queryType,
                pagesize: this.pagination.size,
            }
        },
        // pagination
        async goLeft() {
            if (this.pagination.atBegin) return
            this.pagination.queryKey = this.pagination.prev(this.queryKeyOf(this.data.tabledata.at(0)))
            this.pagination.queryType = 'right'
            this.fetch()
        },
        async goRight() {
            console.log(this)
            if (this.pagination.atEnd) return
            this.pagination.queryKey = this.pagination.next(this.queryKeyOf(this.data.tabledata.at(-1)))
            this.pagination.queryType = 'left'
            this.fetch()
        },
        async goBegin() {
            this.pagination.queryKey = this.pagination.beginKey
            this.pagination.queryType = 'left'
            this.fetch()
        },
        async goEnd() {
            this.pagination.queryKey = this.pagination.endKey
            this.pagination.queryType = 'right'
            this.fetch()
        },
        queryKeyOf(data) { // 返回这个数据对应的查询条件
            return data
        },
        head,
        fetchWithCtxt: fetch,
        async fetch() {
            const [data, isfull] = await this.fetchWithCtxt(this.context())
            // console.log('fetch result:', data, isfull)

            this.pagination.atBegin = false
            this.pagination.atEnd = false

            if (this.pagination.queryType === 'left') {
                if (deepEqual(this.pagination.queryKey, this.pagination.beginKey)) {
                    this.pagination.atBegin = true
                }
                if (!isfull) {
                    this.pagination.atEnd = true
                }
            } else {
                if (deepEqual(this.pagination.queryKey, this.pagination.endKey)) {
                    this.pagination.atEnd = true
                }
                if (!isfull) {
                    this.pagination.atBegin = true
                }
            }

            this.data.tabledata = data
        },
        pagination: paging ? new Pagination(paging) : undefined,
    })
}


const PageItem = ({ icon, f, disable }: { icon: string; f: (...o: any) => any; disable?: boolean }) =>
    <button class="btn page-link" onClick={f} disabled={disable}>
        <ion-icon name={icon} />
    </button>

const PageSize = defineComponent({
    props: ['f', 'sizes', 'defaultsize'],
    template: `
    <select class="form-select" @change="f($event.srcElement.value)" v-if="sizes.length>1">
        <option v-for="size in sizes" :value="size" :selected="defaultsize == size" :key="size">{{size}} per page</option>
    </select>
    `,
})

const DataTable: Vue.DefineComponent = defineComponent({
    props: {
        dataprovider: Object as PropType<Option<any>>,
        tableclass: {
            type: String as PropType<string>,
            default: "table"
        },
    },
    data() {
        return {
            driver: defineTableDataDriver(this.dataprovider as any as Option<any>) as DataDriver<any>
        }
    },
    created() {
        this.driver.fetch()
    },
    render() {
        // console.log('on datatable render', this.driver.pagination)
        const renderData = o => {
            var o2 = { ...o }
            this.driver.head.forEach(hd => {
                if (hd.renderer instanceof Function) {
                    o2[hd.name] = hd.renderer(o2[hd.name], o2)
                }
            })
            return o2
        }
        return <>
            <BaseTable class={this.tableclass} head={this.driver.head} data={this.driver.data.tabledata.map(renderData)} />
            <div class="row">
                <div class="col-md-3"></div>
                <div class="col-md-6 text-center"><div class="btn-group" style="max-width: 200px">
                    <PageItem f={this.driver.goBegin.bind(this.driver)} icon="play-skip-back-outline" disable={this.driver.pagination.atBegin} />
                    <PageItem f={this.driver.goLeft.bind(this.driver)} icon="chevron-back" disable={this.driver.pagination.atBegin} />
                    <PageItem f={this.driver.fetch.bind(this.driver)} icon="reload-outline" />
                    <PageItem f={this.driver.goRight.bind(this.driver)} icon="chevron-forward" disable={this.driver.pagination.atEnd} />
                    <PageItem f={this.driver.goEnd.bind(this.driver)} icon="play-skip-forward-outline" disable={this.driver.pagination.atEnd} />
                </div></div>
                <div class="col-md-3">
                    <PageSize f={(val) => {
                        this.driver.pagination.size = val
                        // console.log('change size to', val)
                        this.driver.fetch()
                    }} sizes={this.driver.pagination.sizes} defaultsize={this.driver.pagination.size} />
                </div>
            </div>
        </>
    }
})

export default DataTable