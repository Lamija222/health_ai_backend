import OpenAI from "openai";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Use POST" });
  }

  const { bodyTemp, heartRate } = req.body ?? {};

  if (!bodyTemp || !heartRate) {
    return res.status(400).json({ error: "Missing data" });
  }

  try {
    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const prompt = `
Korisnik ima:
- Tjelesnu temperaturu: ${bodyTemp} °C
- Puls: ${heartRate} bpm
Daj kratke i jasne zdravstvene preporuke.
Piši na bosanskom jeziku.
`;

    const response = await client.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [{ role: "user", content: prompt }],
    });

    res.status(200).json({
      advice: response.choices[0].message.content,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
}
