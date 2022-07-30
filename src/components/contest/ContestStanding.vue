<template>
<div>
    <table class="table table-hover text-center" style="vertical-align:middle">
        <thead>
            <tr>
                <td style="width:5%"><strong>Rank</strong></td>
                <td><strong>User</strong></td>
                <td v-for="(pro, index) in problems" :key="pro.problem_id">
                    <a :href="'#/problem/' + pro.problem_id + '?contest_id=' + id">{{ String.fromCharCode(65 + index) }}</a>
                </td>
                <td><strong>Score</strong></td>
            </tr>
        </thead>
        <tbody>
            <tr v-for="(entry, rank) in standing" :key="entry.user_id">
                <td>{{ rank + 1 }}</td>
                <td><UserName :id="entry.UserId" :name="entry.UserName" :rating="entry.OrgRating"></UserName></td>
                <td v-for="(score, index) in entry.Scores" :key="index">
                    <template  v-if="entry.SubIds[index]">
                        <a :href="'#/submission/' + entry.SubIds[index]"><Score :score="score"></Score></a>
                        <br>
                        <span class="small" style="color:gray">{{ getPenalty(entry.Penalties[index]) }}</span>
                    </template>
                    <div v-else>/</div>
                </td>
                <td>
                    <span><Score :score="entry.TotalScore" :fullscore="100 * entry.Scores.length"></Score></span>
                    <br>
                    <span class="small" style="color:gray">{{ getPenalty(entry.TotalPenalty) }}</span>
                </td>
            </tr>
        </tbody>
    </table>
</div>
</template>

<script>
import { callAPI, formatSeconds } from '@/utils'
import UserName from '@/models/UserName.vue'
import Score from '@/models/Score.vue'

export default {
    data() {
        return {
            id: this.$route.params.id,
            problems: [],
            standing: [],
        }
    },
    created() {
        callAPI('contest_standing', 'get', {contest_id: this.id}, (res) => {
            this.problems = res.data.problems
            this.standing = res.data.standing
            if (this.standing != null) {
                for (var entry of this.standing) {
                    entry.TotalScore = 0
                    entry.TotalPenalty = 0
                    for (var i in entry.SubIds) {
                        if (entry.SubIds[i] == 0) continue
                        entry.TotalScore += entry.Scores[i]
                        entry.TotalPenalty += entry.Penalties[i]
                    }
                }
                this.standing.sort((a, b) => a.TotalScore == b.TotalScore ? a.Penalties - b.Penalties : b.TotalScore - a.TotalScore)
            }
            console.log(res.data)
        }, (res) => {
            alert(res.data._error)
        })
    },
    methods: {
        getPenalty(penalty) {
            return formatSeconds(Math.floor(penalty / 1e9))
        }
    },
    components: {
        UserName,
        Score,
    },
}
</script>

<style>
</style>