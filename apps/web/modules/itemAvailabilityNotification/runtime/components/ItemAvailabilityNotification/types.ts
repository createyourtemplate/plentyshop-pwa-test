export type ConditionType = {
    field: 'availability' | 'stock';
    operator: 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte';
    value: number;
    compareTo?: 'value' | 'current';
}