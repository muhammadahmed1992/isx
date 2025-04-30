import { Endpoints } from '../utils';
import ApiService from './ApiService';

export class TransactionService {
  static async fetchInvoiceFormData(endPoint, loggedInUser) {
    try {
      const res = await ApiService.get(endPoint.replace('{user}', loggedInUser));
      return res.data;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  static async fetchTableFormData(endpoint) {
    try {
      const res = await ApiService.get(endpoint);
      return res;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  static async fetchCustomers() {
    try {
      const res = await ApiService.get(Endpoints.fetchCustomers);
      return res.data;
    }
    catch (err) {
      throw new Error(err.message);
    }
  }
  static async fetchSalesmen() {
    try {
      const res = await ApiService.get(Endpoints.fetchSalesmen);
      return res.data;
    }
    catch (err) {
      throw new Error(err.message);
    }
  }
  static async fetchStockNames(endPoint) {
    try {
      const res = await ApiService.get(endPoint);
      return res.data;
    }
    catch (err) {
      throw new Error(err.message);
    }
  }
  static async postInvoiceFormData(endPoint, body) {
    try {
      const res = await ApiService.post(endPoint, body);
      return res;
    }
    catch (err) {
      console.error(err);
      throw new Error(err.message);
    }
  }
}
