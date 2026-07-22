export type FacadeId = 'paint'|'light-veneer'|'dark-veneer'|'frame';
export type TopId = 'compact'|'stone'|'quartz';
export const facades = [
 {id:'paint',name:'Матовая окраска',note:'Спокойная ровная поверхность, легко подобрать оттенок.',texture:'paint'},
 {id:'light-veneer',name:'Светлый шпон',note:'Живой рисунок дерева и мягкий контраст.',texture:'lightWood'},
 {id:'dark-veneer',name:'Тёмный шпон',note:'Глубокий тон, заметная текстура волокон.',texture:'darkWood'},
 {id:'frame',name:'Рамочный фасад',note:'Тонкий рельеф для более домашнего ритма.',texture:'frame'}
] as const;
export const countertops = [
 {id:'compact',name:'Компакт-плита',note:'Тонкий профиль и практичная кромка.',texture:'compact'},
 {id:'stone',name:'Искусственный камень',note:'Плавные стыки и спокойная фактура.',texture:'stone'},
 {id:'quartz',name:'Кварцевый агломерат',note:'Выраженная минеральная поверхность.',texture:'quartz'}
] as const;
export const handles=[{id:'profile',name:'Профиль',note:'Линия захвата без выступающей ручки.'},{id:'bar',name:'Скоба',note:'Чёткий металлический акцент.'},{id:'knob',name:'Кнопка',note:'Небольшая деталь для рамочных фасадов.'}];
