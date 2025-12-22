import config from "../../config";
import { apiFetch } from "../../utils/basicApi";

function successOrThrow(data) {
  if (!data?.success) {
    throw new Error(data?.message || "Operation failed");
  }
  return { data };
}


export async function deleteCenter({ Id }) {
  const data = await apiFetch(
    `${config.MEMBER_SERVICE_BASE_URL}/centers/${Id}`,
    { method: "DELETE" }
  );
  return successOrThrow(data);
}



export async function getAllCenters({ page = 1 }) {
  const data = await apiFetch(
    `${config.MEMBER_SERVICE_BASE_URL}/centers?page=${page}`
  );
  return successOrThrow(data);
}

export async function create({ centerData }) {
  const data = await apiFetch(
    `${config.MEMBER_SERVICE_BASE_URL}/centers`,
    {
      method: "POST",
      body: centerData,
    }
  );
  return successOrThrow(data);
}


export async function update({ centerData }) {
  const data = await apiFetch(
    `${config.MEMBER_SERVICE_BASE_URL}/centers/${centerData.id}`,
    {
      method: "PUT",
      body: centerData,
    }
  );
  return successOrThrow(data);
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


