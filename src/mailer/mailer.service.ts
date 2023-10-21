import { Injectable } from "@nestjs/common";
import axios from "axios";
import * as FormData from "form-data";
import Mailgun from "mailgun.js";
import { MailgunConfig } from "src/config/mailgun.config";
import * as fs from "fs";
import * as path from 'path';

interface Attachments {
    urls?: string[];
    filenames?: string[];
}
@Injectable()
export class MailerService {
    constructor(private readonly config: MailgunConfig) {}

    async downloadFile(url: string) {
        return await axios.get(url, {
            responseType: 'stream',
        });
    }

    async readFile(filename: string) {
        return await fs.promises.readFile(path.resolve(filename));
    }

    private async attachmentStreams(attachments: Attachments) {
        const urlStreams = await Promise.all(attachments.urls.map(url => this.downloadFile(url)));
        const fileStreams = await Promise.all(attachments.filenames.map(async (filename)=> {return {filename:'wniosek.docx', data: await this.readFile(filename)}}));
        return [...urlStreams, ...fileStreams];
    }

    async sendMail(to: string, from: string, attachments: Attachments): Promise<void> {
        
        
        const mailgun = new Mailgun(FormData);
        const mg = mailgun.client({
            username: 'api',
            key: this.config.getApiKey(),
        });
        const attachmentStreams = this.attachmentStreams(attachments);
        const emailContent = `
            Szanowni Państwo,<br>

            Chciałbym zgłosić oficjalny wniosek o reklamację dotyczący produktu/usługi zakupionego u Państwa. Proszę o kontakt pod tym mailem <a href="mailto:${from}">${from}</a>
            <br>
            Proszę o rozpatrzenie załączonego wniosku o reklamację, w którym znajduje się szczegółowy opis problemu lub wady produktu/usługi, której reklamuję.
            <br>
            W załączeniu znajdują się również dokumenty wspierające moją reklamację, w tym (jeśli dotyczy):
            <ul>
            <li>Zdjęcia wadliwego produktu/usługi.</li>
            <li>Kopie paragonu/faktury/zamówienia.</li>
            <li>Inne dokumenty potwierdzające zakup lub dostawę produktu/usługi.</li>
            </ul>

            Proszę o jak najszybsze rozpatrzenie mojej reklamacji i poinformowanie mnie o wyniku postępowania. Chciałbym uzyskać zwrot kosztów lub wymianę wadliwego produktu/usługi.

            Ta wiadomość została wysłana automatycznie przez aplikację mobilną Mobywatel. Dziękuję za uwględnienie mego wniosku o reklamację. Liczę na szybką i pozytywną odpowiedź.
            `;

        mg.messages
            .create('sandbox88d52702cd954bdfb1198e33fad32b63.mailgun.org', {
                from: "Mailgun Sandbox <postmaster@sandbox88d52702cd954bdfb1198e33fad32b63.mailgun.org>",
                to: to,
                subject: "Wniosek o Reklamację",
                html: emailContent,
                attachment: await attachmentStreams
            })
            .then(msg => console.log(msg)) // logs response data
            .catch(err => console.log(err)); // logs any error`;
           
      } 
}