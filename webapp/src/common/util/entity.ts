import memoize from 'lodash.memoize';

// two functions below(_indexByKeyInner, _indexByKeyMomoized) are used for indexByKey function which is type-wrapping function
// because `@types/lodash.memoize` doesn't support return type of memoized function

function _indexByKeyInner<T, B extends boolean>(entities: T[], keySelector: (entity: T) => string, unique: B) {
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

const _indexByKeyMomoized = memoize(_indexByKeyInner);

/**
 * index entities by key in form of plain old javascript object
 * @param entities
 * @param keySelector function that selects key from entity
 * @param unique when key is uniuqe set `true` to map key to single entity otherwise set `false` to map all entities for key
 */
const indexByKey = function <T, B extends boolean>(entities: T[], keySelector: (entity: T) => string, unique: B) {
  return _indexByKeyMomoized(entities, keySelector, unique) as B extends true ? IndexedEntities<T> : IndexedEntities<T[]>;
};

// type for key indexed entities
export interface IndexedEntities<T> {
  [indexKey: string]: T;
};

// type for function that maps entity to new embeding properties
export type Mapper<E, R> = { (entry: E): R };

/**
 * denormalize entities by embeding other associated entities
 * @param indexedEntities
 * @param mapper
 */
function denormalize<C, M, P>(indexedEntities: IndexedEntities<C>, mapper: Mapper<C extends any[] ? C[number] : C, M>) {
  function embedEntity<T>(entity: T) {
    if (typeof entity === 'undefined') return;
    return Object.assign(mapper.call(mapper, entity) as M, entity);
  }

  return Object.keys(indexedEntities).reduce((denormalzed, indexedKey) => {
    const entity = indexedEntities[indexedKey];
    denormalzed[indexedKey] = Array.isArray(entity)
      ? entity.map(embedEntity)
      : embedEntity(entity);
    return denormalzed;
  }, {} as C extends any[] ? IndexedEntities<Array<C[number] & M>> : IndexedEntities<C & M>);
};

export {
  indexByKey,
  denormalize
}
