import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { firstValueFrom } from "rxjs";
import { OpenAIConfig } from "src/config/openai.config";

@Injectable()
export class SummarizerService {
    constructor(private readonly config: OpenAIConfig, private readonly httpService: HttpService) {}

    async summarize(reasons: string[]): Promise<string> {
        const apiKey = this.config.getApiKey();

        const messages = [{role: 'system', content: 'Twoim zadaniem jest w podanych tekstów znaleźć od 3 do 5 (nie więcej) najważniejszych powodów dla których produkt został zareklamowany, pisz w sposób formalny, nie pisz nic więcej oprócz podsumowania, jeśli nie znajdziesz 3 powodów to może być mniej, jeśli nic nie znajdziesz to napisz nie znaleziono powodów. Wypisz same powody bez skrótów całego i żadnych innych informacji. Dodaj do każdego powodu ilość wystąpień, suma nie może przekraczać ilości informacji które zostały podane. Zwróć to w formie poprawnego pliku json, w formie {reason: string, count: number}'}]

        let userMessage = ''
        for (const reason of reasons) {
            userMessage += reason + '\n'
        }
        messages.push({role: 'user', content: userMessage})

        const resp = await firstValueFrom(this.httpService.post(this.config.getApiUrl(), {
            temperature: +this.config.getTemperature(),
            model: this.config.getModel(),
            messages
        }, {
            headers: {
                Authorization: `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            }
        }));

        return JSON.parse(resp.data.choices[0].message.content).slice(0, 5);
    }
}