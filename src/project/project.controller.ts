import { Body, Controller, Post } from "@nestjs/common";
import {
  CreateOneProjectInputDto,
  CreateOneProjectOutputDto,
  createOneProjectOutputSchema,
} from "./dtos/create-project.dto";
import { ProjectService } from "./project.service";

@Controller("projects")
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post("")
  async createOneProject(@Body() dto: CreateOneProjectInputDto): Promise<CreateOneProjectOutputDto> {
    return createOneProjectOutputSchema.parse(await this.projectService.createOneProject(dto));
  }
}
