import config from "../../config";


export function deleteMember({token ,Id}) {
  return new Promise(async (resolve ,reject) => {
    const response = await fetch(`${config.MEMBER_SERVICE_BASE_URL}/members/${Id}`, {
      method: 'DELETE',
      headers: { 'content-type': 'application/json'  , 'Authorization': 'Bearer '+token },
    });
    const data = await response.json();
    data.success ? resolve({ data }) : reject({ message:data.message });
  });
}

export function getAllMembers({ token, page = 1 }) {
  return new Promise(async (resolve ,reject) => {
    const response = await fetch(`${config.MEMBER_SERVICE_BASE_URL}/members?page=${page}`,{
      method: 'GET',
      headers: { 'content-type': 'application/json' , 'Authorization': 'Bearer '+token },
    });
    const data = await response.json();
    data.success ? resolve({ data }) : reject({ message:data.message });
  });
}

export function create({token , mData}) {
  return new Promise(async (resolve ,reject) => {
    const response = await fetch(`${config.MEMBER_SERVICE_BASE_URL}/members`,{
      method: 'POST',
      body: JSON.stringify(mData),
      headers: { 'content-type': 'application/json' , 'Authorization': 'Bearer '+token },
    });
    const data = await response.json();
    data.success ? resolve({ data }) : reject({ message:data.message });
  });
}


export function update({token , mData}) {
  return new Promise(async (resolve ,reject) => {
    const response = await fetch(`${config.MEMBER_SERVICE_BASE_URL}/members/${mData.id}`,{
      method: 'PUT',
      body: JSON.stringify(mData),
      headers: { 'content-type': 'application/json' , 'Authorization': 'Bearer '+token },
    });
    const data = await response.json();
    data.success ? resolve({ data }) : reject({ message:data.message });
  });
}


export function getSinglemember({ token, id }) {
  return new Promise(async (resolve ,reject) => {
    const response = await fetch(`${config.MEMBER_SERVICE_BASE_URL}/members/${id}`,{
      method: 'GET',
      headers: { 'content-type': 'application/json' , 'Authorization': 'Bearer '+token },
    });
    const data = await response.json();
    data.success ? resolve({ data }) : reject({ message:data.message });
  });
}


