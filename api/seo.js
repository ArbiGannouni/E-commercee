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
      throw new Error('GEMINI_API_KEY environment variable is missing.');
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

// Helper to reliably parse request body from streams across Vercel and Express
async function parseRequestBody(req) {
  if (req.body) {
    if (typeof req.body === 'string') {
      try {
        return JSON.parse(req.body);
      } catch (e) {
        // Fall through to manual stream parsing
      }
    } else {
      return req.body;
    }
  }

  return new Promise((resolve) => {
    let bodyData = '';
    req.on('data', chunk => {
      bodyData += chunk;
    });
    req.on('end', () => {
      try {
        resolve(bodyData ? JSON.parse(bodyData) : {});
      } catch (e) {
        resolve({});
      }
    });
    req.on('error', () => {
      resolve({});
    });
  });
}

export default async function handler(req, res) {
  // Setup standard CORS headers for development/Vercel
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

  let productName = '';
  let description = '';
  let category = '';

  try {
    const parsed = await parseRequestBody(req);
    productName = parsed.productName || '';
    description = parsed.description || '';
    category = parsed.category || '';
  } catch (err) {
    console.warn('Body parsing warning, falling back to empty fields:', err);
  }

  if (!productName) {
    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json({
      seoTitle: 'AETHER OBJECTS — Timeless Artisan Storefront',
      seoDescription: 'Handcrafted premium workspace coordinates and professional office items.',
      seoKeywords: 'artisan, stationery, workspace, premium, design',
      isFallback: true,
      notice: 'Please supply a Product Name for tailored metadata generation.'
    });
  }

  // Define the high-quality local template generation fallback
  const cleanCategory = category || 'Artisan Work';
  const cleanName = productName.trim();
  const rawDesc = description || 'Exquisite workspace element designed for productivity.';

  const fallbackResult = {
    seoTitle: `${cleanName} — Premium Handcrafted ${cleanCategory} | AETHER`,
    seoDescription: `${rawDesc.slice(0, 110)}... Discover the timeless design philosophy of AETHER.`,
    seoKeywords: `${cleanCategory.toLowerCase()}, handcrafted, premium, design, workspace, tuning, ${cleanName.toLowerCase().split(' ').filter(x => x.length > 2).slice(0, 4).join(', ')}`,
    isFallback: true,
    notice: 'Using AETHER Heuristic Optimizer. (For Gemini Generative SEO, add GEMINI_API_KEY under Vercel Settings)'
  };

  // Adjust string lengths to stay search-optimized in fallback
  if (fallbackResult.seoTitle.length > 60) {
    fallbackResult.seoTitle = `${cleanName.slice(0, 35)} — ${cleanCategory} | AETHER`;
  }
  if (fallbackResult.seoDescription.length > 155) {
    fallbackResult.seoDescription = fallbackResult.seoDescription.slice(0, 150) + '...';
  }

  try {
    const aiClient = getAIClient();

    const prompt = `Generate a highly optimized, professional, and elegant SEO title, meta description, and search keywords/tags for the following product:
- Product Name: ${cleanName}
- Category: ${cleanCategory}
- Original Description: ${rawDesc}

Ensure the SEO Title is catchy, professional, and under 60 characters.
Ensure the SEO Description is highly engaging, highlights the premium nature, and is under 155 characters.
Ensure the Keywords are a list of 5 to 8 comma-separated search-term keywords ideal for indexing and discoverability.`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            seoTitle: {
              type: Type.STRING,
              description: 'SEO optimized title under 60 characters'
            },
            seoDescription: {
              type: Type.STRING,
              description: 'Meta description under 155 characters mapping organic search query structures'
            },
            seoKeywords: {
              type: Type.STRING,
              description: 'Comma separated list of 5 to 8 search relevance index keywords'
            }
          },
          required: ['seoTitle', 'seoDescription', 'seoKeywords']
        }
      }
    });

    const outputText = response.text;
    const seoResult = JSON.parse(outputText.trim());

    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json({
      ...seoResult,
      isFallback: false
    });

  } catch (err) {
    console.error('Gemini SEO Generator model call failed, active fallback response given:', err);
    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json(fallbackResult);
  }
}
