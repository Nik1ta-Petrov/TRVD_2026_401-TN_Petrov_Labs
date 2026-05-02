import { NextResponse } from "next/server";
import * as cheerio from "cheerio";

export async function GET() {
    try {
        const urls = [
            "https://www.poe.pl.ua/customs/newgpv-info.php",
            "https://www.poe.pl.ua/customs/unloading-info.php",
        ];

        let combinedText = "";
        let rawHtmlSnippet = "";

        for (const url of urls) {
            const response = await fetch(url, {
                cache: "no-store",
                headers: {
                    "User-Agent":
                        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                    Referer:
                        "https://www.poe.pl.ua/disconnection/power-outages/",
                    "X-Requested-With": "XMLHttpRequest",
                },
            });
            const html = await response.text();
            rawHtmlSnippet += html.substring(0, 100);

            const $ = cheerio.load(html);
            combinedText += " " + $("body").text();
        }

        const cleanText = combinedText
            .replace(/\s+/g, " ")
            .toLowerCase()
            .trim();

        // Логіка визначення статусу
        // Якщо в тексті є "не прогнозується" — світло є.
        // Якщо текст порожній (вночі таке буває) — теж вважаємо, що світло є.
        const isSafe =
            cleanText.includes("не прогнозується") ||
            cleanText.includes("не застосовуються") ||
            cleanText === "";

        return NextResponse.json({
            isSafe: isSafe,
            statusText: isSafe
                ? "Світло є! Графіки не застосовуються"
                : "Увага! Можливі обмеження графіків",
            lastUpdate: new Date().toLocaleTimeString("uk-UA"),
            debug: {
                foundText: cleanText.substring(0, 150),
                rawResponse: rawHtmlSnippet,
            },
        });
    } catch (error) {
        return NextResponse.json({
            isSafe: true,
            statusText: "Енергосистема працює в штатному режимі",
        });
    }
}
