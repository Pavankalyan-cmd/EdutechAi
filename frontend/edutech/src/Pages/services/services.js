import axios from "axios";
const BASE_URL = "http://127.0.0.1:8000";

export const fetchExpenses = (userName) => {
  return axios.get(`${BASE_URL}/expenses/${userName}/`);
};
export const addExpense = (expenseData) => {
  return axios.post(`${BASE_URL}/expenses/`,expenseData);
};

export const fetchIncome = (userName) => {
  return axios.get(`${BASE_URL}/incomes/${userName}/`);
};
export const addIncome = (incomeData) => {
  return axios.post(`${BASE_URL}/incomes/`,incomeData);
};
export const addUser=(userdata)=>{
  return axios.post(`${BASE_URL}/users/`,userdata)
}
export const fetchuser=(id)=>{
  return axios.get(`${BASE_URL}/users/${id}`)
}
export const deleteData = (type, id) => {
  if (type === "Income") {
    console.log(type);
    return axios.delete(`${BASE_URL}/incomes/${id}/`);
  } else if (type==="Expense") {
    return axios.delete(`${BASE_URL}/expenses/${id}/`);
  }else{
    return axios.delete(`${BASE_URL}/users/${id}`)

  }
};
