import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      name,
      company,
      email,
      contactType,
      subject,
      message,
      website,
    } = body;

    // Honeypot anti-spam
    if (website) {
      return Response.json({ success: true });
    }

    if (!name || !email || !subject || !message) {
      return Response.json(
        { error: "Campos obrigatórios não preenchidos." },
        { status: 400 }
      );
    }

    const { data, error } = await resend.emails.send({
      from: "KILL LIPE <onboarding@resend.dev>",
      to: ["fellipesantos_29@hotmail.com"],
      replyTo: email,
      subject: `[KILL LIPE] ${subject}`,
      html: `
        <h2>Novo contato pelo site KILL LIPE</h2>

        <p><strong>Nome:</strong> ${name}</p>
        <p><strong>Empresa:</strong> ${company || "Não informado"}</p>
        <p><strong>E-mail:</strong> ${email}</p>
        <p><strong>Tipo de contato:</strong> ${contactType || "Não informado"}</p>

        <hr />

        <p><strong>Assunto:</strong> ${subject}</p>

        <p><strong>Mensagem:</strong></p>
        <p>${message.replace(/\n/g, "<br />")}</p>
      `,
    });

    if (error) {
      console.error("Resend error:", error);

      return Response.json(
        { error: "Não foi possível enviar a mensagem." },
        { status: 500 }
      );
    }

    return Response.json({
      success: true,
      id: data?.id,
    });
  } catch (error) {
    console.error("Contact API error:", error);

    return Response.json(
      { error: "Erro interno do servidor." },
      { status: 500 }
    );
  }
}