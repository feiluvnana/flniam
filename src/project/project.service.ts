import { EntityRepository, RequiredEntityData } from "@mikro-orm/mysql";
import { InjectRepository } from "@mikro-orm/nestjs";
import { Injectable } from "@nestjs/common";
import { ProjectEntity } from "./entities/project.entity";

@Injectable()
export class ProjectService {
  constructor(@InjectRepository(ProjectEntity) private readonly projectRepository: EntityRepository<ProjectEntity>) {}

  async createOneProject(input: RequiredEntityData<ProjectEntity>): Promise<ProjectEntity> {
    const project = this.projectRepository.create(input);
    await this.projectRepository.getEntityManager().persist(project).flush();
    return project;
  }
}
