import config from "../../config";

// A mock function to mimic making an async request for data
export function fetchLoginUser(userdata) {
  return new Promise(async (resolve , reject) => {
    const response = await fetch(`${config.USER_SERVICE_BASE_URL}/login`, {
      method: 'POST',
      body: JSON.stringify(userdata),
      headers: { 'content-type': 'application/json' },
    });
    const data = await response.json();
    data.success ? resolve({ data }) : reject({ message:data.message });
  });
}

// A mock function to mimic making an async request for data
export function fetchLogoutUser(token) {
  return new Promise(async (resolve , reject) => {
    const response = await fetch(`${config.USER_SERVICE_BASE_URL}/logout`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' ,'Accept': 'application/json', 'Authorization': 'Bearer '+token },
    });
    const data = await response.json();
    data.success ? resolve({ data }) : reject({ message:data.message });
  });
}


export function deleteUser({token ,userId}) {
  return new Promise(async (resolve ,reject) => {
    const response = await fetch(`${config.USER_SERVICE_BASE_URL}/users/${userId}`, {
      method: 'DELETE',
      headers: { 'content-type': 'application/json'  , 'Authorization': 'Bearer '+token },
    });
    const data = await response.json();
    data.success ? resolve({ data }) : reject({ message:data.message });
  });
}

export function getAllUsers({ token, page = 1 }) {
  return new Promise(async (resolve ,reject) => {
    const response = await fetch(`${config.USER_SERVICE_BASE_URL}/users?page=${page}`,{
      method: 'GET',
      headers: { 'content-type': 'application/json' , 'Authorization': 'Bearer '+token },
    });
    const data = await response.json();
    data.success ? resolve({ data }) : reject({ message:data.message });
  });
}

export function create({token , userdata}) {
  return new Promise(async (resolve ,reject) => {
    const response = await fetch(`${config.USER_SERVICE_BASE_URL}/users`,{
      method: 'POST',
      body: JSON.stringify(userdata),
      headers: { 'content-type': 'application/json' , 'Authorization': 'Bearer '+token },
    });
    const data = await response.json();
    data.success ? resolve({ data }) : reject({ message:data.message });
  });
}


export function update({token , userdata}) {
  return new Promise(async (resolve ,reject) => {
    const response = await fetch(`${config.USER_SERVICE_BASE_URL}/users/${userdata.user_id}`,{
      method: 'PUT',
      body: JSON.stringify(userdata),
      headers: { 'content-type': 'application/json' , 'Authorization': 'Bearer '+token },
    });
    const data = await response.json();
    data.success ? resolve({ data }) : reject({ message:data.message });
  });
}
