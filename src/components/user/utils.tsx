import { DataHead, Option } from "@/core/DataTable";
import UserName from '@/models/UserName.vue'
import { callAPI } from '@/utils'

export interface UserListKey { rating: number, user_id: number }

// 渲染对象：
export const UserListTable: DataHead<{
    user_id: number; 
    user_name: string; 
    rating: number;
    [key: string | symbol]: any; // other props
}>[] = [
    { name: 'user_id', title: <strong>#ID</strong>, columnClass: "text-center ul-col-id" },
    {
        name: 'user_name', title: <strong>Username</strong>, renderer: (user_name, o) => {
            // @ts-ignore
            return <UserName id={o.user_id} name={user_name} rating={o.rating} />
        }
    },
    { name: 'motto', title: <strong>Motto</strong>, columnClass: "text-center" },
    { name: 'rating', title: <strong>Rating</strong>, columnClass: "ul-col-rating text-center" },
]

// 按照 rating 从大到小的顺序获取用户列表
export const UserListData: Option<UserListKey> = {
    head: UserListTable,
    paging: {
        beginKey: { rating: 9999, user_id: 0 },
        endKey: { rating: -9999, user_id: 0 },
        next: key => ({ rating: key.rating, user_id: key.user_id + 1 }),
        prev: key => ({ rating: key.rating, user_id: key.user_id - 1 }),
        sizes: [10, 20, 50, 100],
        defaultsize: 10,
    },
    async fetch({ queryKey, queryType, pagesize }) {
        var q: any = { pagesize }
        if (queryType == 'left') {
            q.left = queryKey.rating;
            q.left_user_id = queryKey.user_id;
        } else {
            q.right = queryKey.rating;
            q.right_user_id = queryKey.user_id;
        }
        try {
            var res: any = await new Promise(function (res, rej) {
                callAPI('users', 'get', q, res, rej)
            })
            return [res.data.data, res.data.isfull];
        } catch (e) {
            alert(e.data._error)
        }
    },
}

export const Top10Paging = {
    beginKey: { rating: 9999, user_id: 0 },
    endKey: { rating: -9999, user_id: 0 },
    next: key => key,
    prev: key => key,
    sizes: [10],
    defaultsize: 10,
    display: false,
};