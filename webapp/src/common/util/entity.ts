/**
 * index entities by key in form of plain old javascript object
 * @param entities
 * @param keySelector function that selects key from entity
 * @param unique when key is uniuqe set `true` to map key to single entity otherwise set `false` to map all entities for key
 */
function indexByKey<T, B extends boolean>(entities: T[], keySelector: (entity: T) => string | number, unique: B) {
  return entities.reduce((indexed, entity) => {
    if (typeof entity === 'undefined') return indexed;
    const indexKey = keySelector(entity);
    if (unique) {
      (indexed[indexKey] as T) = entity;
    } else {
      indexed[indexKey] = indexed[indexKey] || [];
      (indexed[indexKey] as T[]).push(entity);
    }
    return indexed;
  }, {} as B extends true ? IndexedEntities<T> : IndexedEntities<T[]>);
};

// type for key indexed entities
export interface IndexedEntities<T> {
  [indexKey: string]: T;
};

// type for function that maps entity to new embeding properties
export type Mapper<E, R> = { (entry: E): R };

/**
 * denormalize entities by embeding other associated entities
 * @param entitiesOrIndexedEntities can be either entities(array of objects) or indexedEntities(object)
 * @param mapper
 */
function denormalize<C, M, P>(entities: C[], oneToOneMapper: Mapper<C, M>): Array<C & M>;
function denormalize<C, M, P>(indexedEntities: IndexedEntities<C[]>, manyToOneMapper: Mapper<C, M>): IndexedEntities<Array<C & M>>;
function denormalize<C, M, P>(indexedEntities: IndexedEntities<C>, oneToOneMapper: Mapper<C, M>): IndexedEntities<C & M>;
function denormalize<C, M, P>(entitiesOrIndexedEntities: C[] | IndexedEntities<C[]> | IndexedEntities<C>, manyToOneMapperOroneToOneMapper: Mapper<C, M> | Mapper<C[], M>): Array<C & M> | IndexedEntities<Array<C & M>> | IndexedEntities<C & M> {
  function embedEntity<T>(entity: T) {
    if (typeof entity === 'undefined') return;
    return Object.assign(manyToOneMapperOroneToOneMapper.call(manyToOneMapperOroneToOneMapper, entity) as M, entity);
  }
  if (Array.isArray(entitiesOrIndexedEntities)) {
    return entitiesOrIndexedEntities.map(embedEntity) as C extends any[] ? Array<C[number] & M> : Array<C & M>;
  } else if (typeof entitiesOrIndexedEntities === 'object') {
    return Object.keys(entitiesOrIndexedEntities).reduce((denormalzed, indexedKey) => {
      const entity = entitiesOrIndexedEntities[indexedKey];
      denormalzed[indexedKey] = Array.isArray(entity)
        ? entity.map(embedEntity) as Array<C & M>
        : embedEntity(entity) as C & M;
      return denormalzed;
    }, {});
  }
};

export {
  indexByKey,
  denormalize
}
