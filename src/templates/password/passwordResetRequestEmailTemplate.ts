const EMAIL_SUBJECT = "Solicitação -Redefinir senha - MentorConnect";

export default function generatePasswordResetRequestEmail(
  name: string,
  resetCode: string,
) {
  return `
    <!DOCTYPE html>
    <html lang="pt">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <title>${EMAIL_SUBJECT}</title>
        <style>
          body {
            background-color: #f6f9fc;
            font-family: Arial, sans-serif;
            padding: 20px;
          }
          .container {
            background-color: #ffffff;
            border-radius: 5px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            padding: 40px;
            max-width: 600px;
            margin: 0 auto;
          }
          h1 {
            font-size: 24px;
            margin-bottom: 20px;
            color: #333333;
          }
          p {
            font-size: 16px;
            line-height: 1.5;
            color: #555555;
            margin-bottom: 20px;
          }
          .reset-code {
            font-size: 20px;
            font-weight: bold;
            color: #000000;
            text-align: center;
            margin-bottom: 30px;
          }
          .button {
            background-color: #007bff;
            color: #ffffff;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 4px;
            text-align: center;
            display: inline-block;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Solicitação de Redefinição de Senha</h1>
          <p>Olá, <strong>${name}</strong>!</p>
          <p>Você solicitou a redefinição da sua senha. Utilize o código abaixo para confirmar a solicitação:</p>
          <div class="reset-code">${resetCode}</div>
          <p>Caso você não tenha solicitado a redefinição de senha, por favor, ignore este email.</p>
        </div>
      </body>
    </html>
    `;
}
