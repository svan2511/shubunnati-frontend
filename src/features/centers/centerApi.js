import config from "../../config";


export function deleteCenter({token ,Id}) {
  return new Promise(async (resolve ,reject) => {
    const response = await fetch(`${config.MEMBER_SERVICE_BASE_URL}/centers/${Id}`, {
      method: 'DELETE',
      headers: { 'content-type': 'application/json'  , 'Authorization': 'Bearer '+token },
    });
    const data = await response.json();
    data.success ? resolve({ data }) : reject({ message:data.message });
  });
}

export function getAllCenters({ token, page = 1 }) {
  return new Promise(async (resolve ,reject) => {
    const response = await fetch(`${config.MEMBER_SERVICE_BASE_URL}/centers?page=${page}`,{
      method: 'GET',
      headers: { 'content-type': 'application/json' , 'Authorization': 'Bearer '+token },
    });
    const data = await response.json();
    data.success ? resolve({ data }) : reject({ message:data.message });
  });
}

export function create({token , centerData}) {
  return new Promise(async (resolve ,reject) => {
    const response = await fetch(`${config.MEMBER_SERVICE_BASE_URL}/centers`,{
      method: 'POST',
      body: JSON.stringify(centerData),
      headers: { 'content-type': 'application/json' , 'Authorization': 'Bearer '+token },
    });
    const data = await response.json();
    data.success ? resolve({ data }) : reject({ message:data.message });
  });
}


export function update({token , centerData}) {
  return new Promise(async (resolve ,reject) => {
    const response = await fetch(`${config.MEMBER_SERVICE_BASE_URL}/centers/${centerData.id}`,{
      method: 'PUT',
      body: JSON.stringify(centerData),
      headers: { 'content-type': 'application/json' , 'Authorization': 'Bearer '+token },
    });
    const data = await response.json();
    data.success ? resolve({ data }) : reject({ message:data.message });
  });
}


// export function getAllGroupedcenters(token) {
//   return new Promise(async (resolve ,reject) => {
//     const response = await fetch(`${config.MEMBER_SERVICE_BASE_URL}/centers-grouped`,{
//       method: 'GET',
//       headers: { 'content-type': 'application/json' , 'Authorization': 'Bearer '+token },
//     });
//     const data = await response.json();
//     data.success ? resolve({ data }) : reject({ message:data.message });
//   });
// }


