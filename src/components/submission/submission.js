export {
    submissionRow,
    cutContent,
}

import { h } from 'vue'
import { Language } from "@/config"
import { format } from "silly-datetime"
import Score from '@/models/Score.vue'
import UserName from '@/models/UserName.vue'

function submissionRow(row) {
    return [
        h('td', h('a', { href: "#/submission/" + row.submission_id }, row.submission_id)),
        h('td', h('a', { href: "#/problem/" + row.problem_id }, [
            '#' + row.problem_id + '. ' + row.problem_name,
            row.contest_id > 0 ? h('a', {class: "badge bg-secondary ms-1", href: "#/contest/" + row.contest_id}, 'Contest') : null,
        ])),
        h('td', h(UserName, {id: row.submitter, name: row.submitter_name, rating: row.rating})),
        h('td', h('a', { href: "#/submission/" + row.submission_id }, SubmStatus(row.status) == 'Finished' ? h(Score, {score: row.score}) : SubmStatus(row.status))),
        h('td', row.time < 0 ? '/' : row.time + 'ms'),
        h('td', row.memory < 0 ? '/' : row.memory + 'KB'),
        h('td', h('a', { href: "#/submission/" + row.submission_id }, row.language < 0 ? '/' : Language[row.language])),
        h('td', format(row.submit_time))
    ]
}

function cutContent(str, len) {
    return str.length < len ? str : str.substr(0, len) + '...'
}

function SubmStatus(status) {
    if (status < 0) return 'Internal Server Error'
    if ((status & 1) == 0) return 'Waiting'
    if (status < 15) return 'Judging'
    if (status == 15) return 'Finished'
    return 'Invalid Status'
}