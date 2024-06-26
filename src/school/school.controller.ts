import { Controller } from '@nestjs/common';
import { SchoolService } from './school.service';
import { CreateSchoolDto, EditSchoolDto } from './dto/school.dto';

@Controller('school')
export class SchoolController {
    constructor(private readonly schoolService:SchoolService) {}

    getSchools(){
        return this.schoolService.getSchools();
    }

    getSchool(id:number){
        return this.schoolService.getSchool(id);
    }

    createSchool(school:CreateSchoolDto){
        return this.schoolService.createSchool(school);
    }

    deleteSchool(id:number){
        return this.schoolService.deleteSchool(id);
    }

    updateSchool(id:number, school:EditSchoolDto){
        return this.schoolService.updateSchool(id, school);
    }

}
