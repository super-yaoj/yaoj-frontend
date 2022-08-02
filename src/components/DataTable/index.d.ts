import { VNode } from "vue";

export interface Option {
    head: Array<{
        name: string;
        title: string | VNode;
        columnClass?: string;
        renderer?: (o: any) => string | VNode;
    }>
    pageKey: any;
    fetch: (ctxt: any) => Promise<[data: any[], isfull: bool]>
}

declare function defineTableDataDriver(options: Option): any;