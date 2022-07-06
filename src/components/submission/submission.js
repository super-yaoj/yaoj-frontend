export {
    submissionRow,
    cutContent,
}

import { h } from 'vue'
import { Language, SubmStatus } from "@/config"
import { format } from "silly-datetime"

function submissionRow(row) {
    return [
        h('td', h('a', { href: "#/submission/" + row.submission_id }, row.submission_id)),
        h('td', h('a', { href: "#/problem/" + row.problem_id }, '#' + row.problem_id + '. ' + row.problem_name)),
        h('td', h('a', { href: "#/user/" + row.submitter }, row.submitter_name)),
        h('td', h('a', { href: "#/submission/" + row.submission_id }, row.status == 0 ? row.score : SubmStatus[row.status])),
        h('td', row.time < 0 ? '/' : row.time + 'ms'),
        h('td', row.memory < 0 ? '/' : row.memory + 'KB'),
        h('td', h('a', { href: "#/submission/" + row.submission_id }, row.language < 0 ? '/' : Language[row.language])),
        h('td', format(row.submit_time))
    ]
}

function cutContent(str, len) {
    return str.length < len ? str : str.substr(0, len) + '...'
}