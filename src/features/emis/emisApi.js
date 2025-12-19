import config from "../../config";

export function update({token , emiData}) {
  
  return new Promise(async (resolve ,reject) => {
    const response = await fetch(`${config.MEMBER_SERVICE_BASE_URL}/emis/${emiData.id}`,{
      method: 'PUT',
      body: JSON.stringify(emiData),
      headers: { 'content-type': 'application/json' , 'Authorization': 'Bearer '+token },
    });
    const data = await response.json();
    data.success ? resolve({ data }) : reject({ message:data.message });
  });
}

export function getDashboardData({token , filterData} ) {
  return new Promise(async (resolve ,reject) => {
    const response = await fetch(`${config.MEMBER_SERVICE_BASE_URL}/dashboard-data`,{
      method: 'GET',
      headers: { 'content-type': 'application/json' , 'Authorization': 'Bearer '+token },
    });
    const data = await response.json();
    data.success ? resolve({ data }) : reject({ message:data.message });
  });
}