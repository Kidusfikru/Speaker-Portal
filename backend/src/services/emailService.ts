import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

export interface EmailParams {
  to: string;
  subject: string;
  html: string;
}

const ses = new SESClient({ region: process.env.AWS_REGION });

export async function sendEmail({ to, subject, html }: EmailParams) {
  const params = {
    Destination: { ToAddresses: [to] },
    Message: {
      Body: { Html: { Charset: 'UTF-8', Data: html } },
      Subject: { Charset: 'UTF-8', Data: subject },
    },
    Source: process.env.AWS_SES_FROM_EMAIL!,
  };
  const command = new SendEmailCommand(params);
  return ses.send(command);
}
