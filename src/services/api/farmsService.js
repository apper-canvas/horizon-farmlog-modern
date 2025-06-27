import farmsData from '@/services/mockData/farms.json';

let farms = [...farmsData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const farmsService = {
  async getAll() {
    await delay(300);
    return [...farms];
  },

  async getById(id) {
    await delay(200);
    const farm = farms.find(f => f.Id === parseInt(id));
    if (!farm) {
      throw new Error('Farm not found');
    }
    return { ...farm };
  },

  async create(farmData) {
    await delay(400);
    const maxId = farms.length > 0 ? Math.max(...farms.map(f => f.Id)) : 0;
    const newFarm = {
      ...farmData,
      Id: maxId + 1,
      fields: farmData.fields || []
    };
    farms.push(newFarm);
    return { ...newFarm };
  },

  async update(id, farmData) {
    await delay(400);
    const index = farms.findIndex(f => f.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Farm not found');
    }
    farms[index] = { ...farms[index], ...farmData, Id: parseInt(id) };
    return { ...farms[index] };
  },

  async delete(id) {
    await delay(300);
    const index = farms.findIndex(f => f.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Farm not found');
    }
    farms.splice(index, 1);
    return true;
  }
};