const faker = require('faker')


const mailLists = {
}


const mails = {
}



module.exports = {
    name: "email",
    actions: {

        getMailBox: {
            params: {
                userID: 'string',
                from: 'string',
                limit: 'number'
            },
            handler(ctx) {
                return mailLists[ctx.params.userID] || { 'Error': 'No mailbox found for user: ' + ctx.params.userID }
            }
        },

        
        getMail: {
            params: {
                userID: 'string',
                uid: 'string', //uid of the mail
            },
            handler(ctx) {
                return mails[ctx.params.userID][ctx.params.uid]
            }
        },

        generateMailsForUser: {
            params: {
                userID: 'string',
                number: 'number',
            },
            handler(ctx){
                generateMailsForUser(ctx.params.userID, ctx.params.number)
                return {message: 'OK'}
            }
        }
    }
};


function generateMailsForUser(userID, number) {
    if(!mailLists[userID]){
        mailLists[userID] = []
        mails[userID] = {}
    }
    for(let i = 0; i < number; i++){
        let mail = createFakeEmailHeader()
        mailLists[userID].push(mail)
        mails[userID][mail.uid] = createFakeEmailBody(mail)
    }
}


function createFakeEmailHeader() {
    return {
            from: faker.internet.email(),
            subject: faker.lorem.sentence(),
            date: faker.date.recent(),
            read: faker.random.boolean(),
            uid: faker.random.uuid()
    }
}

function createFakeEmailBody(header) {
    return {
        from: header.from,
        subject: header.subject,
        date: header.date,
        body: faker.lorem.paragraphs()
    }
}
