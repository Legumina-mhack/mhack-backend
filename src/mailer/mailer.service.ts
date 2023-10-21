import { Injectable } from "@nestjs/common";
import * as FormData from "form-data";
import Mailgun from "mailgun.js";
import { MailgunConfig } from "src/config/mailgun.config";


@Injectable()
export class MailerService {
    constructor(private readonly config: MailgunConfig) {}

    async sendMail(to: string, from: string, attachments: string[]): Promise<void> {
        const mailgun = new Mailgun(FormData);
        const mg = mailgun.client({
            username: 'api',
            key: this.config.getApiKey(),
        });
        console.log(this.config.getApiKey())
        mg.messages
            .create('sandbox88d52702cd954bdfb1198e33fad32b63.mailgun.org', {
                from: "Mailgun Sandbox <postmaster@sandbox88d52702cd954bdfb1198e33fad32b63.mailgun.org>",
                to: ["filip.kostecki00@gmail.com"],
                subject: "Hello",
                text: "Testing some Mailgun awesomness!",
                html: "<h1>Testing some Mailgun awesomness!</h1>",
            })
            .then(msg => console.log(msg)) // logs response data
            .catch(err => console.log(err)); // logs any error`;
           
      } 
}