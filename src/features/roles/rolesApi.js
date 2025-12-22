import config from "../../config";
import { apiFetch } from "../../utils/basicApi";

function successOrThrow(data) {
  if (!data?.success) {
    throw new Error(data?.message || "Operation failed");
  }
  return { data };
}

export async function deleteRole({ id }) {
  if (!id) throw new Error("Role ID is required for delete");

  const data = await apiFetch(`${config.USER_SERVICE_BASE_URL}/roles/${id}`, {
    method: "DELETE",
  });

  return successOrThrow(data);
}

export async function getAllRoles({ page = 1 }) {
  const url =
    page === "ALL"
      ? `${config.USER_SERVICE_BASE_URL}/roles`
      : `${config.USER_SERVICE_BASE_URL}/roles?page=${page}`;

  const data = await apiFetch(url, { method: "GET" });
  return successOrThrow(data);
}


export async function create({ roleData }) {
  const data = await apiFetch(`${config.USER_SERVICE_BASE_URL}/roles`, {
    method: "POST",
    body: roleData,
  });

  return successOrThrow(data);
}


export async function update({ roleData }) {
  if (!roleData.id) throw new Error("Role ID is required for update");

  const data = await apiFetch(
    `${config.USER_SERVICE_BASE_URL}/roles/${roleData.id}`,
    {
      method: "PUT",
      body: roleData,
    }
  );

  return successOrThrow(data);
}
