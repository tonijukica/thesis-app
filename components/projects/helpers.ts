function getUserRepoName(url: string) {
  const userRepo = url.slice(19);
  return userRepo.split('/');
}

function dataExtract(data: any) {
  const result = {
    num: data.repository.object.history.totalCount,
    date: data.repository.object.history.nodes[0].authoredDate,
  };
  return result;
}

function formatDate(commitDate: string) {
  const date = new Date(commitDate);
  return `
    ${date.getHours() > 9 ? date.getHours() : '0' + date.getHours()}:${
    date.getMinutes() > 9 ? date.getMinutes() : '0' + date.getMinutes()
  }
    ${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}
    `;
}

function projectStanding(date: string, classes: any) {
  const commitDate = new Date(date).getTime();
  const currentDate = new Date().getTime();
  const elapsedTime = currentDate - commitDate;
  if (elapsedTime < 6.048e8) return classes.good;
  else if (elapsedTime > 6.048e8 && elapsedTime < 1.814e9)
    return classes.warning;
  else return classes.bad;
}

function userCommits(commits: any) {
  const userCommits: any = [];
  commits.forEach((commit: any) => {
    const user = commit.author.user
      ? commit.author.user.login
      : commit.author.name;
    const userIndex = userCommits.findIndex((x: any) => x.user === user);
    if (userCommits[userIndex] == null) {
      userCommits.push({ user, count: 1 });
    } else userCommits[userIndex].count += 1;
  });
  return userCommits;
}

function userCommitsGraph(commits: any) {
  const graphCommits: any = [];
  commits.forEach((commit: any) => {
    const user = commit.author.user
      ? commit.author.user.login
      : commit.author.name;
    const userIndex = graphCommits.findIndex((x: any) => x.label === user);
    if (graphCommits[userIndex] == null) {
      graphCommits.push({
        label: user,
        commits: [commit],
      });
    } else graphCommits[userIndex].commits.push(commit);
  });
  const labels: any = {};
  graphCommits.forEach((el: any) => {
    labels[el.label] = 0;
  });
  const history: any = [];
  commits.forEach((commit: any) => {
    const date = new Date(commit.committedDate);
    const indx = date.getDate() + '-' + (date.getMonth() + 1);
    const commitUser = commit.author.user
      ? commit.author.user.login
      : commit.author.name;
    const index = history.findIndex((x: any) => x.date === indx);
    if (history[index] == null) {
      history.push({
        date: indx,
        Total: 1,
        ...labels,
      });
      const newIndex = history.findIndex((x: any) => x.date === indx);

      history[newIndex][commitUser] = +1;
    } else {
      history[index]['Total'] += 1;
      history[index][commitUser] += 1;
    }
  });
  history.sort((a: any, b: any) => {
    const key1 = new Date(a.date);
    const key2 = new Date(b.date);
    if (key1 < key2) return -1;
    else if (key1 === key2) return 0;
    else return 1;
  });
  return { graphCommits, history };
}

export {
  getUserRepoName,
  dataExtract,
  formatDate,
  projectStanding,
  userCommits,
  userCommitsGraph,
};
