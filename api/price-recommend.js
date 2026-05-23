/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI, Type } from '@google/genai';

// Initialize the GoogleGenAI instance on demand using the server environment variable
let ai = null;

function getAIClient() {
  if (!ai) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable is required but missing.');
    }
    ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return ai;
}

export default async function handler(req, res) {
  // CORS setup
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    res.setHeader('Content-Type', 'application/json');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch (e) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({ error: 'Invalid JSON body string' });
      }
    }

    const { productName, purchasePrice, category, description } = body || {};

    if (!purchasePrice || isNaN(Number(purchasePrice))) {
      res.setHeader('Content-Type', 'application/json');
      return res.status(400).json({ error: 'Missing or invalid purchasePrice (Achat TTC) parameter' });
    }

    const clientPurchasePrice = Number(purchasePrice);
    const aiClient = getAIClient();

    const prompt = `You are a high-end retail pricing consultant for a premium artisan store called 'AETHER OBJECTS'.
Analyze the following product information:
- Product Name: ${productName || 'Artisan Accessory'}
- Category: ${category || 'Artisan Design'}
- Original Description: ${description || 'Premium design coordinates.'}
- Purchase Price (Cost, Achat TTC): ${clientPurchasePrice}

Your task is to calculate and recommend an optimal, well-considered Retail Price (Prix de Vente TTC).
Consider standard premium markup:
- Artisan Homeware / Furniture: 2.2x to 3x markup on cost (120% to 200% markup).
- Stationery / Small Desk Accessories: 1.8x to 2.5x markup.
- Rare Collectibles / Sculptures: 3x to 5x markup.
- Maintain professional luxury positioning but keep it accessible for a discerning audience.

Please calculate:
1. Suggested Retail Price: (a realistic float rounded to a beautiful terminal number, e.g. .00 or .90). Ensure this is strictly greater than the purchasePrice.
2. Markup Percentage: ((RetailPrice - PurchasePrice) / PurchasePrice) * 100
3. Gross Margin: ((RetailPrice - PurchasePrice) / RetailPrice) * 100
4. A concise, professional pricing reasoning explaining whether we are positioning this as an entry-level artisan object, style statement, or rare asset, and why the markup is justified.`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            recommendedPrice: {
              type: Type.NUMBER,
              description: 'Recommended retail price (TTC) strictly greater than purchasePrice'
            },
            markupPercent: {
              type: Type.NUMBER,
              description: 'Markup percentage compared to purchase Price'
            },
            marginPercent: {
              type: Type.NUMBER,
              description: 'Gross profit margin percentage'
            },
            explanation: {
              type: Type.STRING,
              description: 'Elegant, business-logic explanation of the recommended pricing posture (2 sentences max).'
            }
          },
          required: ['recommendedPrice', 'markupPercent', 'marginPercent', 'explanation']
        }
      }
    });

    const outputText = response.text;
    const pricingResult = JSON.parse(outputText.trim());

    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json(pricingResult);

  } catch (err) {
    console.error('Gemini AI Price Suggestion handler failed:', err);
    res.setHeader('Content-Type', 'application/json');
    return res.status(500).json({ 
      error: 'Gemini Pricing Advisory Generation Failure', 
      details: err.message 
    });
  }
}
