import type {ProjectComposition} from '@/data/projects';

export function FurniturePlan({type,label}:{type:ProjectComposition;label:string}){
  return <div className={`furniturePlan furniturePlan--${type}`} role="img" aria-label={label}>
    <div className="furniturePlanScale"><span>0</span><i/><span>1 м</span><i/><span>2 м</span><i/><span>3 м</span></div>
    <div className="furnitureElevation">
      <i className="furnitureModule moduleTall"/><i className="furnitureModule moduleOpen"/><i className="furnitureModule moduleWide"/><i className="furnitureModule moduleTall"/>
      <span className="planCaption">фронтальная проекция · условная схема</span>
    </div>
    <div className="furnitureNotes"><span>закрытое хранение</span><span>{type==='workspace'?'рабочая поверхность':'открытая ниша'}</span><span>технический зазор</span></div>
  </div>;
}
