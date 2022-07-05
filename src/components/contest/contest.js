export {
    getRule,
    getStatus,
    getRegisterStatus,
}

function getRule(pretest, score_private) {
    if (pretest && score_private) return 'OI'
    if (pretest && !score_private) return 'UOJ'
    if (!pretest && score_private) return 'IOI'
    if (!pretest && !score_private) return 'ACM'
}

function getStatus(start_time, end_time, over) {
    if (over) return 'Finished'
    var date = new Date()
    if (date < start_time) return 'Not started'
    if (date <= end_time) return 'Running'
    return 'Not finished'
}

function getRegisterStatus(status) {
    switch (status) {
    case 0: return { color: "gray", val: "disabled" }
    case 1: return { color: "green", val: "register" }
    case 2: return { color: "red", val: "cancel" }
    }
}