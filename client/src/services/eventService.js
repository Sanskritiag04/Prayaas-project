import axios from "axios";

const API_URL = "http://localhost:5000/api/events";

export const getEvents = (type) =>
  axios.get(`${API_URL}?type=${type}`);