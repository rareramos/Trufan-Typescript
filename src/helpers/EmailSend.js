/// 

//    For all things related to sending emails across the site

///
import config from '../config';
const trufan_subject_line = 'Trufan Beta | ';

const sg = require('sendgrid')(config.sendgrid.api_key);

function getBlankEmailRequest(toEmail){
    return {
            method: 'POST',
            path: '/v3/mail/send',
            body: {
                personalizations: [
                {
                    to: [
                    {
                        email: toEmail
                    }
                    ],
                    cc: [
                        {
                            email: 'aanikh@trufan.io'
                        },
                        {
                            email: 'swish@trufan.io'
                        },
                        {
                            email: 'tim@trufan.io'
                        }
                    ],
                    bcc: [
                        {
                            email: 'colin@cengtech.com'
                        }
                    ]
                }
                ],
                from: {
                    email: 'please-reply@trufan.io',
                    name: 'Trufan Analytics'
                },
                
            }
        };
}

function SendEmail(request){
    return sg.API(request)
        .then(function (response) {
            console.log(response.statusCode);
            console.log(response.body);
            console.log(response.headers);
        })
        .catch(function (error) {
            // error is an instance of SendGridError
            // The full response is attached to error.response
            console.log(error.response.body.errors);
        });
}

export function SendUserFeedbackEmail(username, feedback) {
    var baseRequest = getBlankEmailRequest("scott@trufan.io");

    if(username) baseRequest.body.personalizations[0].subject = `${trufan_subject_line}${username} has feedback.`;
    else baseRequest.body.personalizations[0].subject = `${trufan_subject_line}New feedback`;

    baseRequest.body.content = [{ type: 'text/html', value:
    `Feedback has been given. Here's what they had to say.
    <br/>
    What is your primary objective for using Trufan? ${feedback.primary_objective}<br/>
    How helpful was the platform in helping you achieve this goal? ${feedback.q1}<br/>
    Please name any other apps that you’d use to solve this problem. ${feedback.other_apps}<br/>
    How easy did you feel the platform was to use and navigate? ${feedback.q2}<br/>
    On a scale of 1-10, how likely are to you recommend this platform to an industry peer? ${feedback.q3}<br/>
    What is one thing you would change or add to the platform? ${feedback.one_thing}<br/>
    `}];

    var request = sg.emptyRequest(baseRequest);

    return SendEmail(request);
}

export function SendNewUserSignupEmail(username) {

    if(!config.operations.send_signup_email)
        return Promise.resolve();

    var baseRequest = getBlankEmailRequest("scott@trufan.io");

    baseRequest.body.personalizations[0].subject = `${trufan_subject_line}${username} has just signed up.`;
    baseRequest.body.content = [{ type: 'text/html', value: `${username} has just signed up. We thought you'd like to know.`}];

    var request = sg.emptyRequest(baseRequest);

    return SendEmail(request);
}