// You can include shared interfaces/types in a separate file
// and then use them in any component by importing them. For
// example, to import the interface below do:
//
// import User from 'path/to/interfaces';

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
  githubUrl: string,
  students: Student[]
}