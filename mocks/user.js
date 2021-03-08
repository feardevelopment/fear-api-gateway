const faker = require('faker');



module.exports = {
    name: "user",
    actions: {

        registerUser: {
            params: {
                email: 'string',
                firstName: 'string',
                lastName: 'string',
                username: 'string',
                password: 'string'
            },
            async handler(ctx) {
                const params = ctx.params
                if(getUserByUsername(params.username)){
                    return errorResult('Username already exists!')
                }
                let userID = faker.random.uuid().substr(0, 8)
                let result = await ctx.call('auth.createUser',  {uid: userID, password: params.password})
                console.log(result);
                if(result.code === 500){
                    return result
                }
                createUser(params.username, userID, {
                    email: params.email,
                    firstName: params.firstName,
                    lastName: params.lastName,
                    username: params.username,
                    password: params.password,
                })
                return validResult('User created successfully')
            }
        },

        translateUsername: {
            params:{
                username: 'string'
            },   
            handler(ctx){
                console.log(ctx.params);
                let result = getUserByUsername(ctx.params.username)
                return result ? {uid: result} : {}
            }
        },

        getUser:{
            params: {
                userID: 'string'
            },
            handler(ctx){
                return getUser(ctx.params.userID)
            },
        },


        setTraining: {
            params: {
                token: 'string',
                training: 'string',
            },
            async handler(ctx) {
                let userID = (await ctx.call('auth.getUserIDByToken', { token: ctx.params.token }))
                return setTraining(userID, ctx.params.training)
            }
        },

    }
};


const users = {
    'uid':{
        username: 'username',
        userdata:{
            firstName: 'first',
            lastName: 'last',
            email: "asda@asda.asda"
        },
    }
}

usersByID = {
    'uid': 'username'
}

usersByUsername = {
    'username': 'uid'
}


function createUser(username, userID, userObject) {
    usersByUsername[username] = userID
    usersByID[userID] = username
    users[userID] = userObject
}

function setTraining(userID, training) {
    if(users[userID]) {
        users[userID].training = training
        return validResult('Sikeres szak választás!')
    } else {
        return errorResult('Nem sikerült a szak választás!')
    }
}

function getUserByUsername(username){
    return usersByUsername[username]
}

function getUser(userID) {
    return users[usersByID[userID]]
}



function validResult(result){
    return {
        type: 'OK',
        code: 200,
        result
    }
}

function errorResult(error) {
    return {
        type: 'ERROR',
        code: 500,
        result: error
    }
}


