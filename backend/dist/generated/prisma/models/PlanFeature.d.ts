import type * as runtime from "@prisma/client/runtime/library";
import type * as Prisma from "../internal/prismaNamespace";
export type PlanFeatureModel = runtime.Types.Result.DefaultSelection<Prisma.$PlanFeaturePayload>;
export type AggregatePlanFeature = {
    _count: PlanFeatureCountAggregateOutputType | null;
    _min: PlanFeatureMinAggregateOutputType | null;
    _max: PlanFeatureMaxAggregateOutputType | null;
};
export type PlanFeatureMinAggregateOutputType = {
    planId: string | null;
    featureId: string | null;
};
export type PlanFeatureMaxAggregateOutputType = {
    planId: string | null;
    featureId: string | null;
};
export type PlanFeatureCountAggregateOutputType = {
    planId: number;
    featureId: number;
    _all: number;
};
export type PlanFeatureMinAggregateInputType = {
    planId?: true;
    featureId?: true;
};
export type PlanFeatureMaxAggregateInputType = {
    planId?: true;
    featureId?: true;
};
export type PlanFeatureCountAggregateInputType = {
    planId?: true;
    featureId?: true;
    _all?: true;
};
export type PlanFeatureAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.PlanFeatureWhereInput;
    orderBy?: Prisma.PlanFeatureOrderByWithRelationInput | Prisma.PlanFeatureOrderByWithRelationInput[];
    cursor?: Prisma.PlanFeatureWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | PlanFeatureCountAggregateInputType;
    _min?: PlanFeatureMinAggregateInputType;
    _max?: PlanFeatureMaxAggregateInputType;
};
export type GetPlanFeatureAggregateType<T extends PlanFeatureAggregateArgs> = {
    [P in keyof T & keyof AggregatePlanFeature]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregatePlanFeature[P]> : Prisma.GetScalarType<T[P], AggregatePlanFeature[P]>;
};
export type PlanFeatureGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.PlanFeatureWhereInput;
    orderBy?: Prisma.PlanFeatureOrderByWithAggregationInput | Prisma.PlanFeatureOrderByWithAggregationInput[];
    by: Prisma.PlanFeatureScalarFieldEnum[] | Prisma.PlanFeatureScalarFieldEnum;
    having?: Prisma.PlanFeatureScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: PlanFeatureCountAggregateInputType | true;
    _min?: PlanFeatureMinAggregateInputType;
    _max?: PlanFeatureMaxAggregateInputType;
};
export type PlanFeatureGroupByOutputType = {
    planId: string;
    featureId: string;
    _count: PlanFeatureCountAggregateOutputType | null;
    _min: PlanFeatureMinAggregateOutputType | null;
    _max: PlanFeatureMaxAggregateOutputType | null;
};
type GetPlanFeatureGroupByPayload<T extends PlanFeatureGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<PlanFeatureGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof PlanFeatureGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], PlanFeatureGroupByOutputType[P]> : Prisma.GetScalarType<T[P], PlanFeatureGroupByOutputType[P]>;
}>>;
export type PlanFeatureWhereInput = {
    AND?: Prisma.PlanFeatureWhereInput | Prisma.PlanFeatureWhereInput[];
    OR?: Prisma.PlanFeatureWhereInput[];
    NOT?: Prisma.PlanFeatureWhereInput | Prisma.PlanFeatureWhereInput[];
    planId?: Prisma.StringFilter<"PlanFeature"> | string;
    featureId?: Prisma.StringFilter<"PlanFeature"> | string;
    plan?: Prisma.XOR<Prisma.PlanScalarRelationFilter, Prisma.PlanWhereInput>;
    feature?: Prisma.XOR<Prisma.FeatureScalarRelationFilter, Prisma.FeatureWhereInput>;
};
export type PlanFeatureOrderByWithRelationInput = {
    planId?: Prisma.SortOrder;
    featureId?: Prisma.SortOrder;
    plan?: Prisma.PlanOrderByWithRelationInput;
    feature?: Prisma.FeatureOrderByWithRelationInput;
};
export type PlanFeatureWhereUniqueInput = Prisma.AtLeast<{
    planId_featureId?: Prisma.PlanFeaturePlanIdFeatureIdCompoundUniqueInput;
    AND?: Prisma.PlanFeatureWhereInput | Prisma.PlanFeatureWhereInput[];
    OR?: Prisma.PlanFeatureWhereInput[];
    NOT?: Prisma.PlanFeatureWhereInput | Prisma.PlanFeatureWhereInput[];
    planId?: Prisma.StringFilter<"PlanFeature"> | string;
    featureId?: Prisma.StringFilter<"PlanFeature"> | string;
    plan?: Prisma.XOR<Prisma.PlanScalarRelationFilter, Prisma.PlanWhereInput>;
    feature?: Prisma.XOR<Prisma.FeatureScalarRelationFilter, Prisma.FeatureWhereInput>;
}, "planId_featureId">;
export type PlanFeatureOrderByWithAggregationInput = {
    planId?: Prisma.SortOrder;
    featureId?: Prisma.SortOrder;
    _count?: Prisma.PlanFeatureCountOrderByAggregateInput;
    _max?: Prisma.PlanFeatureMaxOrderByAggregateInput;
    _min?: Prisma.PlanFeatureMinOrderByAggregateInput;
};
export type PlanFeatureScalarWhereWithAggregatesInput = {
    AND?: Prisma.PlanFeatureScalarWhereWithAggregatesInput | Prisma.PlanFeatureScalarWhereWithAggregatesInput[];
    OR?: Prisma.PlanFeatureScalarWhereWithAggregatesInput[];
    NOT?: Prisma.PlanFeatureScalarWhereWithAggregatesInput | Prisma.PlanFeatureScalarWhereWithAggregatesInput[];
    planId?: Prisma.StringWithAggregatesFilter<"PlanFeature"> | string;
    featureId?: Prisma.StringWithAggregatesFilter<"PlanFeature"> | string;
};
export type PlanFeatureCreateInput = {
    plan: Prisma.PlanCreateNestedOneWithoutPlanFeaturesInput;
    feature: Prisma.FeatureCreateNestedOneWithoutPlanFeaturesInput;
};
export type PlanFeatureUncheckedCreateInput = {
    planId: string;
    featureId: string;
};
export type PlanFeatureUpdateInput = {
    plan?: Prisma.PlanUpdateOneRequiredWithoutPlanFeaturesNestedInput;
    feature?: Prisma.FeatureUpdateOneRequiredWithoutPlanFeaturesNestedInput;
};
export type PlanFeatureUncheckedUpdateInput = {
    planId?: Prisma.StringFieldUpdateOperationsInput | string;
    featureId?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type PlanFeatureCreateManyInput = {
    planId: string;
    featureId: string;
};
export type PlanFeatureUpdateManyMutationInput = {};
export type PlanFeatureUncheckedUpdateManyInput = {
    planId?: Prisma.StringFieldUpdateOperationsInput | string;
    featureId?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type PlanFeatureListRelationFilter = {
    every?: Prisma.PlanFeatureWhereInput;
    some?: Prisma.PlanFeatureWhereInput;
    none?: Prisma.PlanFeatureWhereInput;
};
export type PlanFeatureOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type PlanFeaturePlanIdFeatureIdCompoundUniqueInput = {
    planId: string;
    featureId: string;
};
export type PlanFeatureCountOrderByAggregateInput = {
    planId?: Prisma.SortOrder;
    featureId?: Prisma.SortOrder;
};
export type PlanFeatureMaxOrderByAggregateInput = {
    planId?: Prisma.SortOrder;
    featureId?: Prisma.SortOrder;
};
export type PlanFeatureMinOrderByAggregateInput = {
    planId?: Prisma.SortOrder;
    featureId?: Prisma.SortOrder;
};
export type PlanFeatureCreateNestedManyWithoutPlanInput = {
    create?: Prisma.XOR<Prisma.PlanFeatureCreateWithoutPlanInput, Prisma.PlanFeatureUncheckedCreateWithoutPlanInput> | Prisma.PlanFeatureCreateWithoutPlanInput[] | Prisma.PlanFeatureUncheckedCreateWithoutPlanInput[];
    connectOrCreate?: Prisma.PlanFeatureCreateOrConnectWithoutPlanInput | Prisma.PlanFeatureCreateOrConnectWithoutPlanInput[];
    createMany?: Prisma.PlanFeatureCreateManyPlanInputEnvelope;
    connect?: Prisma.PlanFeatureWhereUniqueInput | Prisma.PlanFeatureWhereUniqueInput[];
};
export type PlanFeatureUncheckedCreateNestedManyWithoutPlanInput = {
    create?: Prisma.XOR<Prisma.PlanFeatureCreateWithoutPlanInput, Prisma.PlanFeatureUncheckedCreateWithoutPlanInput> | Prisma.PlanFeatureCreateWithoutPlanInput[] | Prisma.PlanFeatureUncheckedCreateWithoutPlanInput[];
    connectOrCreate?: Prisma.PlanFeatureCreateOrConnectWithoutPlanInput | Prisma.PlanFeatureCreateOrConnectWithoutPlanInput[];
    createMany?: Prisma.PlanFeatureCreateManyPlanInputEnvelope;
    connect?: Prisma.PlanFeatureWhereUniqueInput | Prisma.PlanFeatureWhereUniqueInput[];
};
export type PlanFeatureUpdateManyWithoutPlanNestedInput = {
    create?: Prisma.XOR<Prisma.PlanFeatureCreateWithoutPlanInput, Prisma.PlanFeatureUncheckedCreateWithoutPlanInput> | Prisma.PlanFeatureCreateWithoutPlanInput[] | Prisma.PlanFeatureUncheckedCreateWithoutPlanInput[];
    connectOrCreate?: Prisma.PlanFeatureCreateOrConnectWithoutPlanInput | Prisma.PlanFeatureCreateOrConnectWithoutPlanInput[];
    upsert?: Prisma.PlanFeatureUpsertWithWhereUniqueWithoutPlanInput | Prisma.PlanFeatureUpsertWithWhereUniqueWithoutPlanInput[];
    createMany?: Prisma.PlanFeatureCreateManyPlanInputEnvelope;
    set?: Prisma.PlanFeatureWhereUniqueInput | Prisma.PlanFeatureWhereUniqueInput[];
    disconnect?: Prisma.PlanFeatureWhereUniqueInput | Prisma.PlanFeatureWhereUniqueInput[];
    delete?: Prisma.PlanFeatureWhereUniqueInput | Prisma.PlanFeatureWhereUniqueInput[];
    connect?: Prisma.PlanFeatureWhereUniqueInput | Prisma.PlanFeatureWhereUniqueInput[];
    update?: Prisma.PlanFeatureUpdateWithWhereUniqueWithoutPlanInput | Prisma.PlanFeatureUpdateWithWhereUniqueWithoutPlanInput[];
    updateMany?: Prisma.PlanFeatureUpdateManyWithWhereWithoutPlanInput | Prisma.PlanFeatureUpdateManyWithWhereWithoutPlanInput[];
    deleteMany?: Prisma.PlanFeatureScalarWhereInput | Prisma.PlanFeatureScalarWhereInput[];
};
export type PlanFeatureUncheckedUpdateManyWithoutPlanNestedInput = {
    create?: Prisma.XOR<Prisma.PlanFeatureCreateWithoutPlanInput, Prisma.PlanFeatureUncheckedCreateWithoutPlanInput> | Prisma.PlanFeatureCreateWithoutPlanInput[] | Prisma.PlanFeatureUncheckedCreateWithoutPlanInput[];
    connectOrCreate?: Prisma.PlanFeatureCreateOrConnectWithoutPlanInput | Prisma.PlanFeatureCreateOrConnectWithoutPlanInput[];
    upsert?: Prisma.PlanFeatureUpsertWithWhereUniqueWithoutPlanInput | Prisma.PlanFeatureUpsertWithWhereUniqueWithoutPlanInput[];
    createMany?: Prisma.PlanFeatureCreateManyPlanInputEnvelope;
    set?: Prisma.PlanFeatureWhereUniqueInput | Prisma.PlanFeatureWhereUniqueInput[];
    disconnect?: Prisma.PlanFeatureWhereUniqueInput | Prisma.PlanFeatureWhereUniqueInput[];
    delete?: Prisma.PlanFeatureWhereUniqueInput | Prisma.PlanFeatureWhereUniqueInput[];
    connect?: Prisma.PlanFeatureWhereUniqueInput | Prisma.PlanFeatureWhereUniqueInput[];
    update?: Prisma.PlanFeatureUpdateWithWhereUniqueWithoutPlanInput | Prisma.PlanFeatureUpdateWithWhereUniqueWithoutPlanInput[];
    updateMany?: Prisma.PlanFeatureUpdateManyWithWhereWithoutPlanInput | Prisma.PlanFeatureUpdateManyWithWhereWithoutPlanInput[];
    deleteMany?: Prisma.PlanFeatureScalarWhereInput | Prisma.PlanFeatureScalarWhereInput[];
};
export type PlanFeatureCreateNestedManyWithoutFeatureInput = {
    create?: Prisma.XOR<Prisma.PlanFeatureCreateWithoutFeatureInput, Prisma.PlanFeatureUncheckedCreateWithoutFeatureInput> | Prisma.PlanFeatureCreateWithoutFeatureInput[] | Prisma.PlanFeatureUncheckedCreateWithoutFeatureInput[];
    connectOrCreate?: Prisma.PlanFeatureCreateOrConnectWithoutFeatureInput | Prisma.PlanFeatureCreateOrConnectWithoutFeatureInput[];
    createMany?: Prisma.PlanFeatureCreateManyFeatureInputEnvelope;
    connect?: Prisma.PlanFeatureWhereUniqueInput | Prisma.PlanFeatureWhereUniqueInput[];
};
export type PlanFeatureUncheckedCreateNestedManyWithoutFeatureInput = {
    create?: Prisma.XOR<Prisma.PlanFeatureCreateWithoutFeatureInput, Prisma.PlanFeatureUncheckedCreateWithoutFeatureInput> | Prisma.PlanFeatureCreateWithoutFeatureInput[] | Prisma.PlanFeatureUncheckedCreateWithoutFeatureInput[];
    connectOrCreate?: Prisma.PlanFeatureCreateOrConnectWithoutFeatureInput | Prisma.PlanFeatureCreateOrConnectWithoutFeatureInput[];
    createMany?: Prisma.PlanFeatureCreateManyFeatureInputEnvelope;
    connect?: Prisma.PlanFeatureWhereUniqueInput | Prisma.PlanFeatureWhereUniqueInput[];
};
export type PlanFeatureUpdateManyWithoutFeatureNestedInput = {
    create?: Prisma.XOR<Prisma.PlanFeatureCreateWithoutFeatureInput, Prisma.PlanFeatureUncheckedCreateWithoutFeatureInput> | Prisma.PlanFeatureCreateWithoutFeatureInput[] | Prisma.PlanFeatureUncheckedCreateWithoutFeatureInput[];
    connectOrCreate?: Prisma.PlanFeatureCreateOrConnectWithoutFeatureInput | Prisma.PlanFeatureCreateOrConnectWithoutFeatureInput[];
    upsert?: Prisma.PlanFeatureUpsertWithWhereUniqueWithoutFeatureInput | Prisma.PlanFeatureUpsertWithWhereUniqueWithoutFeatureInput[];
    createMany?: Prisma.PlanFeatureCreateManyFeatureInputEnvelope;
    set?: Prisma.PlanFeatureWhereUniqueInput | Prisma.PlanFeatureWhereUniqueInput[];
    disconnect?: Prisma.PlanFeatureWhereUniqueInput | Prisma.PlanFeatureWhereUniqueInput[];
    delete?: Prisma.PlanFeatureWhereUniqueInput | Prisma.PlanFeatureWhereUniqueInput[];
    connect?: Prisma.PlanFeatureWhereUniqueInput | Prisma.PlanFeatureWhereUniqueInput[];
    update?: Prisma.PlanFeatureUpdateWithWhereUniqueWithoutFeatureInput | Prisma.PlanFeatureUpdateWithWhereUniqueWithoutFeatureInput[];
    updateMany?: Prisma.PlanFeatureUpdateManyWithWhereWithoutFeatureInput | Prisma.PlanFeatureUpdateManyWithWhereWithoutFeatureInput[];
    deleteMany?: Prisma.PlanFeatureScalarWhereInput | Prisma.PlanFeatureScalarWhereInput[];
};
export type PlanFeatureUncheckedUpdateManyWithoutFeatureNestedInput = {
    create?: Prisma.XOR<Prisma.PlanFeatureCreateWithoutFeatureInput, Prisma.PlanFeatureUncheckedCreateWithoutFeatureInput> | Prisma.PlanFeatureCreateWithoutFeatureInput[] | Prisma.PlanFeatureUncheckedCreateWithoutFeatureInput[];
    connectOrCreate?: Prisma.PlanFeatureCreateOrConnectWithoutFeatureInput | Prisma.PlanFeatureCreateOrConnectWithoutFeatureInput[];
    upsert?: Prisma.PlanFeatureUpsertWithWhereUniqueWithoutFeatureInput | Prisma.PlanFeatureUpsertWithWhereUniqueWithoutFeatureInput[];
    createMany?: Prisma.PlanFeatureCreateManyFeatureInputEnvelope;
    set?: Prisma.PlanFeatureWhereUniqueInput | Prisma.PlanFeatureWhereUniqueInput[];
    disconnect?: Prisma.PlanFeatureWhereUniqueInput | Prisma.PlanFeatureWhereUniqueInput[];
    delete?: Prisma.PlanFeatureWhereUniqueInput | Prisma.PlanFeatureWhereUniqueInput[];
    connect?: Prisma.PlanFeatureWhereUniqueInput | Prisma.PlanFeatureWhereUniqueInput[];
    update?: Prisma.PlanFeatureUpdateWithWhereUniqueWithoutFeatureInput | Prisma.PlanFeatureUpdateWithWhereUniqueWithoutFeatureInput[];
    updateMany?: Prisma.PlanFeatureUpdateManyWithWhereWithoutFeatureInput | Prisma.PlanFeatureUpdateManyWithWhereWithoutFeatureInput[];
    deleteMany?: Prisma.PlanFeatureScalarWhereInput | Prisma.PlanFeatureScalarWhereInput[];
};
export type PlanFeatureCreateWithoutPlanInput = {
    feature: Prisma.FeatureCreateNestedOneWithoutPlanFeaturesInput;
};
export type PlanFeatureUncheckedCreateWithoutPlanInput = {
    featureId: string;
};
export type PlanFeatureCreateOrConnectWithoutPlanInput = {
    where: Prisma.PlanFeatureWhereUniqueInput;
    create: Prisma.XOR<Prisma.PlanFeatureCreateWithoutPlanInput, Prisma.PlanFeatureUncheckedCreateWithoutPlanInput>;
};
export type PlanFeatureCreateManyPlanInputEnvelope = {
    data: Prisma.PlanFeatureCreateManyPlanInput | Prisma.PlanFeatureCreateManyPlanInput[];
    skipDuplicates?: boolean;
};
export type PlanFeatureUpsertWithWhereUniqueWithoutPlanInput = {
    where: Prisma.PlanFeatureWhereUniqueInput;
    update: Prisma.XOR<Prisma.PlanFeatureUpdateWithoutPlanInput, Prisma.PlanFeatureUncheckedUpdateWithoutPlanInput>;
    create: Prisma.XOR<Prisma.PlanFeatureCreateWithoutPlanInput, Prisma.PlanFeatureUncheckedCreateWithoutPlanInput>;
};
export type PlanFeatureUpdateWithWhereUniqueWithoutPlanInput = {
    where: Prisma.PlanFeatureWhereUniqueInput;
    data: Prisma.XOR<Prisma.PlanFeatureUpdateWithoutPlanInput, Prisma.PlanFeatureUncheckedUpdateWithoutPlanInput>;
};
export type PlanFeatureUpdateManyWithWhereWithoutPlanInput = {
    where: Prisma.PlanFeatureScalarWhereInput;
    data: Prisma.XOR<Prisma.PlanFeatureUpdateManyMutationInput, Prisma.PlanFeatureUncheckedUpdateManyWithoutPlanInput>;
};
export type PlanFeatureScalarWhereInput = {
    AND?: Prisma.PlanFeatureScalarWhereInput | Prisma.PlanFeatureScalarWhereInput[];
    OR?: Prisma.PlanFeatureScalarWhereInput[];
    NOT?: Prisma.PlanFeatureScalarWhereInput | Prisma.PlanFeatureScalarWhereInput[];
    planId?: Prisma.StringFilter<"PlanFeature"> | string;
    featureId?: Prisma.StringFilter<"PlanFeature"> | string;
};
export type PlanFeatureCreateWithoutFeatureInput = {
    plan: Prisma.PlanCreateNestedOneWithoutPlanFeaturesInput;
};
export type PlanFeatureUncheckedCreateWithoutFeatureInput = {
    planId: string;
};
export type PlanFeatureCreateOrConnectWithoutFeatureInput = {
    where: Prisma.PlanFeatureWhereUniqueInput;
    create: Prisma.XOR<Prisma.PlanFeatureCreateWithoutFeatureInput, Prisma.PlanFeatureUncheckedCreateWithoutFeatureInput>;
};
export type PlanFeatureCreateManyFeatureInputEnvelope = {
    data: Prisma.PlanFeatureCreateManyFeatureInput | Prisma.PlanFeatureCreateManyFeatureInput[];
    skipDuplicates?: boolean;
};
export type PlanFeatureUpsertWithWhereUniqueWithoutFeatureInput = {
    where: Prisma.PlanFeatureWhereUniqueInput;
    update: Prisma.XOR<Prisma.PlanFeatureUpdateWithoutFeatureInput, Prisma.PlanFeatureUncheckedUpdateWithoutFeatureInput>;
    create: Prisma.XOR<Prisma.PlanFeatureCreateWithoutFeatureInput, Prisma.PlanFeatureUncheckedCreateWithoutFeatureInput>;
};
export type PlanFeatureUpdateWithWhereUniqueWithoutFeatureInput = {
    where: Prisma.PlanFeatureWhereUniqueInput;
    data: Prisma.XOR<Prisma.PlanFeatureUpdateWithoutFeatureInput, Prisma.PlanFeatureUncheckedUpdateWithoutFeatureInput>;
};
export type PlanFeatureUpdateManyWithWhereWithoutFeatureInput = {
    where: Prisma.PlanFeatureScalarWhereInput;
    data: Prisma.XOR<Prisma.PlanFeatureUpdateManyMutationInput, Prisma.PlanFeatureUncheckedUpdateManyWithoutFeatureInput>;
};
export type PlanFeatureCreateManyPlanInput = {
    featureId: string;
};
export type PlanFeatureUpdateWithoutPlanInput = {
    feature?: Prisma.FeatureUpdateOneRequiredWithoutPlanFeaturesNestedInput;
};
export type PlanFeatureUncheckedUpdateWithoutPlanInput = {
    featureId?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type PlanFeatureUncheckedUpdateManyWithoutPlanInput = {
    featureId?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type PlanFeatureCreateManyFeatureInput = {
    planId: string;
};
export type PlanFeatureUpdateWithoutFeatureInput = {
    plan?: Prisma.PlanUpdateOneRequiredWithoutPlanFeaturesNestedInput;
};
export type PlanFeatureUncheckedUpdateWithoutFeatureInput = {
    planId?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type PlanFeatureUncheckedUpdateManyWithoutFeatureInput = {
    planId?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type PlanFeatureSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    planId?: boolean;
    featureId?: boolean;
    plan?: boolean | Prisma.PlanDefaultArgs<ExtArgs>;
    feature?: boolean | Prisma.FeatureDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["planFeature"]>;
export type PlanFeatureSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    planId?: boolean;
    featureId?: boolean;
    plan?: boolean | Prisma.PlanDefaultArgs<ExtArgs>;
    feature?: boolean | Prisma.FeatureDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["planFeature"]>;
export type PlanFeatureSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    planId?: boolean;
    featureId?: boolean;
    plan?: boolean | Prisma.PlanDefaultArgs<ExtArgs>;
    feature?: boolean | Prisma.FeatureDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["planFeature"]>;
export type PlanFeatureSelectScalar = {
    planId?: boolean;
    featureId?: boolean;
};
export type PlanFeatureOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"planId" | "featureId", ExtArgs["result"]["planFeature"]>;
export type PlanFeatureInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    plan?: boolean | Prisma.PlanDefaultArgs<ExtArgs>;
    feature?: boolean | Prisma.FeatureDefaultArgs<ExtArgs>;
};
export type PlanFeatureIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    plan?: boolean | Prisma.PlanDefaultArgs<ExtArgs>;
    feature?: boolean | Prisma.FeatureDefaultArgs<ExtArgs>;
};
export type PlanFeatureIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    plan?: boolean | Prisma.PlanDefaultArgs<ExtArgs>;
    feature?: boolean | Prisma.FeatureDefaultArgs<ExtArgs>;
};
export type $PlanFeaturePayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "PlanFeature";
    objects: {
        plan: Prisma.$PlanPayload<ExtArgs>;
        feature: Prisma.$FeaturePayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        planId: string;
        featureId: string;
    }, ExtArgs["result"]["planFeature"]>;
    composites: {};
};
export type PlanFeatureGetPayload<S extends boolean | null | undefined | PlanFeatureDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$PlanFeaturePayload, S>;
export type PlanFeatureCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<PlanFeatureFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: PlanFeatureCountAggregateInputType | true;
};
export interface PlanFeatureDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['PlanFeature'];
        meta: {
            name: 'PlanFeature';
        };
    };
    findUnique<T extends PlanFeatureFindUniqueArgs>(args: Prisma.SelectSubset<T, PlanFeatureFindUniqueArgs<ExtArgs>>): Prisma.Prisma__PlanFeatureClient<runtime.Types.Result.GetResult<Prisma.$PlanFeaturePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends PlanFeatureFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, PlanFeatureFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__PlanFeatureClient<runtime.Types.Result.GetResult<Prisma.$PlanFeaturePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends PlanFeatureFindFirstArgs>(args?: Prisma.SelectSubset<T, PlanFeatureFindFirstArgs<ExtArgs>>): Prisma.Prisma__PlanFeatureClient<runtime.Types.Result.GetResult<Prisma.$PlanFeaturePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends PlanFeatureFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, PlanFeatureFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__PlanFeatureClient<runtime.Types.Result.GetResult<Prisma.$PlanFeaturePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends PlanFeatureFindManyArgs>(args?: Prisma.SelectSubset<T, PlanFeatureFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$PlanFeaturePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends PlanFeatureCreateArgs>(args: Prisma.SelectSubset<T, PlanFeatureCreateArgs<ExtArgs>>): Prisma.Prisma__PlanFeatureClient<runtime.Types.Result.GetResult<Prisma.$PlanFeaturePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends PlanFeatureCreateManyArgs>(args?: Prisma.SelectSubset<T, PlanFeatureCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends PlanFeatureCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, PlanFeatureCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$PlanFeaturePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends PlanFeatureDeleteArgs>(args: Prisma.SelectSubset<T, PlanFeatureDeleteArgs<ExtArgs>>): Prisma.Prisma__PlanFeatureClient<runtime.Types.Result.GetResult<Prisma.$PlanFeaturePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends PlanFeatureUpdateArgs>(args: Prisma.SelectSubset<T, PlanFeatureUpdateArgs<ExtArgs>>): Prisma.Prisma__PlanFeatureClient<runtime.Types.Result.GetResult<Prisma.$PlanFeaturePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends PlanFeatureDeleteManyArgs>(args?: Prisma.SelectSubset<T, PlanFeatureDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends PlanFeatureUpdateManyArgs>(args: Prisma.SelectSubset<T, PlanFeatureUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends PlanFeatureUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, PlanFeatureUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$PlanFeaturePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends PlanFeatureUpsertArgs>(args: Prisma.SelectSubset<T, PlanFeatureUpsertArgs<ExtArgs>>): Prisma.Prisma__PlanFeatureClient<runtime.Types.Result.GetResult<Prisma.$PlanFeaturePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends PlanFeatureCountArgs>(args?: Prisma.Subset<T, PlanFeatureCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], PlanFeatureCountAggregateOutputType> : number>;
    aggregate<T extends PlanFeatureAggregateArgs>(args: Prisma.Subset<T, PlanFeatureAggregateArgs>): Prisma.PrismaPromise<GetPlanFeatureAggregateType<T>>;
    groupBy<T extends PlanFeatureGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: PlanFeatureGroupByArgs['orderBy'];
    } : {
        orderBy?: PlanFeatureGroupByArgs['orderBy'];
    }, OrderFields extends Prisma.ExcludeUnderscoreKeys<Prisma.Keys<Prisma.MaybeTupleToUnion<T['orderBy']>>>, ByFields extends Prisma.MaybeTupleToUnion<T['by']>, ByValid extends Prisma.Has<ByFields, OrderFields>, HavingFields extends Prisma.GetHavingFields<T['having']>, HavingValid extends Prisma.Has<ByFields, HavingFields>, ByEmpty extends T['by'] extends never[] ? Prisma.True : Prisma.False, InputErrors extends ByEmpty extends Prisma.True ? `Error: "by" must not be empty.` : HavingValid extends Prisma.False ? {
        [P in HavingFields]: P extends ByFields ? never : P extends string ? `Error: Field "${P}" used in "having" needs to be provided in "by".` : [
            Error,
            'Field ',
            P,
            ` in "having" needs to be provided in "by"`
        ];
    }[HavingFields] : 'take' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "take", you also need to provide "orderBy"' : 'skip' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "skip", you also need to provide "orderBy"' : ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, PlanFeatureGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPlanFeatureGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: PlanFeatureFieldRefs;
}
export interface Prisma__PlanFeatureClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    plan<T extends Prisma.PlanDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.PlanDefaultArgs<ExtArgs>>): Prisma.Prisma__PlanClient<runtime.Types.Result.GetResult<Prisma.$PlanPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    feature<T extends Prisma.FeatureDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.FeatureDefaultArgs<ExtArgs>>): Prisma.Prisma__FeatureClient<runtime.Types.Result.GetResult<Prisma.$FeaturePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface PlanFeatureFieldRefs {
    readonly planId: Prisma.FieldRef<"PlanFeature", 'String'>;
    readonly featureId: Prisma.FieldRef<"PlanFeature", 'String'>;
}
export type PlanFeatureFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PlanFeatureSelect<ExtArgs> | null;
    omit?: Prisma.PlanFeatureOmit<ExtArgs> | null;
    include?: Prisma.PlanFeatureInclude<ExtArgs> | null;
    where: Prisma.PlanFeatureWhereUniqueInput;
};
export type PlanFeatureFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PlanFeatureSelect<ExtArgs> | null;
    omit?: Prisma.PlanFeatureOmit<ExtArgs> | null;
    include?: Prisma.PlanFeatureInclude<ExtArgs> | null;
    where: Prisma.PlanFeatureWhereUniqueInput;
};
export type PlanFeatureFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PlanFeatureSelect<ExtArgs> | null;
    omit?: Prisma.PlanFeatureOmit<ExtArgs> | null;
    include?: Prisma.PlanFeatureInclude<ExtArgs> | null;
    where?: Prisma.PlanFeatureWhereInput;
    orderBy?: Prisma.PlanFeatureOrderByWithRelationInput | Prisma.PlanFeatureOrderByWithRelationInput[];
    cursor?: Prisma.PlanFeatureWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.PlanFeatureScalarFieldEnum | Prisma.PlanFeatureScalarFieldEnum[];
};
export type PlanFeatureFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PlanFeatureSelect<ExtArgs> | null;
    omit?: Prisma.PlanFeatureOmit<ExtArgs> | null;
    include?: Prisma.PlanFeatureInclude<ExtArgs> | null;
    where?: Prisma.PlanFeatureWhereInput;
    orderBy?: Prisma.PlanFeatureOrderByWithRelationInput | Prisma.PlanFeatureOrderByWithRelationInput[];
    cursor?: Prisma.PlanFeatureWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.PlanFeatureScalarFieldEnum | Prisma.PlanFeatureScalarFieldEnum[];
};
export type PlanFeatureFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PlanFeatureSelect<ExtArgs> | null;
    omit?: Prisma.PlanFeatureOmit<ExtArgs> | null;
    include?: Prisma.PlanFeatureInclude<ExtArgs> | null;
    where?: Prisma.PlanFeatureWhereInput;
    orderBy?: Prisma.PlanFeatureOrderByWithRelationInput | Prisma.PlanFeatureOrderByWithRelationInput[];
    cursor?: Prisma.PlanFeatureWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.PlanFeatureScalarFieldEnum | Prisma.PlanFeatureScalarFieldEnum[];
};
export type PlanFeatureCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PlanFeatureSelect<ExtArgs> | null;
    omit?: Prisma.PlanFeatureOmit<ExtArgs> | null;
    include?: Prisma.PlanFeatureInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.PlanFeatureCreateInput, Prisma.PlanFeatureUncheckedCreateInput>;
};
export type PlanFeatureCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.PlanFeatureCreateManyInput | Prisma.PlanFeatureCreateManyInput[];
    skipDuplicates?: boolean;
};
export type PlanFeatureCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PlanFeatureSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.PlanFeatureOmit<ExtArgs> | null;
    data: Prisma.PlanFeatureCreateManyInput | Prisma.PlanFeatureCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.PlanFeatureIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type PlanFeatureUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PlanFeatureSelect<ExtArgs> | null;
    omit?: Prisma.PlanFeatureOmit<ExtArgs> | null;
    include?: Prisma.PlanFeatureInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.PlanFeatureUpdateInput, Prisma.PlanFeatureUncheckedUpdateInput>;
    where: Prisma.PlanFeatureWhereUniqueInput;
};
export type PlanFeatureUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.PlanFeatureUpdateManyMutationInput, Prisma.PlanFeatureUncheckedUpdateManyInput>;
    where?: Prisma.PlanFeatureWhereInput;
    limit?: number;
};
export type PlanFeatureUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PlanFeatureSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.PlanFeatureOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.PlanFeatureUpdateManyMutationInput, Prisma.PlanFeatureUncheckedUpdateManyInput>;
    where?: Prisma.PlanFeatureWhereInput;
    limit?: number;
    include?: Prisma.PlanFeatureIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type PlanFeatureUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PlanFeatureSelect<ExtArgs> | null;
    omit?: Prisma.PlanFeatureOmit<ExtArgs> | null;
    include?: Prisma.PlanFeatureInclude<ExtArgs> | null;
    where: Prisma.PlanFeatureWhereUniqueInput;
    create: Prisma.XOR<Prisma.PlanFeatureCreateInput, Prisma.PlanFeatureUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.PlanFeatureUpdateInput, Prisma.PlanFeatureUncheckedUpdateInput>;
};
export type PlanFeatureDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PlanFeatureSelect<ExtArgs> | null;
    omit?: Prisma.PlanFeatureOmit<ExtArgs> | null;
    include?: Prisma.PlanFeatureInclude<ExtArgs> | null;
    where: Prisma.PlanFeatureWhereUniqueInput;
};
export type PlanFeatureDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.PlanFeatureWhereInput;
    limit?: number;
};
export type PlanFeatureDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PlanFeatureSelect<ExtArgs> | null;
    omit?: Prisma.PlanFeatureOmit<ExtArgs> | null;
    include?: Prisma.PlanFeatureInclude<ExtArgs> | null;
};
export {};
