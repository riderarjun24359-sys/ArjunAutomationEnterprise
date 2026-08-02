import { OrganizationRepository } from "@/src/modules/database/repositories/organization-repository";
import { ProfileRepository } from "@/src/modules/database/repositories/profile-repository";
import { MembershipRepository } from "@/src/modules/database/repositories/membership-repository";
import { AuditRepository } from "@/src/modules/database/repositories/audit-repository";
import { StorageRepository } from "@/src/modules/database/repositories/storage-repository";

export class DatabaseAccessLayer {
  readonly organizations: OrganizationRepository;
  readonly profiles: ProfileRepository;
  readonly memberships: MembershipRepository;
  readonly audits: AuditRepository;
  readonly storage: StorageRepository;

  constructor() {
    this.organizations = new OrganizationRepository();
    this.profiles = new ProfileRepository();
    this.memberships = new MembershipRepository();
    this.audits = new AuditRepository();
    this.storage = new StorageRepository();
  }
}

export const databaseAccess = new DatabaseAccessLayer();
