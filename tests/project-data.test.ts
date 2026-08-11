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
  it('содержат минимум семь концептов и три некухонных направления',()=>{
    expect(projects.length).toBeGreaterThanOrEqual(7);
    expect(new Set(projects.filter(project=>!project.calculatorCompatible).map(project=>project.category)).size).toBeGreaterThanOrEqual(3);
  });
  it('не отправляют некухонные концепты в кухонный калькулятор',()=>{
    for(const project of projects.filter(project=>project.category!=='kitchen'))expect(project.calculatorCompatible).toBe(false);
  });
});
