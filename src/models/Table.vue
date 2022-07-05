<script>
import { h, defineComponent } from 'vue'

const PageItem = defineComponent({
    props: ['icon', 'f', 'disable'],
    template: `
        <button class="btn page-link" @click="f" :disabled="disable">
            <ion-icon :name="icon">
            </ion-icon>
        </button>
    `,
})

const PageSize = defineComponent({
    props: ['f', 'sizes', 'defaultsize'],
    template: `
    <select class="form-select" @change="f($event.srcElement.value)">
        <option v-for="size in sizes" :value="size" :selected="defaultsize == size">{{size}} per page</option>
    </select>
    `,
})

export default {
    props: ['row', 'sizes', 'tableclass', 'get', 'next', 'pagination', 'nocache'],
    data() {
        if (!this.nocache && this.$temp_store[this.$route.path + "_table"] == undefined)
            this.$temp_store[this.$route.path + "_table"] = {}
        
        if (!this.pagination) return { data: [], temp: this.$temp_store[this.$route.path + "_table"] }
        return {
            isfull: false,
            data: [],
            temp: this.nocache ? {} : this.$temp_store[this.$route.path + "_table"],
            right: undefined,
            left: this.next(null, -1),
            BEGIN: this.next(null, -1),
            END: this.next(null, 1),
            pagesize: this.sizes[0]
        }
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
        var table = h('table', {class: tableclass}, [
            h('thead', {style: "border-top: 1px solid #CCC"}, h('tr', this.row(null))),
            h('tbody', children)])
        if (!this.pagination) return table
        
        var isbegin = this.jsonEqual(this.left, this.BEGIN) || (!this.isfull && this.left == undefined)
        var isend = this.jsonEqual(this.right, this.END) || (!this.isfull && this.right == undefined)
        var pagination = h('div', {class: 'row'}, [h('div', {class: "col-md-3"}),
            h('div', {class: 'col-md-6 text-center'}, h('div', {class: "btn-group", style: "max-width:200px"}, [
                h(PageItem, {f: this.changePage('begin'), icon: 'play-skip-back-outline', disable: isbegin}),
                h(PageItem, {f: this.changePage('last'), icon: 'chevron-back', disable: isbegin}),
                h(PageItem, {f: this.changePage('reload'), icon: 'reload-outline'}),
                h(PageItem, {f: this.changePage('next'), icon: 'chevron-forward', disable: isend}),
                h(PageItem, {f: this.changePage('end'), icon: 'play-skip-forward-outline', disable: isend}),
            ])),
            h('div', {class: "col-md-3"}, h(PageSize, {f: this.changeSize, sizes: this.sizes, defaultsize: this.pagesize }))])
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
.page-link {
    color: #444;
    font-size: 1.2rem;
    padding-top: 10px;
    padding-left: 15px;
    padding-right: 15px;
}
button:disabled.page-link {
    color: #999;
}
td {
    font-size: 0.85rem;
    padding: 10px 10px 10px 10px!important;
}
</style>