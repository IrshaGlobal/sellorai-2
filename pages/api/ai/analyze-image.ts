import { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import fs from 'fs';
import { OpenAI } from 'openai';

// Configure API to parse form data
export const config = {
  api: {
    bodyParser: false,
  },
};

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Parse form data
    const form = formidable({ multiples: false });
    
    const [fields, files] = await new Promise<[formidable.Fields, formidable.Files]>((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        resolve([fields, files]);
      });
    });

    // Get image file
    const imageFile = files.image as formidable.File;
    
    if (!imageFile) {
      return res.status(400).json({ error: 'No image provided' });
    }

    // Read image file
    const imageBuffer = fs.readFileSync(imageFile.filepath);
    const base64Image = imageBuffer.toString('base64');
    const dataURI = `data:${imageFile.mimetype};base64,${base64Image}`;

    // Call OpenAI Vision API
    const response = await openai.chat.completions.create({
      model: "gpt-4-vision-preview",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Analyze this product image and provide the following information in JSON format: title, description, category (choose from: Apparel, Accessories, Home & Decor, Electronics, Beauty & Health, Toys & Games, Books, Other), and tags (array of keywords). Make the description detailed but concise, around 2-3 sentences."
            },
            {
              type: "image_url",
              image_url: {
                url: dataURI,
              },
            },
          ],
        },
      ],
      max_tokens: 500,
      response_format: { type: "json_object" }
    });

    // Parse the response
    const content = response.choices[0].message.content;
    const productData = content ? JSON.parse(content) : {};

    // Clean up temp file
    fs.unlinkSync(imageFile.filepath);

    return res.status(200).json(productData);
  } catch (error: any) {
    console.error('Error analyzing image:', error);
    return res.status(500).json({ error: error.message || 'Failed to analyze image' });
  }
}