import testCasesData from '../mockData/testCases.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class TestCaseService {
  constructor() {
    this.data = [...testCasesData];
  }

  async getAll() {
    await delay(300);
    return [...this.data];
  }

  async getById(id) {
    await delay(200);
    const item = this.data.find(tc => tc.id === id);
    return item ? { ...item } : null;
  }

  async create(testCase) {
    await delay(400);
    const newTestCase = {
      ...testCase,
      id: `tc_${Date.now()}`,
      lastRunStatus: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.data.push(newTestCase);
    return { ...newTestCase };
  }

  async update(id, updates) {
    await delay(300);
    const index = this.data.findIndex(tc => tc.id === id);
    if (index === -1) throw new Error('Test case not found');
    
    this.data[index] = {
      ...this.data[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    return { ...this.data[index] };
  }

  async delete(id) {
    await delay(300);
    const index = this.data.findIndex(tc => tc.id === id);
    if (index === -1) throw new Error('Test case not found');
    
    const deleted = this.data.splice(index, 1)[0];
    return { ...deleted };
  }
}

export default new TestCaseService();