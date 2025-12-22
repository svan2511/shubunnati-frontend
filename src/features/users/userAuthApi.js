import config from "../../config";
import { apiFetch } from "../../utils/basicApi";

function successOrThrow(data) {
  if (!data?.success) {
    throw new Error(data?.message || "Operation failed");
  }
  return { data };
}

export async function fetchLoginUser(userdata) {
  const data = await apiFetch(
    `${config.USER_SERVICE_BASE_URL}/login`,
    {
      method: "POST",
      body: userdata,
    }
  );

  return successOrThrow(data);
}


export async function fetchLogoutUser() {
  const data = await apiFetch(
    `${config.USER_SERVICE_BASE_URL}/logout`,
    {
      method: "POST",
    }
  );

  return successOrThrow(data);
}


export async function deleteUser({ userId }) {
  const data = await apiFetch(
    `${config.USER_SERVICE_BASE_URL}/users/${userId}`,
    {
      method: "DELETE",
    }
  );

  return successOrThrow(data);
}


export async function getAllUsers({ page = 1 }) {
  const data = await apiFetch(
    `${config.USER_SERVICE_BASE_URL}/users?page=${page}`
  );

  return successOrThrow(data);
}

export async function create({ userdata }) {
  const data = await apiFetch(
    `${config.USER_SERVICE_BASE_URL}/users`,
    {
      method: "POST",
      body: userdata,
    }
  );

  return successOrThrow(data);
}


export async function update({ userdata }) {
  const data = await apiFetch(
    `${config.USER_SERVICE_BASE_URL}/users/${userdata.user_id}`,
    {
      method: "PUT",
      body: userdata,
    }
  );

  return successOrThrow(data);
}