import issuesData from '../mockData/issues.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class IssueService {
  constructor() {
    this.data = [...issuesData];
  }

  async getAll() {
    await delay(300);
    return [...this.data];
  }

  async getById(id) {
    await delay(200);
    const item = this.data.find(issue => issue.id === id);
    return item ? { ...item } : null;
  }

  async create(issue) {
    await delay(400);
    const newIssue = {
      ...issue,
      id: `issue_${Date.now()}`,
      status: 'new',
      attachments: [],
      reportedAt: new Date().toISOString(),
      resolvedAt: null
    };
    this.data.push(newIssue);
    return { ...newIssue };
  }

  async update(id, updates) {
    await delay(300);
    const index = this.data.findIndex(issue => issue.id === id);
    if (index === -1) throw new Error('Issue not found');
    
    this.data[index] = {
      ...this.data[index],
      ...updates
    };
    return { ...this.data[index] };
  }

  async delete(id) {
    await delay(300);
    const index = this.data.findIndex(issue => issue.id === id);
    if (index === -1) throw new Error('Issue not found');
    
    const deleted = this.data.splice(index, 1)[0];
    return { ...deleted };
  }
}

export default new IssueService();