import config from "../../config";
import { apiFetch } from "../../utils/basicApi";



function successOrThrow(data) {
  if (!data?.success) {
    throw new Error(data?.message || "Operation failed");
  }
  return { data };
}


export async function deletePermission({ id }) {
  if (!id) throw new Error("Permission ID is required for delete");

  const data = await apiFetch(
    `${config.USER_SERVICE_BASE_URL}/permissions/${id}`,
    { method: "DELETE" }
  );
  return successOrThrow(data);
}

export async function getAllPermissions({ page = 1 }) {
  const data = await apiFetch(
    `${config.USER_SERVICE_BASE_URL}/permissions?page=${page}`,
    { method: "GET" }
  );
  return successOrThrow(data);
}

export async function create({ pData }) {
  const data = await apiFetch(`${config.USER_SERVICE_BASE_URL}/permissions`, {
    method: "POST",
    body: pData,
  });
  return successOrThrow(data);
}


export async function update({ pData }) {
  if (!pData.id) throw new Error("Permission ID is required for update");

  const data = await apiFetch(
    `${config.USER_SERVICE_BASE_URL}/permissions/${pData.id}`,
    {
      method: "PUT",
      body: pData,
    }
  );
  return successOrThrow(data);
}


export async function getAllGroupedPermissions() {
  const data = await apiFetch(
    `${config.USER_SERVICE_BASE_URL}/permissions-grouped`,
    { method: "GET" }
  );
  return successOrThrow(data);
}

