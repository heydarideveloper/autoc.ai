"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryMode = exports.SortOrder = exports.FeedbackScalarFieldEnum = exports.PlanFeatureScalarFieldEnum = exports.FeatureScalarFieldEnum = exports.PlanScalarFieldEnum = exports.SubscriptionScalarFieldEnum = exports.UserScalarFieldEnum = exports.TransactionIsolationLevel = exports.ModelName = exports.AnyNull = exports.JsonNull = exports.DbNull = exports.NullTypes = exports.Decimal = void 0;
const runtime = require("@prisma/client/runtime/index-browser");
exports.Decimal = runtime.Decimal;
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
//# sourceMappingURL=prismaNamespaceBrowser.js.map