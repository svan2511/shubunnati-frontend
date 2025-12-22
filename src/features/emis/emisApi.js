import config from "../../config";
import { apiFetch } from "../../utils/basicApi";

function successOrThrow(data) {
  if (!data?.success) {
    throw new Error(data?.message || "Operation failed");
  }
  return { data };
}

export async function update({ emiData }) {
  const data = await apiFetch(
    `${config.MEMBER_SERVICE_BASE_URL}/emis/${emiData.id}`,
    {
      method: "PUT",
      body: emiData,
    }
  );

  return successOrThrow(data);
}

export async function getDashboardData({ filterData } = {}) {
  const data = await apiFetch(
    `${config.MEMBER_SERVICE_BASE_URL}/dashboard-data`
  );

  return successOrThrow(data);
}