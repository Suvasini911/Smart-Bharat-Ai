import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from "@google/generative-ai";
// Load env vars
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Resolve __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, 'data', 'complaints.json');

app.use(cors());
app.use(express.json({ limit: '10mb' })); // Allow image uploads in base64

// Initialize Gemini API
let genAI = null;
if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here') {
  try {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    console.log('Gemini API initialized successfully.');
  } catch (err) {
    console.error('Failed to initialize Gemini API client:', err.message);
  }
} else {
  console.warn('WARNING: GEMINI_API_KEY is not set or placeholder is used. Server will run in Mock AI mode.');
}

// Helper to read database
const readComplaints = () => {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      return [];
    }
    const data = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(data || '[]');
  } catch (err) {
    console.error('Error reading complaints.json:', err.message);
    return [];
  }
};

// Helper to write database
const writeComplaints = (data) => {
  try {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error writing to complaints.json:', err.message);
    return false;
  }
};

// Dynamic complaint status simulator
// Progresses complaints based on elapsed time for a lifelike experience
const simulateComplaintProgress = (complaint) => {
  if (!complaint.date) return complaint;
  
  // If the status was already resolved or assigned by seed, don't regress it
  if (complaint.status === 'resolved') return complaint;

  const creationTime = new Date(complaint.date).getTime();
  const elapsedMinutes = (Date.now() - creationTime) / (1000 * 60);

  let newStatus = complaint.status;
  if (elapsedMinutes >= 10) {
    newStatus = 'resolved';
  } else if (elapsedMinutes >= 5) {
    newStatus = 'assigned';
  } else if (elapsedMinutes >= 2) {
    newStatus = 'review';
  }

  // Update only if status changed
  if (newStatus !== complaint.status) {
    complaint.status = newStatus;
  }

  return complaint;
};

// ----------------------------------------------------
// REST ROUTES
// ----------------------------------------------------

// Get all complaints
app.get('/api/complaints', (req, res) => {
  const complaints = readComplaints();
  // Simulate status progression on all records before returning
  const updatedComplaints = complaints.map(c => simulateComplaintProgress(c));
  
  // Save updated statuses back to file
  writeComplaints(updatedComplaints);
  res.json(updatedComplaints);
});

// Get complaint by ID
app.get('/api/complaints/:id', (req, res) => {
  const complaints = readComplaints();
  const searchId = req.params.id.trim().toUpperCase();
  const found = complaints.find(c => c.id === searchId);

  if (found) {
    const updated = simulateComplaintProgress(found);
    
    // Save updated state back
    const updatedAll = complaints.map(c => c.id === searchId ? updated : c);
    writeComplaints(updatedAll);

    res.json(updated);
  } else {
    res.status(404).json({ error: 'Complaint not found' });
  }
});

// File a complaint
app.post('/api/complaints', (req, res) => {
  const { title, description, category, location, image } = req.body;

  if (!title || !description || !location) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const complaints = readComplaints();

  // Generate unique ID in format: SB-XXXXXX (6 alphanumeric caps)
  let mockId;
  let isUnique = false;
  while (!isUnique) {
    mockId = 'SB-' + Math.random().toString(36).substring(2, 8).toUpperCase();
    isUnique = !complaints.some(c => c.id === mockId);
  }

  const newComplaint = {
    id: mockId,
    title,
    description,
    category,
    location,
    date: new Date().toISOString(),
    status: 'submitted',
    image: image || null
  };

  complaints.unshift(newComplaint); // Add to beginning of array
  writeComplaints(complaints);

  res.status(201).json(newComplaint);
});

// AI Chatbot Powered by Gemini
app.post('/api/chat', async (req, res) => {
  const { message, language } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message body cannot be empty' });
  }

  // System instruction template restricting model behavior to Indian Civic Inquiries
  const systemInstruction = `
You are the "Smart Bharat - AI Civic Companion", a helpful, patriotic, and efficient AI assistant designed to guide Indian citizens.
Your job is to answer questions about Indian civic and government services, including:
- Aadhaar Card (UIDAI)
- PAN Card
- Passports (Passport Seva)
- Birth/Death Certificates
- Driving Licence (Sarathi Parivahan)
- Voter ID (Election Commission)
- Ration Card (NFSA)
- Welfare schemes (e.g. PM Kisan, Ayushman Bharat, PM Awas Yojana, Jan Dhan Yojana)
- General guidance on how to report public issues (garbage, water leakage, road damage)

Rules:
1. Always be polite, respectful, and clear.
2. Highlight eligibility, documents required, and step-by-step guides clearly using markdown.
3. Keep responses structured and scannable.
4. Translate your response to the requested language: "${language || 'English'}". If the language requested is "Hindi", write in Devnagari script. If "Kannada", write in Kannada script.
5. If the user asks general greeting questions (e.g., Hi, Hello, Namaste), respond warmly and introduce your capabilities.
6. If the user asks questions completely unrelated to Indian civic matters, government schemes, or local administration, politely decline to answer, redirecting them to ask about civic companion services.
`;

  // Fallback Mock chatbot logic if API key isn't active
  if (!genAI) {
    return simulateMockChatResponse(message, language, res);
  }

  try {
    const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
  systemInstruction,
});

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: message }] }]
    });

    const reply = result.response.text();
    res.json({ reply });
  } catch (err) {
    console.error('Gemini API Error during generation:', err.message);
    // Graceful fallback to mock response
    return simulateMockChatResponse(message, language, res, true);
  }
});

