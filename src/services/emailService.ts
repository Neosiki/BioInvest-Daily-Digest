import { NewsItem } from "../types";

export async function sendNewsletter(news: NewsItem[], toEmails: string[]) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; background-color: #ffffff; font-family: Helvetica, Arial, sans-serif; color: #333333;">
      <div style="max-width: 680px; margin: 0 auto; padding: 20px;">
        
        <!-- Header -->
        <div style="border-bottom: 4px solid #111111; padding-bottom: 16px; margin-bottom: 32px;">
          <h1 style="font-family: Georgia, 'Times New Roman', serif; font-size: 42px; font-weight: bold; margin: 0; color: #111111; letter-spacing: -1px;">
            BioInvest<span style="color: #00FF85;">.</span>
          </h1>
          <p style="margin: 8px 0 0 0; font-size: 12px; color: #666666; text-transform: uppercase; letter-spacing: 1px; font-weight: bold;">
            Daily Global Healthcare & Biotech Digest &nbsp;|&nbsp; ${new Date().toISOString().split('T')[0]}
          </p>
        </div>

        <!-- Content -->
        ${news.map((item, index) => `
          <div style="margin-bottom: 40px; padding-bottom: 30px; border-bottom: 1px solid #e5e5e5;">
            
            <!-- Category & Meta -->
            <div style="margin-bottom: 12px; font-size: 13px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px;">
              <span style="color: #d32f2f;">${item.category}</span>
              <span style="color: #cccccc;">&nbsp;&nbsp;|&nbsp;&nbsp;</span>
              <span style="color: #666666;">Impact: ${item.weight}</span>
              <span style="color: #cccccc;">&nbsp;&nbsp;|&nbsp;&nbsp;</span>
              <span style="color: #666666;">Sentiment: ${item.sentimentScore}/100</span>
            </div>

            <!-- Titles -->
            <h2 style="font-family: Georgia, 'Times New Roman', serif; font-size: 26px; font-weight: bold; margin: 0 0 8px 0; color: #111111; line-height: 1.3;">
              ${item.titleKr}
            </h2>
            <h3 style="font-family: Helvetica, Arial, sans-serif; font-size: 18px; font-weight: normal; margin: 0 0 20px 0; color: #555555; line-height: 1.4;">
              ${item.titleEn}
            </h3>

            <!-- Summaries -->
            <div style="font-size: 16px; line-height: 1.6; color: #333333; margin-bottom: 20px;">
              <p style="margin: 0 0 12px 0;"><strong>요약:</strong> ${item.summaryKr}</p>
              <p style="margin: 0; color: #555555;"><strong>Summary:</strong> ${item.summaryEn}</p>
            </div>

            <!-- Investment Points -->
            <div style="background-color: #f9f9f9; border-left: 4px solid #00FF85; padding: 16px; margin-bottom: 20px;">
              <h4 style="margin: 0 0 12px 0; font-size: 14px; text-transform: uppercase; color: #111111; letter-spacing: 0.5px;">투자 포인트 (Investment Points)</h4>
              <ul style="margin: 0; padding-left: 20px; font-size: 15px; line-height: 1.6; color: #333333;">
                ${item.investmentPointsKr.map(p => `<li style="margin-bottom: 6px;">${p}</li>`).join('')}
              </ul>
            </div>

            <!-- Expert Quote -->
            ${item.expertQuote ? `
            <div style="margin-bottom: 20px; padding: 16px; border: 1px solid #e5e5e5; border-radius: 8px; background-color: #ffffff;">
              <p style="margin: 0 0 12px 0; font-family: Georgia, serif; font-size: 16px; font-style: italic; color: #333333; line-height: 1.5;">
                "${item.expertQuote.quote}"
              </p>
              <p style="margin: 0; font-size: 13px; color: #111111;">
                <strong>— ${item.expertQuote.author}</strong>, <span style="color: #666666;">${item.expertQuote.title}</span>
              </p>
            </div>
            ` : ''}

            <!-- Source Link -->
            <div>
              <a href="${item.url}" style="display: inline-block; font-size: 14px; font-weight: bold; color: #111111; text-decoration: none; border-bottom: 1px solid #111111; padding-bottom: 2px;">
                Read Source Article &rarr;
              </a>
            </div>
          </div>
        `).join('')}

        <!-- Footer -->
        <div style="text-align: center; padding-top: 20px; font-size: 12px; color: #888888; line-height: 1.5;">
          <p style="margin: 0 0 8px 0;">&copy; ${new Date().getFullYear()} BioInvest Daily Digest. All rights reserved.</p>
          <p style="margin: 0;">Curated by AI for Healthcare & Pharma Investors.</p>
        </div>

      </div>
    </body>
    </html>
  `;

  const response = await fetch("/api/send-email", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      to: toEmails,
      subject: `BioInvest Daily Digest - ${new Date().toISOString().split('T')[0]}`,
      html
    })
  });

  if (!response.ok) {
    throw new Error("Failed to send email");
  }

  return response.json();
}
