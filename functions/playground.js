const sendgrid = require('@sendgrid/mail');
sendgrid.setApiKey('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');
sendgrid.setSubstitutionWrappers('{{', '}}');

const emailAddress = 'dtsuzaki@uw.edu';
const accessCode = 'ASDF1234';

const email = {
    to: emailAddress,
    from: 'no-reply@waopportunityscholarship.org',
    templateId: 'd-9ce853e96b044b9ca010bb424cbc1617',
    dynamicTemplateData: {
        access_code: accessCode,
    },
};

sendgrid.send(email)
    .then(() => console.log('Access code ' + accessCode + ' successfully sent to ' + emailAddress))
    .catch(error => console.error(error.toString()));