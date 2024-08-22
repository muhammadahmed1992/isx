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
  static buildQuery({dateValFrom, dateValTo, stockGroup, warehouse}) {
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
      if (isCashDrawerReport(reportType))
        return processCashDrawerReportData(data);
      if (isSalesReport(reportType) || isPurchaseReport(reportType))
        return processSalesOrPurchaseReportData(data);
    } catch (error) {
      console.error(error);
      throw new Error(error);
    }
  }
}

function processCashDrawerReportData(response) {
  const runningKey = 'running_';
  const mappedData = [];
  const data = response.data;
  const lastEntry = data[data.length - 1];
  const totalRow = {};

  data.forEach(item => {
    const mappedItem = {};

    Object.keys(item).forEach(key => {
      if (!key.startsWith(runningKey)) {
        mappedItem[key] = item[key];
      }
    });

    mappedData.push(mappedItem);
  });

  const firstKey = Object.keys(data[0])[0];
  totalRow[firstKey] = 'Total';

  Object.keys(lastEntry).forEach(key => {
    if (key.startsWith(runningKey)) {
      const baseKey = key.replace(runningKey, '');
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
      if (key !== 'total_balance_header') {
        itemData[key] = item[key];
      }
    });

    result.push(itemData);

    if (index + 1 === data.length) {
      const totalData = {};
      Object.keys(item).forEach((key, index) => {
        if (index === 0) {
          totalData[key] = 'Total';
        } else if (key === 'balance_header') {
          totalData[key] = item.total_balance_header;
        } else {
          if (key !== 'total_balance_header') totalData[key] = '';
        }
      });

      result.push(totalData);
    }
  });

  return result;
}

function processSalesOrPurchaseReportData(response) {
  const data = response.data;
  const result = [];

  if (data.length === 0) {
    return result;
  }

  const keys = Object.keys(data[0]);
  data.forEach((item, index) => {
    const currency = item.currency_header;

    const itemData = {};
    keys.forEach(key => {
      if (key !== 'subtotal_header' && key !== 'amount_tax_total_header') {
        itemData[key] = item[key];
      }
    });
    result.push(itemData);
    if (index + 1 === data.length || data[index + 1].Currency !== currency) {
      const totalAmount = {};
      keys.forEach((key, index) => {
        if (index === 0) {
          totalAmount[key] = 'Total';
        }
        if (key === 'currency_header') {
          totalAmount[key] = currency;
        } else if (key === 'amount_header') {
          totalAmount[key] = item['subtotal_header'];
        } else if (key === 'amount_tax_header') {
          totalAmount[key] = item['amount_tax_total_header'];
        } else {
          if (
            index !== 0 &&
            key !== 'subtotal_header' &&
            key !== 'amount_tax_total_header'
          ) {
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
