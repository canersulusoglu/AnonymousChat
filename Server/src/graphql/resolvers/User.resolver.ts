import { v4 as uuidv4 } from 'uuid';

module.exports = {
    Query: {
        user: (_, { id }, { db : { JoinedUsers } }) => JoinedUsers.find(x => x.id === id),
        usersCount: (_, __, { db: { JoinedUsers } }) => JoinedUsers.length
    },
    Mutation: {
        createUser: (_, { data }, { db : { JoinedUsers }, pubsub }) => {
            var userIndex = JoinedUsers.findIndex(x => x.nickname === data.nickname)
            if(userIndex != -1){
                throw new Error("User nickname is used someone else!");
            }
            data.id = uuidv4();
            JoinedUsers.push(data);
            // Publish events
            pubsub.publish("USER_COUNT", {userCount: JoinedUsers.length})
            return data;
        },
        deleteUser: (_, { id }, { db : { JoinedUsers }, pubsub }) => {
            var userIndex = JoinedUsers.findIndex(x => x.id === id);
            if(userIndex == -1){
                return false;
            }
            JoinedUsers.splice(userIndex, 1);
            // Publish events
            pubsub.publish("USER_COUNT", {userCount: JoinedUsers.length})
            return true;
        }
    },
    Subscription: {
        userCount: {
            subscribe: (_, __, { pubsub }) => pubsub.asyncIterator("USER_COUNT") 
        }
    }
}