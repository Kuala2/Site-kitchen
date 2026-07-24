import {describe,expect,it} from 'vitest';
import {projects} from '@/data/projects';

describe('данные концептов',()=>{
  it('не повторяют фотографии между проектами',()=>{
    const images=projects.flatMap(project=>project.gallery.map(image=>image.src));
    expect(new Set(images).size).toBe(images.length);
  });
  it('содержат основные размеры и два материальных референса',()=>{
    for(const project of projects){expect(project.dimensions).toBeTruthy();expect(project.gallery).toHaveLength(3);}
  });
  it('помечают все сгенерированные изображения в подписи',()=>{
    for(const image of projects.flatMap(project=>project.gallery))if(image.generated)expect(image.caption).toMatch(/Сгенерированный/);
  });
});
