
// head: Array, // Array<{ name: string; title: string|VNode; }>
// data: Array, // Array<Record<string, string|VNode> >

import { FunctionalComponent, VNode } from "vue";

const BaseTable: FunctionalComponent<{
    head: Array<{
        name: string; // 该列对应 data 中的字段名
        title: string | VNode;
        columnClass?: string; // 应用于整个列的单元格样式
        class?: string; // 应用于 thead 单元格的样式
    }>;
    data: Array<{
        id: string; // data row must have field "id".
        [key: string]: string | VNode;
    }>;
    class: string;
}, {}> = ({ head, data }) => {
    if (!(head instanceof Array)) {
        console.error('BaseTable: head is not array:', head)
    }
    if (!(data instanceof Array)) {
        console.error('BaseTable: data is not array:', data)
    }
    return <table>
        <thead><tr>
            {head.map(({ name, title, columnClass, ...restProps }) =>
                <td key={name} class={(columnClass || '') + ' ' + (restProps.class || '')} {...restProps}>{title}</td>)}
        </tr></thead>
        <tbody>
            {data.map(row => <tr key={row.id}>
                {head.map(o => <td key={o.name + row.id} class={o.columnClass || ''}>{row[o.name]}</td>)}
            </tr>)}
        </tbody>
    </table>
}
export default BaseTable;