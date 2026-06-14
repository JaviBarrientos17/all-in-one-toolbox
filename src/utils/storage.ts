import localforage from "localforage";

const editorStore = localforage.createInstance({
  name: "AllInOneToolbox",
  storeName: "image_editor_drafts",
});

export interface EditorDraft {
  id: string;
  name: string;
  blob: Blob;
  lastModified: number;
}

export const storage = {
  async saveDraft(id: string, name: string, blob: Blob): Promise<void> {
    const draft: EditorDraft = {
      id,
      name,
      blob,
      lastModified: Date.now(),
    };
    await editorStore.setItem(id, draft);
  },

  async getDraft(id: string): Promise<EditorDraft | null> {
    return await editorStore.getItem<EditorDraft>(id);
  },

  async getAllDrafts(): Promise<EditorDraft[]> {
    const drafts: EditorDraft[] = [];
    await editorStore.iterate((value: EditorDraft) => {
      drafts.push(value);
    });
    return drafts.sort((a, b) => b.lastModified - a.lastModified);
  },

  async deleteDraft(id: string): Promise<void> {
    await editorStore.removeItem(id);
  },

  async clearAllDrafts(): Promise<void> {
    await editorStore.clear();
  },
};
