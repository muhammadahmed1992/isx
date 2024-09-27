import {Endpoints} from '../utils';
import ApiService from './ApiService';

export class TransactionService {
  static async fetchInvoiceFormData(endPoint, loggedInUser) {
    try {
      const query = `?loggedInUser=${loggedInUser}`;
      const res = await ApiService.get(endPoint, query);
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
    const res = await ApiService.get(Endpoints.fetchCustomers);
    return res.data;
  }
  static async fetchSalesmen() {
    const res = await ApiService.get(Endpoints.fetchSalesmen);
    return res.data;
  }
  static async postInvoiceFormData(endPoint, body) {
    const res = await ApiService.post(endPoint, body);
    return res;
  }
}
