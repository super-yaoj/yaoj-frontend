
// head: Array, // Array<{ name: string; title: string|VNode; }>
// data: Array, // Array<Record<string, string|VNode> >

import { FunctionalComponent, VNode } from "vue";

/**
 * data row must have field "id".
 */
const BaseTable: FunctionalComponent<{
    head: {
        name: string;
        title: string | VNode;
        columnClass?: string;
        class?: string;
    }[];
    data: Record<string, any>[];
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
