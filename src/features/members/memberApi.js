import config from "../../config";
import { apiFetch } from "../../utils/basicApi";


function successOrThrow(data) {
  if (!data?.success) {
    throw new Error(data?.message || "Operation failed");
  }
  return { data };
}

export async function deleteMember({ Id }) {
  const data = await apiFetch(
    `${config.MEMBER_SERVICE_BASE_URL}/members/${Id}`,
    { method: "DELETE" }
  );
  return successOrThrow(data);
}

export async function getAllMembers({ page = 1 , centerId}) {
  const data = await apiFetch(
    `${config.MEMBER_SERVICE_BASE_URL}/members?page=${page}&centerId=${centerId}`
  );
  return successOrThrow(data);
}

export async function create({ mData }) {
  const data = await apiFetch(
    `${config.MEMBER_SERVICE_BASE_URL}/members`,
    {
      method: "POST",
      body: mData,
    }
  );
  return successOrThrow(data);
}

export async function update({ mData }) {
  const data = await apiFetch(
    `${config.MEMBER_SERVICE_BASE_URL}/members/${mData.id}`,
    {
      method: "PUT",
      body: mData,
    }
  );
  return successOrThrow(data);
}


export async function getSinglemember({ id }) {
  const data = await apiFetch(
    `${config.MEMBER_SERVICE_BASE_URL}/members/${id}`
  );
  return successOrThrow(data);
}
