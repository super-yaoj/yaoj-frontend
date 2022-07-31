<script>
import { h, defineComponent } from 'vue'

const PageItem = defineComponent({
    props: ['icon', 'f', 'disable'],
    render() {
        const {f, disable, icon} = this.$props;
        return <button class="btn page-link" onClick={f} disabled={disable}>
            <ion-icon name={icon} />
        </button>
    },
})

const PageSize = defineComponent({
    props: ['f', 'sizes', 'defaultsize'],
    render() {
        const {f, sizes, defaultsize} = this.$props
        if (sizes.length > 1) {
            return <select class="form-select" onChange={() => f(this.$event.srcElement.value)}>
                {sizes.map(size => <option value={size} selected={defaultsize == size} key={size}>{size} per page</option>)}
            </select>
        } else {
            return null
        }
    },
})

export default {
    props: ['row', 'sizes', 'tableclass', 'get', 'next', 'pagination', 'nocache', 'timestamp'],
    data() {
        var key = this.$route.fullPath + "_table"
        if (!this.nocache && this.$temp_store[key] == undefined)
            this.$temp_store[key] = {}
        
        if (!this.pagination) return { data: [], temp: this.$temp_store[key] }
        return {
            isfull: false,
            data: [],
            temp: this.nocache ? {} : this.$temp_store[key],
            right: undefined,
            left: this.next(null, -1),
            BEGIN: this.next(null, -1),
            END: this.next(null, 1),
            pagesize: this.sizes[0]
        }
    },
    watch: {
        timestamp(nv, ov) {
            console.log(nv, ov)
            this.getData();
        },
    },
    created() {
        if (this.temp.left != undefined || this.temp.right != undefined) {
            this.left = this.temp.left
            this.right = this.temp.right
        }
        if (this.temp.pagesize != undefined)
            this.pagesize = this.temp.pagesize
        this.getData()
    },
    render() {
        var children = [], tableclass = this.tableclass != undefined ? this.tableclass : 'table table-hover text-center'
        if (this.data != null) {
            for (var i = 0; i < this.data.length; i++) {
                children.push(h('tr', this.row(this.data[i])))
            }
        }
        var table = <div style="max-width: 100%; overflow: auto"><table class={tableclass}>
            <thead style="border-top: 1px solid #CCC"><tr>{this.row(null)}</tr></thead>
            <tbody>{children}</tbody>
        </table></div>
        if (!this.pagination) return table
        
        var isbegin = this.jsonEqual(this.left, this.BEGIN) || (!this.isfull && this.left == undefined)
        var isend = this.jsonEqual(this.right, this.END) || (!this.isfull && this.right == undefined)

        var pagination = <div class="row">
            <div class="col-md-3"></div>
            <div class="col-md-6 text-center"><div class="btn-group" style="max-width: 200px">
                <PageItem f={this.changePage('begin')} icon="play-skip-back-outline" disable={isbegin} />
                <PageItem f={this.changePage('last')} icon="chevron-back" disable={isbegin} />
                <PageItem f={this.changePage('reload')} icon="reload-outline" />
                <PageItem f={this.changePage('next')} icon="chevron-forward" disable={isend} />
                <PageItem f={this.changePage('end')} icon="play-skip-forward-outline" disable={isend} />
            </div></div>
            <div class="col-md-3">
                <PageSize f={this.changeSize} sizes={this.sizes} defaultsize={this.pagesize} />
            </div>
        </div>
        return [table, pagination]
    },
    methods: {
        jsonEqual(a, b) {
            if (a == b) return true
            if (a == undefined || b == undefined) return false
            return JSON.stringify(a) == JSON.stringify(b)
        },
        getQuery() {
            if (!this.pagination) return {}
            var data = {pagesize: this.pagesize}
            if (this.right != undefined) data.right = this.right
            else if (this.left != undefined) data.left = this.left
            return data
        },
        changePage(arg) {
            return () => {
                this.left = this.right = undefined
                if (arg == 'begin') {
                    this.left = this.BEGIN
                } else if (arg == 'last') {
                    this.right = this.next(this.data[0], -1)
                } else if (arg == 'next') {
                    this.left = this.next(this.data.at(-1), 1)
                } else if (arg == 'end') {
                    this.right = this.END
                } else {
                    this.left = this.BEGIN
                    this.$router.push({query: {}})
                }
                this.data = []
                this.temp.left = this.left
                this.temp.right = this.right
                this.getData()
            }
        },
        changeSize(arg) {
            this.data = [],
            this.temp.pagesize = this.pagesize = arg,
            this.temp.left = this.left = this.BEGIN,
            this.temp.right = this.right = undefined,
            this.getData()
        },
        async getData() {
            var data = await this.get(this.getQuery())
            this.data = data.data, this.isfull = data.isfull
        }
    }
}
</script>

<style>
</style>