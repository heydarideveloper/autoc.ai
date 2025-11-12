"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defineExtension = exports.QueryMode = exports.SortOrder = exports.FeedbackScalarFieldEnum = exports.PlanFeatureScalarFieldEnum = exports.FeatureScalarFieldEnum = exports.PlanScalarFieldEnum = exports.SubscriptionScalarFieldEnum = exports.UserScalarFieldEnum = exports.TransactionIsolationLevel = exports.ModelName = exports.AnyNull = exports.JsonNull = exports.DbNull = exports.NullTypes = exports.prismaVersion = exports.getExtensionContext = exports.Decimal = exports.Sql = exports.raw = exports.join = exports.empty = exports.sql = exports.PrismaClientValidationError = exports.PrismaClientInitializationError = exports.PrismaClientRustPanicError = exports.PrismaClientUnknownRequestError = exports.PrismaClientKnownRequestError = void 0;
const runtime = require("@prisma/client/runtime/library");
exports.PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError;
exports.PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError;
exports.PrismaClientRustPanicError = runtime.PrismaClientRustPanicError;
exports.PrismaClientInitializationError = runtime.PrismaClientInitializationError;
exports.PrismaClientValidationError = runtime.PrismaClientValidationError;
exports.sql = runtime.sqltag;
exports.empty = runtime.empty;
exports.join = runtime.join;
exports.raw = runtime.raw;
exports.Sql = runtime.Sql;
exports.Decimal = runtime.Decimal;
exports.getExtensionContext = runtime.Extensions.getExtensionContext;
exports.prismaVersion = {
    client: "6.19.0",
    engine: "2ba551f319ab1df4bc874a89965d8b3641056773"
};
exports.NullTypes = {
    DbNull: runtime.objectEnumValues.classes.DbNull,
    JsonNull: runtime.objectEnumValues.classes.JsonNull,
    AnyNull: runtime.objectEnumValues.classes.AnyNull,
};
exports.DbNull = runtime.objectEnumValues.instances.DbNull;
exports.JsonNull = runtime.objectEnumValues.instances.JsonNull;
exports.AnyNull = runtime.objectEnumValues.instances.AnyNull;
exports.ModelName = {
    User: 'User',
    Subscription: 'Subscription',
    Plan: 'Plan',
    Feature: 'Feature',
    PlanFeature: 'PlanFeature',
    Feedback: 'Feedback'
};
exports.TransactionIsolationLevel = runtime.makeStrictEnum({
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
});
exports.UserScalarFieldEnum = {
    id: 'id',
    phone: 'phone',
    passwordHash: 'passwordHash',
    isAdmin: 'isAdmin',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.SubscriptionScalarFieldEnum = {
    id: 'id',
    userId: 'userId',
    planId: 'planId',
    isActive: 'isActive',
    createdAt: 'createdAt'
};
exports.PlanScalarFieldEnum = {
    id: 'id',
    name: 'name',
    price: 'price',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.FeatureScalarFieldEnum = {
    id: 'id',
    key: 'key',
    name: 'name',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.PlanFeatureScalarFieldEnum = {
    planId: 'planId',
    featureId: 'featureId'
};
exports.FeedbackScalarFieldEnum = {
    id: 'id',
    userId: 'userId',
    isPositive: 'isPositive',
    context: 'context',
    createdAt: 'createdAt'
};
exports.SortOrder = {
    asc: 'asc',
    desc: 'desc'
};
exports.QueryMode = {
    default: 'default',
    insensitive: 'insensitive'
};
exports.defineExtension = runtime.Extensions.defineExtension;
//# sourceMappingURL=prismaNamespace.js.map