export type User = {
  id: number
  name: string
}
export type Commit = {
  user: string,
  commitMsg: string,
  date: string,
}

export type Student = {
  id?: number
  name: string,
  github_username: string
}

export type Project = {
  id: number,
  name: string,
  github_url: string,
  students: Student[]
}