"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("../generated/prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    const featuresData = [
        { key: 'CAN_USE_ASSISTANT', name: 'AI Assistant Access' },
        { key: 'CAN_IMPORT_EXCEL', name: 'Import from Excel' },
        { key: 'CAN_CREATE_MANUAL_PRODUCT', name: 'Manual Product Creation' },
    ];
    const features = await Promise.all(featuresData.map((feature) => prisma.feature.upsert({
        where: { key: feature.key },
        update: { name: feature.name },
        create: feature,
    })));
    const freePlan = await prisma.plan.upsert({
        where: { name: 'Free' },
        update: { price: 0 },
        create: {
            name: 'Free',
            price: 0,
        },
    });
    const proPlan = await prisma.plan.upsert({
        where: { name: 'Pro' },
        update: {},
        create: {
            name: 'Pro',
            price: 990000,
        },
    });
    const featureMap = new Map(features.map((feature) => [feature.key, feature]));
    await prisma.planFeature.upsert({
        where: {
            planId_featureId: {
                planId: freePlan.id,
                featureId: featureMap.get('CAN_USE_ASSISTANT').id,
            },
        },
        update: {},
        create: {
            planId: freePlan.id,
            featureId: featureMap.get('CAN_USE_ASSISTANT').id,
        },
    });
    for (const feature of features) {
        await prisma.planFeature.upsert({
            where: {
                planId_featureId: {
                    planId: proPlan.id,
                    featureId: feature.id,
                },
            },
            update: {},
            create: {
                planId: proPlan.id,
                featureId: feature.id,
            },
        });
    }
}
main()
    .catch((error) => {
    console.error(error);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map