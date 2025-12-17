import config from "../../config";


export function deleteRole({token ,Id}) {
  return new Promise(async (resolve ,reject) => {
    const response = await fetch(`${config.USER_SERVICE_BASE_URL}/roles/${Id}`, {
      method: 'DELETE',
      headers: { 'content-type': 'application/json'  , 'Authorization': 'Bearer '+token },
    });
    const data = await response.json();
    data.success ? resolve({ data }) : reject({ message:data.message });
  });
}

export function getAllRoles({ token, page = 1 }) {
  
  const url = page === "ALL" ? `${config.USER_SERVICE_BASE_URL}/roles` : `${config.USER_SERVICE_BASE_URL}/roles?page=${page}`;
  return new Promise(async (resolve ,reject) => {
    const response = await fetch(url,{
      method: 'GET',
      headers: { 'content-type': 'application/json' , 'Authorization': 'Bearer '+token },
    });
    const data = await response.json();
    data.success ? resolve({ data }) : reject({ message:data.message });
  });
}

export function create({token , roleData}) {
  return new Promise(async (resolve ,reject) => {
    const response = await fetch(`${config.USER_SERVICE_BASE_URL}/roles`,{
      method: 'POST',
      body: JSON.stringify(roleData),
      headers: { 'content-type': 'application/json' , 'Authorization': 'Bearer '+token },
    });
    const data = await response.json();
    data.success ? resolve({ data }) : reject({ message:data.message });
  });
}


export function update({token , roleData}) {
  console.log(roleData);
  return new Promise(async (resolve ,reject) => {
    const response = await fetch(`${config.USER_SERVICE_BASE_URL}/roles/${roleData.id}`,{
      method: 'PUT',
      body: JSON.stringify(roleData),
      headers: { 'content-type': 'application/json' , 'Authorization': 'Bearer '+token },
    });
    const data = await response.json();
    data.success ? resolve({ data }) : reject({ message:data.message });
  });
}



