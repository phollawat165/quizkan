import type { SchemaOptions } from 'mongoose';

const options = {
    virtuals: true,
    getters: true,
    versionKey: false,
};

export const defaultSchemaOptions: SchemaOptions = {
    toJSON: options,
    toObject: options,
};
