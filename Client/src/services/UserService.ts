import { gql } from '@apollo/client'

export const GET_USER = gql`
    query GetUser($userId: ID!) {
        user(id: $userId) {
            id
            nickname
        }
    }
`;

export const CREATE_USER = gql`
    mutation CreateUser($data: CreateUserInput!) {
        createUser(data: $data) {
            id
            nickname
        }
    }
`;

export const DELETE_USER = gql`
    mutation DeleteUser($deleteUserId: ID!) {
        deleteUser(id: $deleteUserId)
    }
`;

export const USERS_COUNT = gql`
    query GetUsersCount {
        usersCount
    }
`;

export const SUBSCRIPTION_USER_COUNT = gql`
    subscription SubscriptionUserCount {
        userCount
    }
`;