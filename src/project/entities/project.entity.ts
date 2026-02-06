import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { Generators } from "../../utils/generators";

@Entity({ tableName: "projects" })
export class ProjectEntity {
  static readonly PREFIX = "prj";

  @PrimaryKey()
  id = Generators.id(ProjectEntity.PREFIX);

  @Property()
  name!: string;

  @Property({ nullable: true })
  description?: string;

  @Property({ name: "created_at", type: "datetime", nullable: true })
  createdAt? = new Date();

  @Property({ name: "updated_at", type: "datetime", nullable: true, onUpdate: () => new Date() })
  updatedAt? = new Date();
}
