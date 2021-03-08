const faker = require('faker')


module.exports = { 
    name: "auth",
  
    actions: {
        createUser: {
            params:{
                uid: 'string',
                password: 'string'
            },
            async handler(ctx){
                const params = ctx.params
                if(getUser(params.uid)){
                    return errorResult('User already created!')
                }
                addUser(params.uid, params.password)
                return validResult('User created')
            }
        },

        login:{
            params:{
                username: 'string',
                password: 'string'
            },
            async handler(ctx) {
                let uid = (await ctx.call('user.translateUsername', {username: ctx.params.username})).uid
                console.log(uid);
                if(uid){
                    if(validateCredentials(uid, ctx.params.password) ){
                        return validResult(createTokenForUser(uid))
                    }
                }
                return errorResult('Wrong username or password')
            }
            
        },

        validateToken: {
            params:{
                token: 'string'
            },
            handler(ctx){
                return auth.tokens[ctx.params.token] ? validResult('Valid token.') : errorResult('Invalid token!')
            }
        },


        getUserID:{
            params:{
                token: 'string'
            },
            async handler(ctx){
                let user = getUserIDByToken(ctx.params.token)
                if(!user){
                    return errorMessage('Token not found')
                }
                return validResult(user)
            }
        },

        logout: {
            params:{
                token: 'string'
            },
            handler(ctx){
                const token = ctx.params.token
                if(getUserIDByToken(token)){
                    deleteToken(token)
                    return validResult('Token deleted')
                }
                return errorResult('Token not found!')
            }
        },
        getUserIDByToken
    }
}
  

const auth = {
    tokens: {
        token: 'uid'
    },
    users: {
        uid: {
            password: "pwhsh"
        }
    }
}

function getUser(uid) {
    return auth.users[uid]
}

function addUser(uid, password) {
    auth.users[uid] = {
        password
    }
}

function validateCredentials(uid, password) {
    const user = auth.users[uid]
    return user?.password === password
}

function getUserIDByToken(ctx){
    const token = ctx.params.token;
    return auth.tokens[token]
}

function createTokenForUser(uid){
    let token = faker.random.uuid()
    auth.tokens[token] = uid 
    return token
}

function deleteToken(token) {
    delete auth.tokens[token]
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