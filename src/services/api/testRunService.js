import testRunsData from '../mockData/testRuns.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class TestRunService {
  constructor() {
    this.data = [...testRunsData];
  }

  async getAll() {
    await delay(300);
    return [...this.data];
  }

  async getById(id) {
    await delay(200);
    const item = this.data.find(run => run.id === id);
    return item ? { ...item } : null;
  }

  async create(testRun) {
    await delay(400);
    const newTestRun = {
      ...testRun,
      id: `run_${Date.now()}`,
      executedAt: new Date().toISOString()
    };
    this.data.push(newTestRun);
    return { ...newTestRun };
  }

  async update(id, updates) {
    await delay(300);
    const index = this.data.findIndex(run => run.id === id);
    if (index === -1) throw new Error('Test run not found');
    
    this.data[index] = {
      ...this.data[index],
      ...updates
    };
    return { ...this.data[index] };
  }

  async delete(id) {
    await delay(300);
    const index = this.data.findIndex(run => run.id === id);
    if (index === -1) throw new Error('Test run not found');
    
    const deleted = this.data.splice(index, 1)[0];
    return { ...deleted };
  }
}

export default new TestRunService();