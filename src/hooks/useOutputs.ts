import { useState, useEffect, useCallback } from 'react';
import { outputStorage, ProcessedFile } from '../utils/outputStorage';

export function useOutputs() {
  const [outputs, setOutputs] = useState<ProcessedFile[]>([]);
  const [loading, setLoading] = useState(true);

  const loadOutputs = useCallback(async () => {
    setLoading(true);
    const files = await outputStorage.getAllOutputs();
    setOutputs(files);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadOutputs();
  }, [loadOutputs]);

  const addOutput = async (name: string, type: string, blob: Blob, category: ProcessedFile['category']) => {
    await outputStorage.saveOutput(name, type, blob, category);
    await loadOutputs();
  };

  const removeOutput = async (id: string) => {
    await outputStorage.deleteOutput(id);
    await loadOutputs();
  };

  const clearOutputs = async () => {
    await outputStorage.clearAll();
    await loadOutputs();
  };

  return {
    outputs,
    loading,
    addOutput,
    removeOutput,
    clearOutputs,
    refresh: loadOutputs
  };
}
