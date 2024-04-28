import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Inject } from "@nestjs/common";
import { QuizzesService } from './quizzes.service';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { UpdateQuizDto } from './dto/update-quiz.dto';


@Controller('quizzes')
export class QuizzesController {
  constructor(@Inject(QuizzesService) private quizzesService: QuizzesService) {}

  @Post()
  create(@Body() createQuizDto: CreateQuizDto) {
    return this.quizzesService.create(createQuizDto);
  }

  @Get()
  findAll() {
    return this.quizzesService.findAll();
  }

  @Get(':id')
  async findOneWithQuestions(@Param('id') id: string) {
    const quiz=await this.quizzesService.findOne(id);
    return quiz.questions;
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateQuizDto: UpdateQuizDto) {
    return this.quizzesService.update(id, updateQuizDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.quizzesService.remove(id);
  }
}
