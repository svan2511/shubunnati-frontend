import config from "../../config";


export function deletePermission({token ,Id}) {
  return new Promise(async (resolve ,reject) => {
    const response = await fetch(`${config.USER_SERVICE_BASE_URL}/permissions/${Id}`, {
      method: 'DELETE',
      headers: { 'content-type': 'application/json'  , 'Authorization': 'Bearer '+token },
    });
    const data = await response.json();
    data.success ? resolve({ data }) : reject({ message:data.message });
  });
}

export function getAllPermissions({ token, page = 1 }) {
  return new Promise(async (resolve ,reject) => {
    const response = await fetch(`${config.USER_SERVICE_BASE_URL}/permissions?page=${page}`,{
      method: 'GET',
      headers: { 'content-type': 'application/json' , 'Authorization': 'Bearer '+token },
    });
    const data = await response.json();
    data.success ? resolve({ data }) : reject({ message:data.message });
  });
}

export function create({token , pData}) {
  return new Promise(async (resolve ,reject) => {
    const response = await fetch(`${config.USER_SERVICE_BASE_URL}/permissions`,{
      method: 'POST',
      body: JSON.stringify(pData),
      headers: { 'content-type': 'application/json' , 'Authorization': 'Bearer '+token },
    });
    const data = await response.json();
    data.success ? resolve({ data }) : reject({ message:data.message });
  });
}


export function update({token , pData}) {
  return new Promise(async (resolve ,reject) => {
    const response = await fetch(`${config.USER_SERVICE_BASE_URL}/permissions/${pData.id}`,{
      method: 'PUT',
      body: JSON.stringify(pData),
      headers: { 'content-type': 'application/json' , 'Authorization': 'Bearer '+token },
    });
    const data = await response.json();
    data.success ? resolve({ data }) : reject({ message:data.message });
  });
}


export function getAllGroupedPermissions(token) {
  return new Promise(async (resolve ,reject) => {
    const response = await fetch(`${config.USER_SERVICE_BASE_URL}/permissions-grouped`,{
      method: 'GET',
      headers: { 'content-type': 'application/json' , 'Authorization': 'Bearer '+token },
    });
    const data = await response.json();
    data.success ? resolve({ data }) : reject({ message:data.message });
  });
}


