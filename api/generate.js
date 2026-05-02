import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.FIREWORKS_API_KEY,
  baseURL: "https://api.fireworks.ai/inference/v1",
});

const MODEL = "accounts/fireworks/routers/kimi-k2p5-turbo";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { eventType, description, imageCount, partners } = req.body;

  if (!description?.trim()) {
    return res.status(400).json({ error: "Description is required" });
  }

  const partnerList = partners?.length
    ? `Partners involved: ${partners.map(p => p.name).join(", ")}.`
    : "";

  const prompt = `You are a social media manager for Plastic Free Seas (PFS), a Hong Kong-based ocean conservation NGO founded in 2013. Your job is to write authentic, engaging social media captions.

PFS VOICE:
- Warm, optimistic, community-oriented — never preachy or guilt-based
- Celebrates collective action, spotlights real people and concrete impact
- Uses bilingual content (English + Traditional Chinese where natural)
- Includes relevant emojis but not excessively

EVENT DETAILS:
- Type: ${eventType}
- Description: ${description}
- Number of photos available: ${imageCount ?? 0}
${partnerList}

HASHTAG SETS (use relevant ones):
- Core: #PlasticFreeSeas #無塑海洋 #PlasticPollution #SaveOurOcean #HongKong #香港
- Cleanup: #BeachCleanupHK #淨灘 #CoastalCleanup #VolunteerHK #義工 #OceanAction #PlasticFree #走塑
- Education: #OceanEducation #海洋教育 #SayNoToSingleUse #走塑生活 #EcoHK #環保 #SustainabilityHK
- Corporate: #CSRHongKong #企業社會責任 #ESG #CorporateSustainability #SustainableBusiness
- Awareness: #WorldOceanDay #世界海洋日 #EarthDay #地球日 #ActForOceans #ClimateAction

Respond with ONLY a valid JSON object, no markdown, no explanation. Use this exact structure:
{
  "ig": "<Instagram caption — punchy opener, 1-2 bilingual lines, CTA 'link in bio', 10-15 hashtags>",
  "fb": "<Facebook caption — slightly longer, conversational, no hashtag overload, end with website CTA www.plasticfreeseas.com>",
  "li": "<LinkedIn caption — professional framing, impact metrics language, ESG angle if relevant, 5-6 hashtags max>",
  "guidance": [
    { "icon": "<emoji>", "text": "<specific actionable tip tailored to this post>", "priority": "high" },
    { "icon": "<emoji>", "text": "<specific actionable tip>", "priority": "medium" },
    { "icon": "<emoji>", "text": "<specific actionable tip>", "priority": "info" }
  ],
  "bestTime": {
    "weekdays": "<best weekday time windows for HK audience given this content type>",
    "weekends": "<best weekend time for HK audience given this content type>",
    "note": "<1 sentence on best day/time based on content type>"
  }
}`;

  try {
    console.log("[generate] calling model:", MODEL);
    console.log("[generate] prompt length:", prompt.length);

    const completion = await client.chat.completions.create({
      model: MODEL,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 2000,
      response_format: { type: "json_object" },
    });

    const raw = completion.choices[0].message.content.trim();
    console.log("[generate] raw response:", raw);

    // Strip markdown code fences if model wraps in ```json
    let jsonStr = raw.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");

    // Extract outermost JSON object in case of extra text
    const match = jsonStr.match(/\{[\s\S]*\}/);
    if (match) jsonStr = match[0];

    // Fix unescaped backslashes not part of valid JSON escape sequences
    jsonStr = jsonStr.replace(/\\(?!["\\/bfnrtu])/g, "\\\\");

    const data = JSON.parse(jsonStr);
    console.log("[generate] parsed keys:", Object.keys(data));

    return res.status(200).json(data);
  } catch (err) {
    console.error("[generate] error:", err);
    return res.status(500).json({
      error: err?.message ?? "Failed to generate content. Please try again.",
    });
  }
}
