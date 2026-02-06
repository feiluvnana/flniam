import { Migration } from '@mikro-orm/migrations';

export class Migration20260206091034_AlterTimestampForProjectsTable extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table \`projects\` modify \`created_at\` datetime null, modify \`updated_at\` datetime null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table \`projects\` modify \`created_at\` datetime not null, modify \`updated_at\` datetime not null;`);
  }

}
