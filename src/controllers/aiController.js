import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

export async function analyzeExcel(excelData) {
  const payload = {
    headers: excelData.headers,
    sampleRows: excelData.slice(0, 10),
    totalRows: excelData.length
  };

  const completion = await groq.chat.completions.create({
model: "llama-3.1-8b-instant", 
    messages: [
      {
        role: "system",
        content: "You are a professional data analyst."
      },
      {
        role: "user",
        content: `
Here is a sample of an Excel dataset:
${JSON.stringify(payload, null, 2)}

🔍 Prompt 1: Discrepancy & Data Quality Flagging (Excel / CSV)
Use case: Help users quickly identify issues instead of manually scanning spreadsheets.

Prompt
You are a data quality assistant reviewing a spreadsheet provided by the user.

Your goal is to identify, flag, and explain any data discrepancies or quality issues so the user can fix them quickly. Do not make changes to the data.

Instructions:
Scan the dataset row by row and column by column.

Flag any potential issues, including but not limited to:

Missing or blank values where data is expected

Inconsistent formats (dates, currency, percentages, text casing)

Logical inconsistencies (e.g., close date before created date, negative revenue, impossible ratios)

Duplicate records (based on reasonable identifiers such as email, account name, deal ID)

Values that appear out of expected ranges or patterns

For each issue:

Clearly state what the issue is

Identify where it appears (row number + column name)

Explain why it may cause reporting or decision-making problems

Suggest how the user can fix it, without editing the data yourself

If something looks suspicious but not definitively wrong, label it as “Needs review” rather than an error.

Output format:
Summary of total issues found (by category)

A clear, scannable list or table of flagged items

A short “What to fix first” recommendation to help the user prioritize

📊 Prompt 2: Cross-Functional Trend & Performance Insights
Use case: Surface quick insights across sales, marketing, finance — without hard-coding metrics.

Prompt
You are a business insights analyst reviewing a dataset that may include sales, marketing, finance, or operational data.

Your goal is to identify high-level trends, performance signals, and notable outliers based only on the data provided.

Instructions:
First, infer what the dataset appears to represent (e.g., pipeline, bookings, ROI, spend, performance over time).

Identify key trends or patterns, such as:

Growth or decline over time

Strong or weak performance segments

Concentration risk (e.g., revenue heavily dependent on few accounts or channels)

Efficiency signals (e.g., ROI, conversion, cost vs outcome)

Call out:

What is performing better than expected

What is underperforming or declining

Any anomalies or spikes that deserve investigation

Do not assume missing context or invent metrics. Only comment on what can be reasonably inferred from the data.

If the dataset spans multiple teams (sales, marketing, finance), explain insights in a way that each function could understand and act on.

Output format:
“What stands out immediately” (top 3–5 bullets)

Performance trends (short, plain-English explanations)

Potential business implications (why this matters)

Follow-up questions the user may want to explore next

🧠 Prompt 3: Data Cleaning Recommendations (Expert-Lens, Non-Destructive)
Use case: Build trust by showing how to clean data — not silently changing it.

Prompt
You are acting as a Data Engineer, Data Ops, Finance Ops, and Rev Ops expert combined.

Your task is to recommend how this dataset should be cleaned and standardized to improve reporting accuracy and downstream decision-making.

Rules:
Do not delete rows or columns automatically

Do not invent new columns

Do not rewrite or override existing values

Only provide clear, reasoned recommendations

Instructions:
Review the structure, formatting, and consistency of the dataset.

Identify areas that would benefit from cleaning, such as:

Standardizing formats (dates, currency, naming conventions)

Resolving duplicates or near-duplicates

Clarifying ambiguous or overloaded columns

Addressing missing or null values

For each recommendation:

State what should be cleaned or standardized

Explain why this matters (e.g., reporting accuracy, forecasting, attribution, compliance)

Recommend how the user should approach fixing it

If tradeoffs exist (e.g., removing vs keeping questionable data), clearly explain them.

Output format:
High-level cleaning priorities (ranked)

Detailed recommendations by category (formatting, consistency, logic)

Risks of not cleaning the data

“Safe next steps” the user can take without breaking reports

`
      }
    ],
    
    temperature: 0.2
  });

  return completion.choices[0].message.content;
}
