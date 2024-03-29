import { defineComponent, PropType, reactive, VNode } from "vue";
import BaseTable from "./BaseTable";
import { deepEqual } from '@/utils'
import VIcon from './VIcon.vue'

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
    display: boolean = true

    constructor({ beginKey, endKey, next, prev, sizes, defaultsize, ...restProps }: Paging<Key>) {
        this.queryKey = beginKey
        this.beginKey = beginKey
        this.endKey = endKey
        this.next = next
        this.prev = prev
        this.sizes = sizes
        this.size = defaultsize
        if (restProps.display === false) this.display = false
    }
}

interface Paging<QueryKey> {
    beginKey: QueryKey;
    endKey: QueryKey;
    next: (key: QueryKey) => QueryKey;
    prev: (key: QueryKey) => QueryKey;
    sizes: number[];
    defaultsize: number;
    display?: boolean;
}
// 表格数据 meta
export interface DataHead<DataType = Record<string, any>> {
    name: string;
    title: string | VNode;
    columnClass?: string;
    class?: string;
    renderer?: (o: any, target: DataType) => string | VNode;
    display?: boolean; // 控制这一列是否显示
    [key: string | symbol]: any;
}
export interface Option<QueryKey = {}> {
    head: Array<DataHead>
    paging: Paging<QueryKey>,
    // 提供数据获取函数，返回值为 [data: any[], isfull: bool]
    // isfull = true 表示查询的数据有下一页（left 或者 right）
    // fetch 传入一个 context，有以下三个参数可以选择使用
    fetch: (ctxt: FetchContext<QueryKey>) => Promise<[data: any[], isfull: boolean]>
}

interface FetchContext<QueryKey> {
    queryKey: QueryKey;
    queryType: string;
    pagesize: number;
}

interface DataDriver<QueryKey> {
    data: {
        tabledata: any[];
    };
    context: () => FetchContext<QueryKey>;
    goLeft: () => Promise<void>
    goRight: () => Promise<void>
    goBegin: () => Promise<void>
    goEnd: () => Promise<void>
    queryKeyOf: (o: any) => any;
    head: Array<DataHead>
    fetchWithCtxt: (context: FetchContext<QueryKey>) => Promise<[data: any[], isfull: boolean]>
    fetch: () => Promise<void>;
    pagination: Pagination<QueryKey>;
}

// 返回一个数据驱动（driver）以按照给定的查询方式获取数据，展示在表格中
// driver 暴露的 fetch 方法可以用于重新获取数据，常见于手动刷新
export function defineTableDataDriver<QueryKey>({ head, fetch, paging }: Option<QueryKey>): DataDriver<QueryKey> {
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
            console.log('fetch result:', data, isfull)

            this.pagination.atBegin = false
            this.pagination.atEnd = false

            if (this.pagination.queryType === 'left') {
                if (deepEqual(this.pagination.queryKey, this.pagination.beginKey)) {
                    this.pagination.atBegin = true
                }
                if (!isfull) { // 到结尾了就调头
                    this.pagination.atEnd = true
                    this.pagination.queryKey = this.pagination.endKey
                    this.pagination.queryType = 'right'
                }
            } else {
                if (deepEqual(this.pagination.queryKey, this.pagination.endKey)) {
                    this.pagination.atEnd = true
                }
                if (!isfull) { // 到结尾了就调头
                    this.pagination.atBegin = true
                    this.pagination.queryKey = this.pagination.beginKey
                    this.pagination.queryType = 'left'
                }
            }

            this.data.tabledata = data
        },
        pagination: new Pagination(paging),
    })
}

// do not display pagination. limit is for default size
export const noPaging = (limit: number = 100) => ({
    beginKey: {},
    endKey: {},
    next: o => o,
    prev: o => o,
    sizes: [limit],
    defaultsize: limit,
    display: false
})

const PageItem = ({ icon, f, disable }: { icon: string; f: (...o: any) => any; disable?: boolean }) =>
    <button class="btn page-link" onClick={f} disabled={disable}>
        { /* @ts-ignore */}
        <VIcon name={icon} />
    </button>

const PageSize = defineComponent({
    props: ['f', 'sizes', 'defaultsize'],
    template: `
    <select class="form-select" @change="f($event.srcElement.value)" v-if="sizes.length>1">
        <option v-for="size in sizes" :value="size" :selected="defaultsize == size" :key="size">{{size}} per page</option>
    </select>
    `,
})

export const RenderData = (head: DataHead[], o: any): any => {
    var o2 = { ...o }
    head.forEach(hd => {
        if (hd.renderer instanceof Function) {
            o2[hd.name] = hd.renderer(o[hd.name], o)
        }
    })
    return o2
}


const DataTable = defineComponent({
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
    updated() {
        console.log("datatable updated!")
    },
    render() {
        const driver = this.driver as DataDriver<any>;
        // console.log('on datatable render', this.driver.pagination)
        const renderData = (o: any) => RenderData(driver.head, o)

        return <>
            <BaseTable class={this.tableclass} head={driver.head || []} data={(driver.data.tabledata || []).map(renderData)} />
            {driver.pagination.display && <div class="row">
                <div class="col-md-3"></div>
                <div class="col-md-6 text-center"><div class="btn-group" style="max-width: 200px">
                    <PageItem f={driver.goBegin.bind(driver)} icon="play-skip-back-outline" disable={driver.pagination.atBegin} />
                    <PageItem f={driver.goLeft.bind(driver)} icon="chevron-back" disable={driver.pagination.atBegin} />
                    <PageItem f={driver.fetch.bind(driver)} icon="reload-outline" />
                    <PageItem f={driver.goRight.bind(driver)} icon="chevron-forward" disable={driver.pagination.atEnd} />
                    <PageItem f={driver.goEnd.bind(driver)} icon="play-skip-forward-outline" disable={driver.pagination.atEnd} />
                </div></div>
                <div class="col-md-3">
                    {driver.pagination.sizes.length > 1 && <PageSize f={(val) => {
                        driver.pagination.size = parseInt(val)
                        console.log('change size to', val)
                        driver.fetch()
                    }} sizes={driver.pagination.sizes} defaultsize={driver.pagination.size} />}
                </div>
            </div>}
        </>
    }
})

export default DataTable