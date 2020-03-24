const sgMail = require('@sendgrid/mail')
const sendgrindAPIKey = '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'

sgMail.setApiKey(sendgrindAPIKey)

const sendWelcome = (email, name) => {
    sgMail.send({
        to: email,
        from: 'gauravnegi232628@gmail.com',
        subject: 'testing Sg mail service',
        text: `Welcome ${name} to the app. Let me know how you get along with the app.`
    })
}

const sendRemove = (email, name) => {
    sgMail.send({
        to: email,
        from: 'gauravnegi232628@gmail.com',
        subject: 'testing Sg mail service',
        text: `Sorry ${name} for not providing service to your expectations.Let us know what was our short fall.`
    })
}

module.exports = {
    sendWelcome,
    sendRemove
}