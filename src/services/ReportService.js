import ApiService from './ApiService';
import Endpoints from '../utils/Endpoints';
import moment from 'moment';
import ReportTypes from '../utils/reports';
import {
  isPriceReport,
  isCashDrawerReport,
  isPurchaseReport,
  isSalesReport,
  isStockReport,
} from '../utils/reports';

class ReportService {
  static buildQuery({
    dateValFrom,
    dateValTo,
    stockGroup,
    warehouse,
  }) {
    let query = '';

    if (dateValFrom) {
      query += `?startDate=${encodeURIComponent(
        moment(dateValFrom.toISOString()).format('yyyy-MM-DD'),
      )}`;
    } 
    if (dateValTo) {
      query += `&endDate=${encodeURIComponent(
        moment(dateValTo.toISOString()).format('yyyy-MM-DD'),
      )}`;
    }
    if (stockGroup) {
      query += `&stockGroup=${encodeURIComponent(stockGroup)}`;
    }
    if (warehouse) {
      query += `&warehouse=${encodeURIComponent(warehouse)}`;
    }
    if (query.startsWith('&')) {
      query = '?' + query.slice(1);
    }
    return query;
  }

  static async fetchData(endPoint, query) {
    try {
      const res = await ApiService.get(`${endPoint}${query}`);
      return res.data.data;
    } catch (error) {
      throw new Error(error);
    }
  }

  static async fetchAllStocks() {
    try {
      const res = await ApiService.get(Endpoints.fetchStocks);
      const data = res.data.data;
      return data;
    } catch (err) {
      console.log('Fetch All Stock Groups: ', err);
      throw new Error(err);
    }
  }

  static async fetchAllWarehouses() {
    try {
      const res = await ApiService.get(Endpoints.fetchWarehouses);
      const data = res.data.data;
      return data;
    } catch (err) {
      console.log('Fetch All Warehouses: ', err);
      throw new Error(err);
    }
    
  }

  static async filterData({
    reportType,
    endPoints,
    dateValFrom,
    dateValTo,
    stockGroup,
    warehouse,
  }) {

    const query = this.buildQuery({
      dateValFrom,
      dateValTo,
      stockGroup,
      warehouse,
    });

    try {
      const data = await this.fetchData(endPoints, query);
      if (isPriceReport(reportType)) return data.data;
      if (isStockReport(reportType)) return processStockReportData(data);
      if (isCashDrawerReport(reportType)) return processCashDrawerReportData(data);
      if (isSalesReport(reportType) || isPurchaseReport(reportType))
        return processSalesReportData(data);
    } catch (error) {
      console.error(error);
      throw new Error(error);
    }
  }
}

function processCashDrawerReportData(response) {
  const mappedData = [];
  const data = response.data
  const lastEntry = data[data.length - 1];
  const totalRow = {};

  data.forEach(item => {
      const mappedItem = {};

      Object.keys(item).forEach(key => {
          if (!key.startsWith('Running')) {
              mappedItem[key] = item[key];
          }
      });

      mappedData.push(mappedItem);
  });

  const firstKey = Object.keys(data[0])[0];
  totalRow[firstKey] = "Total";

  Object.keys(lastEntry).forEach(key => {
      if (key.startsWith('Running')) {
          const baseKey = key.replace('Running', '');
          totalRow[baseKey] = lastEntry[key];
      }
  });

  mappedData.push(totalRow);

  return mappedData;
}

function processStockReportData(response) {
  const data = response.data;
  const result = [];

  if (data.length === 0) {
    return result;
  }

  data.forEach((item, index) => {
    const itemData = {};

    Object.keys(item).forEach(key => {
      if (key !== 'TotalBalance') {
        itemData[key] = item[key];
      }
    });

    result.push(itemData);

    if (index + 1 === data.length) {
      const totalData = {};
      Object.keys(item).forEach((key, index) => {
        if (index === 0) {
          totalData[key] = 'Total';
        } else if (key === 'Balance') {
          totalData[key] = item.TotalBalance;
        } else {
          if (key !== 'TotalBalance') totalData[key] = '';
        }
      });

      result.push(totalData);
    }
  });

  return result;
}

function processSalesReportData(response) {
  const data = response.data;
  const result = [];

  if (data.length === 0) {
    return result;
  }

  const keys = Object.keys(data[0]);
  data.forEach((item, index) => {
    const currency = item.Curr;

    const itemData = {};
    keys.forEach(key => {
      if (key !== 'SubTotal' && key !== 'AmountTaxTotal') {
        itemData[key] = item[key];
      }
    });
    result.push(itemData);
    if (index + 1 === data.length || data[index + 1].Curr !== currency) {
      const totalAmount = {};
      keys.forEach((key, index) => {
        if (index === 0) {
          totalAmount[key] = 'Total';
        }
        if (key === 'Curr') {
          totalAmount[key] = currency;
        } else if (key === 'Amount') {
          totalAmount[key] = item['SubTotal'];
        } else if (key === 'Amount Tax') {
          totalAmount[key] = item['AmountTaxTotal'];
        } else {
          if (index !== 0 && key !== 'SubTotal' && key !== 'AmountTaxTotal') {
            totalAmount[key] = '';
          }
        }
      });
      result.push(totalAmount);
    }
  });

  return result;
}

export default ReportService;
