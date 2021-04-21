import * as L from '@nexys/lib';
import Model from '../../../common/generated/schema';
import { Constraint } from './type';

export const getSuperadmin = () => {
  const data: L.Query.Type.QueryConstraint = {
    filterConstraintsMap: new Map(),
    projectionConstraintsMap: new Map()
  };

  const mutate: L.Query.Type.MutateConstraint = {
    filterConstraintsMap: new Map(),
    dataConstraintsMap: new Map(),
    append: {}
  };
  return { data, mutate };
};

const instanceUuid = process.env.InstanceUuid || '';

// filter on instance and linked entities
export const getAdmin = (): Constraint => {
  const c: [string, L.Query.Type.ProjectionConstraint[]][] = [
    ['Permission', [{ attribute: 'name' }]]
  ];
  const filterConstraints: [string, L.Query.Type.FilterConstraint[]][] = [
    ['Instance', [{ attribute: 'uuid', filterAttribute: instanceUuid }]]
  ];

  Model.forEach(entity => {
    const { fields } = entity;

    const f = fields.find(x => x.type === 'Instance');

    if (f) {
      filterConstraints.push([
        entity.name,
        [
          {
            attribute: 'instance',
            filterAttribute: { uuid: instanceUuid }
          }
        ]
      ]);
    }
  });

  const data: L.Query.Type.QueryConstraint = {
    filterConstraintsMap: new Map(filterConstraints),
    projectionConstraintsMap: new Map(c)
  };

  const mutate: L.Query.Type.MutateConstraint = {
    filterConstraintsMap: new Map(),
    dataConstraintsMap: new Map(),
    append: { instance: { uuid: process.env.instanceUuid } }
  };
  return { data, mutate };
};

// todo here user
// todo2: generate these when logging in, upon refresh token get the newest set
export const getApp = (): Constraint => {
  const data: L.Query.Type.QueryConstraint = {
    filterConstraintsMap: new Map([
      [
        'Instance',
        [{ attribute: 'uuid', filterAttribute: process.env.InstanceUuid || '' }]
      ]
    ]),
    projectionConstraintsMap: new Map()
  };

  const mutate: L.Query.Type.MutateConstraint = {
    filterConstraintsMap: new Map(),
    dataConstraintsMap: new Map(),
    append: { instance: { uuid: process.env.instanceUuid } }
  };
  return { data, mutate };
};