import { Migration } from "@mikro-orm/migrations";

export class Migration20260206083711_AddProjectsTable extends Migration {
  override up(): void {
    this.addSql(
      `create table \`projects\` (\`id\` varchar(255) not null, \`name\` varchar(255) not null, \`description\` varchar(255) null, \`created_at\` datetime not null, \`updated_at\` datetime not null, primary key (\`id\`)) default character set utf8mb4 engine = InnoDB;`,
    );
  }

  override down(): void {
    this.addSql(`drop table if exists \`projects\`;`);
  }
}
