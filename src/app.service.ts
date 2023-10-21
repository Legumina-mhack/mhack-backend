import { Injectable } from '@nestjs/common';
import * as cheerio from 'cheerio';
@Injectable()
export class AppService {
  async getHello() {
    const prodName = 'wózek'
    const baseUrl = 'http://publikacje.uokik.gov.pl/hermes3_pub/'
    const searchUrl = `${baseUrl}Rejestr.ashx?Typ=ProduktNiebezpieczny&DataWpisuOd=&DataWpisuDo=&NumerIdentyfikacyjny=&NazwaProduktu=${prodName}&KodWyrobu=&Sort=&x=0&y=0`
    const html = await fetch(searchUrl).then(res => res.text())

    const $ = cheerio.load(html);
    const secondTds = $('table#rejestrTable tr td:nth-child(2) h2 a').map(async function() {
      const productUrl = baseUrl+$(this).attr('href')
      const html = await fetch(productUrl).then(res => res.text())
      const $1 = cheerio.load(html);

      const decisionDate = $1("#wpis > tbody > tr:nth-child(1) > td")
      const ean = $1("#wpis > tbody > tr:nth-child(10) > td")
      const decisionDescription = $1("#wpis > tbody > tr:nth-child(11) > td")
      const model = $1("#wpis > tbody > tr:nth-child(9) > td")
      
      return {
        name: $(this).text().trim(),
        href: productUrl,
        decisionDate: decisionDate.text(),
        ean: ean.text(),
        decisionDescription: decisionDescription.text(),
        model: model.text()
      }
    }).get();
    return await Promise.all(secondTds)
  }
}
