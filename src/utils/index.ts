import mail from "@sendgrid/mail";

// Send error email
export async function sendErrorEmail(scrapper: string) {
  const template = {
    to: process.env.OWNER_EMAIL as string,
    from: process.env.SENDER_EMAIL as string,
    subject: `${scrapper} Scrapper Failed`,
    html: `
            <p>Hi, this email confirms that something went wrong with the ${scrapper} scrapper and it has failed to scrap the data. The scrapper will try again in next 3 days.</p>
            `,
  };

  try {
    await mail.send(template);
  } catch (err) {
    // Log error
    console.log(err);
  }
}
