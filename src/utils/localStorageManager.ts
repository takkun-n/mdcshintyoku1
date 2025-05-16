import { ProductionData } from '../types';

// ローカルストレージからデータを取得する
export const getProductionData = (): ProductionData[] => {
  const data = localStorage.getItem('productionData');
  return data ? JSON.parse(data) : [];
};

// ローカルストレージにデータを保存する
export const saveProductionData = (data: ProductionData[]): void => {
  localStorage.setItem('productionData', JSON.stringify(data));
};

// 新しい生産データを追加する
export const addProductionData = (newData: ProductionData): void => {
  const existingData = getProductionData();
  saveProductionData([...existingData, newData]);
};

// 既存の生産データを更新する
export const updateProductionData = (updatedData: ProductionData): void => {
  const existingData = getProductionData();
  const updatedList = existingData.map(item => 
    item.id === updatedData.id ? updatedData : item
  );
  saveProductionData(updatedList);
};

// 生産データを削除する
export const deleteProductionData = (id: string): void => {
  const existingData = getProductionData();
  const filteredData = existingData.filter(item => item.id !== id);
  saveProductionData(filteredData);
};

// 日付でデータをフィルタリングする
export const filterByDateRange = (startDate: string, endDate: string): ProductionData[] => {
  const data = getProductionData();
  return data.filter(item => {
    const itemDate = new Date(item.date);
    const start = new Date(startDate);
    const end = new Date(endDate);
    return itemDate >= start && itemDate <= end;
  });
};

// 製品名でデータをフィルタリングする
export const filterByProductName = (productName: string): ProductionData[] => {
  const data = getProductionData();
  return data.filter(item => 
    item.productName.toLowerCase().includes(productName.toLowerCase())
  );
};