import { databaseAccess } from "@/src/modules/database/data-access";

export const databaseService = {
  organizations: databaseAccess.organizations,
  profiles: databaseAccess.profiles,
  memberships: databaseAccess.memberships,
  audits: databaseAccess.audits,
  storage: databaseAccess.storage,
};
