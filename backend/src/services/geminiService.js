// Gemini arranges real SerpAPI activities into a date-aware schedule. The model never invents venue details.
export async function arrangeWithGemini({ destination, startDate, dayCount, activities, slots }) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;

  const model = process.env.GEMINI_MODEL || 'gemini-3.5-flash-lite';
  const prompt = {
    task: 'Arrange these selected real-world activities into a practical travel itinerary.',
    destination,
    startDate,
    dayCount,
    availableTimes: slots,
    rules: [
      'Use only exact activity titles provided in the candidate list; never invent places.',
      'Schedule each title at most once.',
      'Use day as an integer from 1 to dayCount and time exactly from availableTimes.',
      'Schedule candidates in sensible geographic/category order when addresses suggest proximity.',
      'Return only valid JSON matching {"activities":[{"title":"exact candidate title","day":1,"time":"09:30"}]}.'
    ],
    candidates: activities.map(({ title, category, address, distanceKm, rating }) => ({ title, category, address, distanceKm, rating }))
  };

  // AI work: Gemini chooses the order and time slots for authentic SerpAPI listings. The caller validates every suggestion.
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
    body: JSON.stringify({
      contents: [{ role: 'user', parts: [{ text: JSON.stringify(prompt) }] }],
      generationConfig: { responseMimeType: 'application/json', temperature: 0.2 }
    }),
    signal: AbortSignal.timeout(25000)
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw Object.assign(new Error(error.error?.message || `Gemini returned ${response.status}`), { status: 502 });
  }
  const payload = await response.json();
  const text = payload.candidates?.[0]?.content?.parts?.map(part => part.text || '').join('').trim();
  if (!text) throw Object.assign(new Error('Gemini returned an empty itinerary.'), { status: 502 });
  try {
    return JSON.parse(text);
  } catch {
    throw Object.assign(new Error('Gemini returned an invalid itinerary format.'), { status: 502 });
  }
}
