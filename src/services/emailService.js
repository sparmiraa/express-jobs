import { transporter } from "../config/email.js";

export async function sendResetPasswordEmail(email, resetLink) {
  const htmlTemplate = `
    <div style="font-family: Arial, sans-serif; background:#f6f6f6; padding:40px;">
      <div style="max-width:600px; margin:0 auto; background:white; padding:30px; border-radius:10px;">
        <h2 style="color:#333;">Восстановление пароля</h2>
        <p>Вы запросили сброс пароля.</p>
        <p>Нажмите на кнопку ниже, чтобы задать новый пароль:</p>
        <a href="${resetLink}"
           style="
             display:inline-block;
             padding:12px 20px;
             background:#4CAF50;
             color:white;
             text-decoration:none;
             border-radius:6px;
             font-weight:bold;
             margin-top:10px;
           ">
           Сбросить пароль
        </a>
        <p style="margin-top:25px;">Или перейдите по ссылке:</p>
        <p style="word-break:break-all; color:#555;">${resetLink}</p>
        <hr style="margin:30px 0;" />
        <p style="font-size:12px; color:#999;">
          Если вы не запрашивали восстановление пароля — просто проигнорируйте это письмо.
        </p>
        <p style="font-size:12px; color:#999;">
          Ссылка действует 15 минут.
        </p>
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: '"Support" <miroslavkosiuk@gmail.com>',
    to: email,
    subject: "Восстановление пароля",
    html: htmlTemplate,
  });
}
