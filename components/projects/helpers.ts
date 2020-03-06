function getUserRepoName(url: string) {
    const userRepo = url.slice(19);
    return userRepo.split('/');
}

function dataExtract(data: any) {
    const result = {
        num: data.repository.object.history.totalCount,
        date: data.repository.object.history.nodes[0].authoredDate
    }
    return result;
}
 function formatDate(commitDate: string) {
    const date = new Date(commitDate);
    return `
            ${date.getHours()>9 ? date.getHours() : '0'+date.getHours() }:${date.getMinutes()>9 ? date.getMinutes() : '0'+date.getMinutes()}
            ${date.getDate()}.${date.getMonth()+1}.${date.getFullYear()}
        `
 }

function projectStanding(date: string, classes: any) {
    const commitDate = new Date(date).getTime();
    const currentDate = new Date().getTime();
    const elapsedTime = currentDate - commitDate;
    if(elapsedTime<6.048e+8)
        return classes.good;
    else if(elapsedTime> 6.048e+8 && elapsedTime <1.814e+9)
        return classes.warning;
    else
        return classes.bad;
}

export {
    getUserRepoName,
    dataExtract,
    formatDate,
    projectStanding
}