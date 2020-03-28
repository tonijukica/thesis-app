export type User = {
  id: number
  name: string
}
export type Commit = {
  id: string,
  message: string,
  commitUrl: string,
  committedDate: string,
  author: {
    user: {
      login: string
    }
  }
}

export type Student = {
  id?: number
  name: string,
  github_username: string
}

export type ProductionPreview = {
  id: number,
  image: string,
}

export type Project = {
  id: number,
  name: string,
  github_url: string,
  prod_url?: string,
  students: Student[],
  production_previews?: ProductionPreview[]
}