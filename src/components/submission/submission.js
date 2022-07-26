export {
    submissionRow,
    cutContent,
}

import { Language } from "@/config"
import { format } from "silly-datetime"
import Score from '@/models/Score.vue'
import UserName from '@/models/UserName.vue'
import { echoSize } from "@/utils"

function submissionRow(row) {
    if (row == null) return [
        <td><strong>#ID</strong></td>,
        <td><strong>Problem</strong></td>,
        <td><strong>Submitter</strong></td>,
        <td><strong>Score</strong></td>,
        <td><strong>Time</strong></td>,
        <td><strong>Memory</strong></td>,
        <td><strong>Language</strong></td>,
        <td><strong>Length</strong></td>,
        <td><strong>Submit Time</strong></td>,
    ]
    else return [
        <td>
            <a href={"#/submission/" + row.submission_id}>{row.submission_id}</a>
        </td>,
        <td>
            <a href={"#/problem/" + row.problem_id + (row.contest_id > 0 ? "?contest_id=" + row.contest_id : "")}>
                #{row.problem_id}. {row.problem_name}
                {
                    row.contest_id > 0
                        ? <a class="badge bg-secondary ms-1" href={"#/contest/" + row.contest_id}>Contest</a>
                        : null
                }
            </a>
        </td>,
        <td>
            <UserName id={row.submitter} name={row.submitter_name} rating={row.rating}></UserName>
        </td>,
        <td>
            <a href={"#/submission/" + row.submission_id}>
                {SubmStatus(row.status) == 'Finished' ? <Score score={row.score}></Score> : SubmStatus(row.status)}
            </a>
        </td>,
        <td>{row.time < 0 ? '/' : row.time + 'ms'}</td>,
        <td>{row.memory < 0 ? '/' : echoSize(row.memory)}</td>,
        <td>
            <a href={"#/submission/" + row.submission_id}>
                {row.language < 0 ? '/' : Language[row.language]}
            </a>
        </td>,
        <td>{echoSize(row.length)}</td>,
        <td>{format(row.submit_time)}</td>,
    ]
}

function cutContent(str, len) {
    return str.length < len ? str : str.substr(0, len) + '...'
}

function SubmStatus(status) {
    if (status < 0) return 'Internal Error'
    if ((status & 1) == 0) return 'Waiting'
    if (status < 15) return 'Judging'
    if (status == 15) return 'Finished'
    return 'Invalid Status'
}