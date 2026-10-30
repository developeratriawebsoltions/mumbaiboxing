import { createTransport } from "nodemailer";
import { jsPDF } from "jspdf";

type TournamentPaymentReceipt = {
  email: string;
  name: string;
  tournamentName: string;
  amount: number;
  invoiceNumber: string;
  paidAt: Date;
};

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return entities[character];
  });
}

export async function sendTournamentPaymentReceipt(
  receipt: TournamentPaymentReceipt,
) {
  const host = process.env.SMTP_HOST?.trim();
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER?.trim();
  const configuredPass = process.env.SMTP_PASS?.trim();
  const from =
    process.env.SMTP_FROM?.trim() ||
    process.env.EMAIL_FROM?.trim() ||
    user;

  if (!host || !user || !configuredPass || !from) {
    throw new Error("Receipt email is not configured.");
  }

  const pass =
    host.toLowerCase() === "smtp.gmail.com" ||
    host.toLowerCase() === "smtp.googlemail.com"
      ? configuredPass.replace(/\s/g, "")
      : configuredPass;

  const date = receipt.paidAt.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const pdf = new jsPDF();
  pdf.setFontSize(20);
  pdf.text("North Bombay District Amateur Boxing Association (NBDABA)", 20, 25);
  pdf.setFontSize(16);
  pdf.text("Tournament Payment Receipt", 20, 42);
  pdf.setFontSize(11);
  pdf.text(`Receipt number: ${receipt.invoiceNumber}`, 20, 58);
  pdf.text(`Date: ${date}`, 20, 68);
  pdf.text(`Received from: ${receipt.name}`, 20, 84);
  pdf.text(`Tournament: ${receipt.tournamentName}`, 20, 94, {
    maxWidth: 170,
  });
  pdf.text(`Payment method: Cash`, 20, 112);
  pdf.text(`Amount received: INR ${receipt.amount.toLocaleString("en-IN")}`, 20, 122);
  pdf.setFontSize(9);
  pdf.text("This is a computer-generated receipt.", 20, 145);

  const transporter = createTransport({
    host,
    port,
    secure: process.env.SMTP_SECURE === "true",
    auth: { user, pass },
  });
  await transporter.sendMail({
    from,
    to: receipt.email,
    subject: `Tournament payment receipt - ${receipt.tournamentName}`,
    text: `Hello ${receipt.name},\n\nYour cash payment has been received and approved.\n\nTournament: ${receipt.tournamentName}\nAmount: INR ${receipt.amount.toLocaleString("en-IN")}\nPayment method: Cash\nReceipt number: ${receipt.invoiceNumber}\nDate: ${date}\n\nThank you,\nNorth Bombay District Amateur Boxing Association (NBDABA)`,
    html: `
      <div style="font-family:Arial,sans-serif;color:#0f172a;line-height:1.6">
        <h2 style="color:#b91c1c">North Bombay District Amateur Boxing Association (NBDABA)</h2>
        <p>Hello ${escapeHtml(receipt.name)},</p>
        <p>Your cash payment has been received and approved. Your tournament registration is confirmed.</p>
        <p><strong>Tournament:</strong> ${escapeHtml(receipt.tournamentName)}<br />
        <strong>Amount:</strong> INR ${receipt.amount.toLocaleString("en-IN")}<br />
        <strong>Payment method:</strong> Cash<br />
        <strong>Receipt number:</strong> ${escapeHtml(receipt.invoiceNumber)}<br />
        <strong>Date:</strong> ${escapeHtml(date)}</p>
        <p>Your payment receipt is attached as a PDF.</p>
      </div>
    `,
    attachments: [
      {
        filename: `${receipt.invoiceNumber}-receipt.pdf`,
        content: Buffer.from(pdf.output("arraybuffer")),
        contentType: "application/pdf",
      },
    ],
  });
}
