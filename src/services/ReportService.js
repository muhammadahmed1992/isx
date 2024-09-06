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
    stocks,
    warehouses,
  }) {
    let query = '';

    if (dateValFrom) {
      query += `?startDate=${encodeURIComponent(
        moment(dateValFrom, 'DD-MM-YYYY').format('yyyy-MM-DD'),
      )}`;
    }
    if (dateValTo) {
      query += `&endDate=${encodeURIComponent(
        moment(dateValTo, 'DD-MM-YYYY').format('yyyy-MM-DD'),
      )}`;
    }
    if (stockGroup) {
      query += `&stockGroup=${encodeURIComponent(
        stocks.find(s => s.cgrpdesc === stockGroup).cgrppk,
      )}`;
    }
    if (warehouse) {
      query += `&warehouse=${encodeURIComponent(
        warehouses.find(w => w.cwhsdesc === warehouse).cwhspk,
      )}`;
    }
    if (query.startsWith('&')) {
      query = '?' + query.slice(1);
    }
    return query;
  }

  static async fetchData(endPoint, query) {
    try {
      const res = await ApiService.get(`${endPoint}${query}`);
      return res.data;
    } catch (error) {
      throw new Error(error?.message);
    }
  }

  static async fetchAllStocks() {
    try {
      const res = await ApiService.get(Endpoints.fetchStocks);
      const data = res.data.data;
      return data;
    } catch (err) {
      throw new Error(err);
    }
  }

  static async fetchAllWarehouses() {
    try {
      const res = await ApiService.get(Endpoints.fetchWarehouses);
      const data = res.data.data;
      return data;
    } catch (err) {
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
    stocks,
    warehouses,
  }) {

    const query = this.buildQuery({
      dateValFrom,
      dateValTo,
      stockGroup,
      warehouse,
      stocks,
      warehouses,
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
      throw new Error(error);
    }
  }
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
    if (
      index + 1 === data.length ||
      data[index + 1].currency_header !== currency
    ) {
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

function processCashDrawerReportData(response) {
  const runningKey = 'running_';
  const mappedData = [];
  const data = response.data;
  const lastEntry = data[data.length - 1];
  const totalRow = {};
  data.forEach(item => {
    const mappedItem = {};

    Object.keys(item).forEach(key => {
      if (!key.includes(runningKey)) {
        mappedItem[key] = item[key];
      }
    });

    mappedData.push(mappedItem);
  });

  const firstKey = Object.keys(data[0])[0];
  totalRow[firstKey] = 'Total';
  Object.keys(lastEntry).forEach(key => {
    if (key.includes(runningKey)) {
      const baseKey = key.replace(runningKey, '');
      totalRow[baseKey] = lastEntry[key];
    }
    if (key.includes('date_header')) {
      totalRow[key] = "";
    }
  });

  mappedData.push(totalRow);

  return mappedData;
}

export default ReportService;
