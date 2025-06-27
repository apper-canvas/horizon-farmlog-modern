import cropsData from '@/services/mockData/crops.json';

let crops = [...cropsData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const cropsService = {
  async getAll() {
    await delay(300);
    return [...crops];
  },

  async getById(id) {
    await delay(200);
    const crop = crops.find(c => c.Id === parseInt(id));
    if (!crop) {
      throw new Error('Crop not found');
    }
    return { ...crop };
  },

  async create(cropData) {
    await delay(400);
    const maxId = crops.length > 0 ? Math.max(...crops.map(c => c.Id)) : 0;
    const newCrop = {
      ...cropData,
      Id: maxId + 1
    };
    crops.push(newCrop);
    return { ...newCrop };
  },

  async update(id, cropData) {
    await delay(400);
    const index = crops.findIndex(c => c.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Crop not found');
    }
    crops[index] = { ...crops[index], ...cropData, Id: parseInt(id) };
    return { ...crops[index] };
  },

  async delete(id) {
    await delay(300);
    const index = crops.findIndex(c => c.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Crop not found');
    }
    crops.splice(index, 1);
    return true;
  }
};