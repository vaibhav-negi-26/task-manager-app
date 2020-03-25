const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcome = (email, name) => {
    sgMail.send({
        to: email,
        from: 'maskisblack17@gmail.com',
        subject: `Hello ${name}`,
        text: `Welcome ${name} to the app. Let me know how you get along with the app.`
    })
}

const sendRemove = (email, name) => {
    sgMail.send({
        to: email,
        from: 'maskisblack17@gmail.com',
        subject: `GoodBye ${name}`,
        text: `Sorry ${name} for not providing service to your expectations.Let us know what was our short fall.`
    })
}

module.exports = {
    sendWelcome,
    sendRemove
}