interface JoinedUser {
    id: string,
    nickname: string
}

interface IDatabase {
    JoinedUsers: Array<JoinedUser>
}

export let inMemoryDatabase : IDatabase = {
    JoinedUsers: []
}