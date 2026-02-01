export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*'); // dozvoli sve domene
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end(); // preflight request
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Use POST" });
  }

  const { bodyTemp, heartRate } = req.body;

  try {
    const OpenAI = require("openai");
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const prompt = `
Korisnik ima:
- Tjelesnu temperaturu: ${bodyTemp} °C
- Puls: ${heartRate} bpm
Daj kratke i jasne zdravstvene preporuke.
Piši na bosanskom jeziku.
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [{ role: "user", content: prompt }],
    });

    res.status(200).json({
      advice: response.choices[0].message.content,
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