// Fallback logic generator
function simulateMockChatResponse(message, language, res, wasApiError = false) {
  const cleanMsg = message.toLowerCase();
  let reply = '';
  
  if (wasApiError) {
    reply += `*Note: There was an issue processing with Gemini Live. Showing simulated civic assistant answer.* \n\n`;
  }

  if (cleanMsg.includes('aadhaar') || cleanMsg.includes('आधार')) {
    reply += `### Aadhaar Card Application Guide
To enroll for an Aadhaar Card:
1. Visit a nearby **Aadhaar Seva Kendra**.
2. Submit your **Identity Proof** (e.g., Passport, Voter ID) and **Address Proof** (e.g., Electricity bill).
3. Complete your biometric verification (Fingerprints and Iris scans).
4. Save the acknowledgement slip with the Enrollment ID. e-Aadhaar can be downloaded in 15 days from UIDAI.`;
  } else if (cleanMsg.includes('passport') || cleanMsg.includes('पासपोर्ट')) {
    reply += `### Passport Seva Application Guide
To apply for a Passport online:
1. Register on the official portal: **passportindia.gov.in**.
2. Select "Apply for Fresh Passport".
3. Pay the fee online and book an appointment slot at a Passport Seva Kendra (PSK).
4. Carry all original documents (Aadhaar, Birth certificate, address proof) to the PSK on appointment day.`;
  } else if (cleanMsg.includes('pan') || cleanMsg.includes('पैन')) {
    reply += `### PAN Card application
To get a PAN Card (Form 49A):
1. Visit the NSDL Protean or UTITSL website.
2. Select "New PAN - Indian Citizen".
3. Upload scan of identity/address proof, or use e-KYC paperless Aadhaar integration.
4. Pay the fee of ₹107. The e-PAN arrives in 3 days, and physical card in 15 days.`;
  } else if (cleanMsg.includes('kisan') || cleanMsg.includes('किसान')) {
    reply += `### Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)
* **Welfare Scheme**: Income support of ₹6,000 per year in 3 equal installments of ₹2,000 directly to landholder farmers.
* **Registration**: Register online at **pmkisan.gov.in** under Farmers Corner or at a CSC center. Requires land ownership documents and Aadhaar linked bank account.`;
  } else if (cleanMsg.includes('ayushman') || cleanMsg.includes('आयुष्मान')) {
    reply += `### Ayushman Bharat (PM-JAY)
* **Benefit**: Cashless health cover of up to ₹5 Lakhs per family per year for secondary and tertiary hospital treatments.
* **Check Eligibility**: Search using your Ration card number on **pmjay.gov.in** or visit an empaneled hospital to check eligibility.`;
  } else if (cleanMsg.includes('birth') || cleanMsg.includes('जन्म')) {
    reply += `### Birth Registration
Births must be registered within **21 days** with the local municipal body. Visit your municipal corporation / ward office with hospital documents, parent identification proofs, and fill Form 1.`;
  } else {
    reply += `Greetings! I am the Smart Bharat AI Companion. 

I can assist you with details regarding Aadhaar Card, PAN Card, Indian Passports, Birth Certificates, Voter registration, Ration Cards, and central schemes like PM-Kisan and Ayushman Bharat. 

To interact with real-time AI responses, please add your Google Gemini API Key to the backend configuration file (.env). Let me know how I can guide you today!`;
  }

  // Basic translate warning
  if (language === 'hi') {
    reply = `[अनुवादित सिमुलेशन: हिंदी]\n\n` + reply;
  } else if (language === 'kn') {
    reply = `[ಅನುವಾದಿತ ಸಿಮ್ಯುಲೇಶನ್: ಕನ್ನಡ]\n\n` + reply;
  }

  res.json({ reply });
}

// Start Server
app.listen(PORT, () => {
  console.log(`Smart Bharat Backend listening on port ${PORT}`);
});
