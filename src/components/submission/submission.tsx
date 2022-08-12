import { Language } from "@/config"
import { format } from "silly-datetime"
import Score from '@/models/Score.vue'
import UserName from '@/models/UserName.vue'
import { echoSize } from "@/utils"
import { DataHead } from "../DataTable"
import { RouterLink } from "vue-router"

export function cutContent(str, len) {
    return str.length < len ? str : str.substr(0, len) + '...'
}

function SubmStatus(status) {
    if (status < 0) return 'Internal Error'
    if ((status & 1) == 0) return 'Waiting'
    if (status < 15) return 'Judging'
    if (status == 15) return 'Finished'
    return 'Invalid Status'
}

export const subm_table: DataHead[] = [{
    name: 'submission_id',
    title: <strong>#ID</strong>,
    renderer: (id) => <RouterLink to={`/submission/${id}`}>{id}</RouterLink>,
}, {
    name: 'problem_id',
    title: <strong>Problem</strong>,
    renderer: (id, row) => <>
        <RouterLink to={`/problem/${id}` + (row.contest_id > 0 ? "?contest_id=" + row.contest_id : "")}>
            #{id}. {row.problem_name}
        </RouterLink>
        {row.contest_id > 0 &&
            <RouterLink class="badge bg-secondary ms-1" to={"/contest/" + row.contest_id}>Contest</RouterLink>}
    </>
}, {
    name: 'rating',
    title: <strong>Submitter</strong>,
    // @ts-ignore
    renderer: (rating, row) => <UserName id={row.submitter} name={row.submitter_name} rating={rating}></UserName>
}, {
    name: 'status',
    title: <strong>Score</strong>,
    renderer: (status, row) => <RouterLink to={"/submission/" + row.submission_id}>
        {/* @ts-ignore */}
        {SubmStatus(status) == 'Finished' ? <Score score={row.score}></Score> : SubmStatus(status)}
    </RouterLink>
}, {
    name: 'time',
    title: <strong>Time</strong>,
    renderer: time => time < 0 ? '/' : time + 'ms'
}, {
    name: 'memory',
    title: <strong>Memory</strong>,
    renderer: (memory) => memory < 0 ? '/' : echoSize(memory)
}, {
    name: 'language',
    title: <strong>Language</strong>,
    renderer: (_, row) => <RouterLink to={"/submission/" + row.submission_id}>
        {row.language < 0 ? '/' : Language[row.language]}
    </RouterLink>
}, {
    name: 'length',
    title: <strong>Length</strong>,
    renderer: (length) => echoSize(length)
}, {
    name: 'submit_time',
    title: <strong>Submit Time</strong>,
    renderer: submit_time => format(submit_time)
}]
