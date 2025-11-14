import RNHTMLtoPDF from 'react-native-html-to-pdf';
import {Expense, Sponsorship, Analytics, ContentIdea} from '../types';
import {format} from 'date-fns';

interface MonthlyReport {
  expenses: Expense[];
  sponsorships: Sponsorship[];
  analytics: Analytics[];
  contentIdeas: ContentIdea[];
  month: string;
  year: string;
}

export class PDFGenerator {
  static async generateMonthlyReport(data: MonthlyReport): Promise<string> {
    const totalExpenses = data.expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const totalRevenue = data.sponsorships
      .filter(s => s.status === 'completed' || s.status === 'active')
      .reduce((sum, s) => sum + s.amount, 0);
    const netIncome = totalRevenue - totalExpenses;

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Monthly Creator Report - ${data.month} ${data.year}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 20px;
              color: #333;
            }
            h1 {
              color: #6366f1;
              border-bottom: 3px solid #6366f1;
              padding-bottom: 10px;
            }
            h2 {
              color: #4f46e5;
              margin-top: 30px;
              border-bottom: 1px solid #e5e7eb;
              padding-bottom: 5px;
            }
            .summary {
              background-color: #f3f4f6;
              padding: 15px;
              border-radius: 8px;
              margin: 20px 0;
            }
            .summary-item {
              display: flex;
              justify-content: space-between;
              margin: 10px 0;
              font-size: 16px;
            }
            .summary-item.total {
              font-weight: bold;
              font-size: 18px;
              border-top: 2px solid #6366f1;
              padding-top: 10px;
              margin-top: 15px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin: 15px 0;
            }
            th {
              background-color: #6366f1;
              color: white;
              padding: 12px;
              text-align: left;
            }
            td {
              padding: 10px;
              border-bottom: 1px solid #e5e7eb;
            }
            tr:nth-child(even) {
              background-color: #f9fafb;
            }
            .positive {
              color: #10b981;
            }
            .negative {
              color: #ef4444;
            }
            .footer {
              margin-top: 40px;
              text-align: center;
              color: #6b7280;
              font-size: 12px;
              border-top: 1px solid #e5e7eb;
              padding-top: 20px;
            }
          </style>
        </head>
        <body>
          <h1>Creator Business Report</h1>
          <p><strong>Period:</strong> ${data.month} ${data.year}</p>
          <p><strong>Generated:</strong> ${format(new Date(), 'MMMM dd, yyyy')}</p>

          <div class="summary">
            <h2>Financial Summary</h2>
            <div class="summary-item">
              <span>Total Revenue (Sponsorships):</span>
              <span class="positive">$${totalRevenue.toFixed(2)}</span>
            </div>
            <div class="summary-item">
              <span>Total Expenses:</span>
              <span class="negative">-$${totalExpenses.toFixed(2)}</span>
            </div>
            <div class="summary-item total">
              <span>Net Income:</span>
              <span class="${netIncome >= 0 ? 'positive' : 'negative'}">$${netIncome.toFixed(2)}</span>
            </div>
          </div>

          <h2>Expenses (${data.expenses.length} transactions)</h2>
          ${data.expenses.length > 0 ? `
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Category</th>
                <th>Description</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              ${data.expenses.map(exp => `
                <tr>
                  <td>${format(new Date(exp.date), 'MMM dd, yyyy')}</td>
                  <td>${exp.category}</td>
                  <td>${exp.description}</td>
                  <td>$${exp.amount.toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          ` : '<p>No expenses recorded this month.</p>'}

          <h2>Sponsorships & Deals (${data.sponsorships.length} deals)</h2>
          ${data.sponsorships.length > 0 ? `
          <table>
            <thead>
              <tr>
                <th>Brand</th>
                <th>Status</th>
                <th>Start Date</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              ${data.sponsorships.map(sp => `
                <tr>
                  <td>${sp.brand}</td>
                  <td>${sp.status}</td>
                  <td>${format(new Date(sp.startDate), 'MMM dd, yyyy')}</td>
                  <td>$${sp.amount.toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          ` : '<p>No sponsorships this month.</p>'}

          <h2>Content Performance</h2>
          ${data.analytics.length > 0 ? `
          <table>
            <thead>
              <tr>
                <th>Platform</th>
                <th>Date</th>
                <th>Followers</th>
                <th>Engagement</th>
                <th>Reach</th>
              </tr>
            </thead>
            <tbody>
              ${data.analytics.map(a => `
                <tr>
                  <td>${a.platform}</td>
                  <td>${format(new Date(a.date), 'MMM dd, yyyy')}</td>
                  <td>${a.followers.toLocaleString()}</td>
                  <td>${a.engagement.toFixed(1)}%</td>
                  <td>${a.reach.toLocaleString()}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          ` : '<p>No analytics data recorded.</p>'}

          <h2>Content Ideas (${data.contentIdeas.length} ideas)</h2>
          ${data.contentIdeas.length > 0 ? `
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Platform</th>
                <th>Status</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              ${data.contentIdeas.map(idea => `
                <tr>
                  <td>${idea.title}</td>
                  <td>${idea.platform}</td>
                  <td>${idea.status}</td>
                  <td>${format(new Date(idea.createdAt), 'MMM dd, yyyy')}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          ` : '<p>No content ideas recorded.</p>'}

          <div class="footer">
            <p>Creator Business Planner - Helping creators grow their business</p>
            <p>This report was automatically generated by Creator Business Planner</p>
          </div>
        </body>
      </html>
    `;

    try {
      const options = {
        html,
        fileName: `creator-report-${data.month}-${data.year}`,
        directory: 'Documents',
      };

      const file = await RNHTMLtoPDF.convert(options);
      return file.filePath || '';
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw error;
    }
  }
}
