import localforage from 'localforage';

const outputStore = localforage.createInstance({
  name: "AllInOneToolbox",
  storeName: "processed_outputs"
});

export interface ProcessedFile {
  id: string;
  name: string;
  type: string;
  blob: Blob;
  timestamp: number;
  category: 'image' | 'pdf' | 'document' | 'video';
}

export const outputStorage = {
  async saveOutput(name: string, type: string, blob: Blob, category: ProcessedFile['category']): Promise<string> {
    const id = Date.now().toString();
    const file: ProcessedFile = {
      id,
      name,
      type,
      blob,
      timestamp: Date.now(),
      category
    };
    await outputStore.setItem(id, file);
    return id;
  },

  async getAllOutputs(): Promise<ProcessedFile[]> {
    const files: ProcessedFile[] = [];
    await outputStore.iterate((value: ProcessedFile) => {
      files.push(value);
    });
    return files.sort((a, b) => b.timestamp - a.timestamp);
  },

  async deleteOutput(id: string): Promise<void> {
    await outputStore.removeItem(id);
  },

  async clearAll(): Promise<void> {
    await outputStore.clear();
  }
};
