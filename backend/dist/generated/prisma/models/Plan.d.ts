import type * as runtime from "@prisma/client/runtime/library";
import type * as Prisma from "../internal/prismaNamespace";
export type PlanModel = runtime.Types.Result.DefaultSelection<Prisma.$PlanPayload>;
export type AggregatePlan = {
    _count: PlanCountAggregateOutputType | null;
    _avg: PlanAvgAggregateOutputType | null;
    _sum: PlanSumAggregateOutputType | null;
    _min: PlanMinAggregateOutputType | null;
    _max: PlanMaxAggregateOutputType | null;
};
export type PlanAvgAggregateOutputType = {
    price: number | null;
};
export type PlanSumAggregateOutputType = {
    price: number | null;
};
export type PlanMinAggregateOutputType = {
    id: string | null;
    name: string | null;
    price: number | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type PlanMaxAggregateOutputType = {
    id: string | null;
    name: string | null;
    price: number | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type PlanCountAggregateOutputType = {
    id: number;
    name: number;
    price: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
};
export type PlanAvgAggregateInputType = {
    price?: true;
};
export type PlanSumAggregateInputType = {
    price?: true;
};
export type PlanMinAggregateInputType = {
    id?: true;
    name?: true;
    price?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type PlanMaxAggregateInputType = {
    id?: true;
    name?: true;
    price?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type PlanCountAggregateInputType = {
    id?: true;
    name?: true;
    price?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
};
export type PlanAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.PlanWhereInput;
    orderBy?: Prisma.PlanOrderByWithRelationInput | Prisma.PlanOrderByWithRelationInput[];
    cursor?: Prisma.PlanWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | PlanCountAggregateInputType;
    _avg?: PlanAvgAggregateInputType;
    _sum?: PlanSumAggregateInputType;
    _min?: PlanMinAggregateInputType;
    _max?: PlanMaxAggregateInputType;
};
export type GetPlanAggregateType<T extends PlanAggregateArgs> = {
    [P in keyof T & keyof AggregatePlan]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregatePlan[P]> : Prisma.GetScalarType<T[P], AggregatePlan[P]>;
};
export type PlanGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.PlanWhereInput;
    orderBy?: Prisma.PlanOrderByWithAggregationInput | Prisma.PlanOrderByWithAggregationInput[];
    by: Prisma.PlanScalarFieldEnum[] | Prisma.PlanScalarFieldEnum;
    having?: Prisma.PlanScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: PlanCountAggregateInputType | true;
    _avg?: PlanAvgAggregateInputType;
    _sum?: PlanSumAggregateInputType;
    _min?: PlanMinAggregateInputType;
    _max?: PlanMaxAggregateInputType;
};
export type PlanGroupByOutputType = {
    id: string;
    name: string;
    price: number;
    createdAt: Date;
    updatedAt: Date;
    _count: PlanCountAggregateOutputType | null;
    _avg: PlanAvgAggregateOutputType | null;
    _sum: PlanSumAggregateOutputType | null;
    _min: PlanMinAggregateOutputType | null;
    _max: PlanMaxAggregateOutputType | null;
};
type GetPlanGroupByPayload<T extends PlanGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<PlanGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof PlanGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], PlanGroupByOutputType[P]> : Prisma.GetScalarType<T[P], PlanGroupByOutputType[P]>;
}>>;
export type PlanWhereInput = {
    AND?: Prisma.PlanWhereInput | Prisma.PlanWhereInput[];
    OR?: Prisma.PlanWhereInput[];
    NOT?: Prisma.PlanWhereInput | Prisma.PlanWhereInput[];
    id?: Prisma.StringFilter<"Plan"> | string;
    name?: Prisma.StringFilter<"Plan"> | string;
    price?: Prisma.IntFilter<"Plan"> | number;
    createdAt?: Prisma.DateTimeFilter<"Plan"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Plan"> | Date | string;
    planFeatures?: Prisma.PlanFeatureListRelationFilter;
    subscriptions?: Prisma.SubscriptionListRelationFilter;
};
export type PlanOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    price?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    planFeatures?: Prisma.PlanFeatureOrderByRelationAggregateInput;
    subscriptions?: Prisma.SubscriptionOrderByRelationAggregateInput;
};
export type PlanWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    name?: string;
    AND?: Prisma.PlanWhereInput | Prisma.PlanWhereInput[];
    OR?: Prisma.PlanWhereInput[];
    NOT?: Prisma.PlanWhereInput | Prisma.PlanWhereInput[];
    price?: Prisma.IntFilter<"Plan"> | number;
    createdAt?: Prisma.DateTimeFilter<"Plan"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Plan"> | Date | string;
    planFeatures?: Prisma.PlanFeatureListRelationFilter;
    subscriptions?: Prisma.SubscriptionListRelationFilter;
}, "id" | "name">;
export type PlanOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    price?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.PlanCountOrderByAggregateInput;
    _avg?: Prisma.PlanAvgOrderByAggregateInput;
    _max?: Prisma.PlanMaxOrderByAggregateInput;
    _min?: Prisma.PlanMinOrderByAggregateInput;
    _sum?: Prisma.PlanSumOrderByAggregateInput;
};
export type PlanScalarWhereWithAggregatesInput = {
    AND?: Prisma.PlanScalarWhereWithAggregatesInput | Prisma.PlanScalarWhereWithAggregatesInput[];
    OR?: Prisma.PlanScalarWhereWithAggregatesInput[];
    NOT?: Prisma.PlanScalarWhereWithAggregatesInput | Prisma.PlanScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"Plan"> | string;
    name?: Prisma.StringWithAggregatesFilter<"Plan"> | string;
    price?: Prisma.IntWithAggregatesFilter<"Plan"> | number;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"Plan"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"Plan"> | Date | string;
};
export type PlanCreateInput = {
    id?: string;
    name: string;
    price?: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    planFeatures?: Prisma.PlanFeatureCreateNestedManyWithoutPlanInput;
    subscriptions?: Prisma.SubscriptionCreateNestedManyWithoutPlanInput;
};
export type PlanUncheckedCreateInput = {
    id?: string;
    name: string;
    price?: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    planFeatures?: Prisma.PlanFeatureUncheckedCreateNestedManyWithoutPlanInput;
    subscriptions?: Prisma.SubscriptionUncheckedCreateNestedManyWithoutPlanInput;
};
export type PlanUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    price?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    planFeatures?: Prisma.PlanFeatureUpdateManyWithoutPlanNestedInput;
    subscriptions?: Prisma.SubscriptionUpdateManyWithoutPlanNestedInput;
};
export type PlanUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    price?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    planFeatures?: Prisma.PlanFeatureUncheckedUpdateManyWithoutPlanNestedInput;
    subscriptions?: Prisma.SubscriptionUncheckedUpdateManyWithoutPlanNestedInput;
};
export type PlanCreateManyInput = {
    id?: string;
    name: string;
    price?: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type PlanUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    price?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type PlanUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    price?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type PlanScalarRelationFilter = {
    is?: Prisma.PlanWhereInput;
    isNot?: Prisma.PlanWhereInput;
};
export type PlanCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    price?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type PlanAvgOrderByAggregateInput = {
    price?: Prisma.SortOrder;
};
export type PlanMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    price?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type PlanMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    price?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type PlanSumOrderByAggregateInput = {
    price?: Prisma.SortOrder;
};
export type PlanCreateNestedOneWithoutSubscriptionsInput = {
    create?: Prisma.XOR<Prisma.PlanCreateWithoutSubscriptionsInput, Prisma.PlanUncheckedCreateWithoutSubscriptionsInput>;
    connectOrCreate?: Prisma.PlanCreateOrConnectWithoutSubscriptionsInput;
    connect?: Prisma.PlanWhereUniqueInput;
};
export type PlanUpdateOneRequiredWithoutSubscriptionsNestedInput = {
    create?: Prisma.XOR<Prisma.PlanCreateWithoutSubscriptionsInput, Prisma.PlanUncheckedCreateWithoutSubscriptionsInput>;
    connectOrCreate?: Prisma.PlanCreateOrConnectWithoutSubscriptionsInput;
    upsert?: Prisma.PlanUpsertWithoutSubscriptionsInput;
    connect?: Prisma.PlanWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.PlanUpdateToOneWithWhereWithoutSubscriptionsInput, Prisma.PlanUpdateWithoutSubscriptionsInput>, Prisma.PlanUncheckedUpdateWithoutSubscriptionsInput>;
};
export type IntFieldUpdateOperationsInput = {
    set?: number;
    increment?: number;
    decrement?: number;
    multiply?: number;
    divide?: number;
};
export type PlanCreateNestedOneWithoutPlanFeaturesInput = {
    create?: Prisma.XOR<Prisma.PlanCreateWithoutPlanFeaturesInput, Prisma.PlanUncheckedCreateWithoutPlanFeaturesInput>;
    connectOrCreate?: Prisma.PlanCreateOrConnectWithoutPlanFeaturesInput;
    connect?: Prisma.PlanWhereUniqueInput;
};
export type PlanUpdateOneRequiredWithoutPlanFeaturesNestedInput = {
    create?: Prisma.XOR<Prisma.PlanCreateWithoutPlanFeaturesInput, Prisma.PlanUncheckedCreateWithoutPlanFeaturesInput>;
    connectOrCreate?: Prisma.PlanCreateOrConnectWithoutPlanFeaturesInput;
    upsert?: Prisma.PlanUpsertWithoutPlanFeaturesInput;
    connect?: Prisma.PlanWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.PlanUpdateToOneWithWhereWithoutPlanFeaturesInput, Prisma.PlanUpdateWithoutPlanFeaturesInput>, Prisma.PlanUncheckedUpdateWithoutPlanFeaturesInput>;
};
export type PlanCreateWithoutSubscriptionsInput = {
    id?: string;
    name: string;
    price?: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    planFeatures?: Prisma.PlanFeatureCreateNestedManyWithoutPlanInput;
};
export type PlanUncheckedCreateWithoutSubscriptionsInput = {
    id?: string;
    name: string;
    price?: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    planFeatures?: Prisma.PlanFeatureUncheckedCreateNestedManyWithoutPlanInput;
};
export type PlanCreateOrConnectWithoutSubscriptionsInput = {
    where: Prisma.PlanWhereUniqueInput;
    create: Prisma.XOR<Prisma.PlanCreateWithoutSubscriptionsInput, Prisma.PlanUncheckedCreateWithoutSubscriptionsInput>;
};
export type PlanUpsertWithoutSubscriptionsInput = {
    update: Prisma.XOR<Prisma.PlanUpdateWithoutSubscriptionsInput, Prisma.PlanUncheckedUpdateWithoutSubscriptionsInput>;
    create: Prisma.XOR<Prisma.PlanCreateWithoutSubscriptionsInput, Prisma.PlanUncheckedCreateWithoutSubscriptionsInput>;
    where?: Prisma.PlanWhereInput;
};
export type PlanUpdateToOneWithWhereWithoutSubscriptionsInput = {
    where?: Prisma.PlanWhereInput;
    data: Prisma.XOR<Prisma.PlanUpdateWithoutSubscriptionsInput, Prisma.PlanUncheckedUpdateWithoutSubscriptionsInput>;
};
export type PlanUpdateWithoutSubscriptionsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    price?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    planFeatures?: Prisma.PlanFeatureUpdateManyWithoutPlanNestedInput;
};
export type PlanUncheckedUpdateWithoutSubscriptionsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    price?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    planFeatures?: Prisma.PlanFeatureUncheckedUpdateManyWithoutPlanNestedInput;
};
export type PlanCreateWithoutPlanFeaturesInput = {
    id?: string;
    name: string;
    price?: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    subscriptions?: Prisma.SubscriptionCreateNestedManyWithoutPlanInput;
};
export type PlanUncheckedCreateWithoutPlanFeaturesInput = {
    id?: string;
    name: string;
    price?: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    subscriptions?: Prisma.SubscriptionUncheckedCreateNestedManyWithoutPlanInput;
};
export type PlanCreateOrConnectWithoutPlanFeaturesInput = {
    where: Prisma.PlanWhereUniqueInput;
    create: Prisma.XOR<Prisma.PlanCreateWithoutPlanFeaturesInput, Prisma.PlanUncheckedCreateWithoutPlanFeaturesInput>;
};
export type PlanUpsertWithoutPlanFeaturesInput = {
    update: Prisma.XOR<Prisma.PlanUpdateWithoutPlanFeaturesInput, Prisma.PlanUncheckedUpdateWithoutPlanFeaturesInput>;
    create: Prisma.XOR<Prisma.PlanCreateWithoutPlanFeaturesInput, Prisma.PlanUncheckedCreateWithoutPlanFeaturesInput>;
    where?: Prisma.PlanWhereInput;
};
export type PlanUpdateToOneWithWhereWithoutPlanFeaturesInput = {
    where?: Prisma.PlanWhereInput;
    data: Prisma.XOR<Prisma.PlanUpdateWithoutPlanFeaturesInput, Prisma.PlanUncheckedUpdateWithoutPlanFeaturesInput>;
};
export type PlanUpdateWithoutPlanFeaturesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    price?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    subscriptions?: Prisma.SubscriptionUpdateManyWithoutPlanNestedInput;
};
export type PlanUncheckedUpdateWithoutPlanFeaturesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    price?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    subscriptions?: Prisma.SubscriptionUncheckedUpdateManyWithoutPlanNestedInput;
};
export type PlanCountOutputType = {
    planFeatures: number;
    subscriptions: number;
};
export type PlanCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    planFeatures?: boolean | PlanCountOutputTypeCountPlanFeaturesArgs;
    subscriptions?: boolean | PlanCountOutputTypeCountSubscriptionsArgs;
};
export type PlanCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PlanCountOutputTypeSelect<ExtArgs> | null;
};
export type PlanCountOutputTypeCountPlanFeaturesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.PlanFeatureWhereInput;
};
export type PlanCountOutputTypeCountSubscriptionsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.SubscriptionWhereInput;
};
export type PlanSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    name?: boolean;
    price?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    planFeatures?: boolean | Prisma.Plan$planFeaturesArgs<ExtArgs>;
    subscriptions?: boolean | Prisma.Plan$subscriptionsArgs<ExtArgs>;
    _count?: boolean | Prisma.PlanCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["plan"]>;
export type PlanSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    name?: boolean;
    price?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
}, ExtArgs["result"]["plan"]>;
export type PlanSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    name?: boolean;
    price?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
}, ExtArgs["result"]["plan"]>;
export type PlanSelectScalar = {
    id?: boolean;
    name?: boolean;
    price?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
};
export type PlanOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "name" | "price" | "createdAt" | "updatedAt", ExtArgs["result"]["plan"]>;
export type PlanInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    planFeatures?: boolean | Prisma.Plan$planFeaturesArgs<ExtArgs>;
    subscriptions?: boolean | Prisma.Plan$subscriptionsArgs<ExtArgs>;
    _count?: boolean | Prisma.PlanCountOutputTypeDefaultArgs<ExtArgs>;
};
export type PlanIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {};
export type PlanIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {};
export type $PlanPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Plan";
    objects: {
        planFeatures: Prisma.$PlanFeaturePayload<ExtArgs>[];
        subscriptions: Prisma.$SubscriptionPayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        name: string;
        price: number;
        createdAt: Date;
        updatedAt: Date;
    }, ExtArgs["result"]["plan"]>;
    composites: {};
};
export type PlanGetPayload<S extends boolean | null | undefined | PlanDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$PlanPayload, S>;
export type PlanCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<PlanFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: PlanCountAggregateInputType | true;
};
export interface PlanDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Plan'];
        meta: {
            name: 'Plan';
        };
    };
    findUnique<T extends PlanFindUniqueArgs>(args: Prisma.SelectSubset<T, PlanFindUniqueArgs<ExtArgs>>): Prisma.Prisma__PlanClient<runtime.Types.Result.GetResult<Prisma.$PlanPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends PlanFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, PlanFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__PlanClient<runtime.Types.Result.GetResult<Prisma.$PlanPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends PlanFindFirstArgs>(args?: Prisma.SelectSubset<T, PlanFindFirstArgs<ExtArgs>>): Prisma.Prisma__PlanClient<runtime.Types.Result.GetResult<Prisma.$PlanPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends PlanFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, PlanFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__PlanClient<runtime.Types.Result.GetResult<Prisma.$PlanPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends PlanFindManyArgs>(args?: Prisma.SelectSubset<T, PlanFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$PlanPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends PlanCreateArgs>(args: Prisma.SelectSubset<T, PlanCreateArgs<ExtArgs>>): Prisma.Prisma__PlanClient<runtime.Types.Result.GetResult<Prisma.$PlanPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends PlanCreateManyArgs>(args?: Prisma.SelectSubset<T, PlanCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends PlanCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, PlanCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$PlanPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends PlanDeleteArgs>(args: Prisma.SelectSubset<T, PlanDeleteArgs<ExtArgs>>): Prisma.Prisma__PlanClient<runtime.Types.Result.GetResult<Prisma.$PlanPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends PlanUpdateArgs>(args: Prisma.SelectSubset<T, PlanUpdateArgs<ExtArgs>>): Prisma.Prisma__PlanClient<runtime.Types.Result.GetResult<Prisma.$PlanPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends PlanDeleteManyArgs>(args?: Prisma.SelectSubset<T, PlanDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends PlanUpdateManyArgs>(args: Prisma.SelectSubset<T, PlanUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends PlanUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, PlanUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$PlanPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends PlanUpsertArgs>(args: Prisma.SelectSubset<T, PlanUpsertArgs<ExtArgs>>): Prisma.Prisma__PlanClient<runtime.Types.Result.GetResult<Prisma.$PlanPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends PlanCountArgs>(args?: Prisma.Subset<T, PlanCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], PlanCountAggregateOutputType> : number>;
    aggregate<T extends PlanAggregateArgs>(args: Prisma.Subset<T, PlanAggregateArgs>): Prisma.PrismaPromise<GetPlanAggregateType<T>>;
    groupBy<T extends PlanGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: PlanGroupByArgs['orderBy'];
    } : {
        orderBy?: PlanGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, PlanGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPlanGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: PlanFieldRefs;
}
export interface Prisma__PlanClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    planFeatures<T extends Prisma.Plan$planFeaturesArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Plan$planFeaturesArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$PlanFeaturePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    subscriptions<T extends Prisma.Plan$subscriptionsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Plan$subscriptionsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface PlanFieldRefs {
    readonly id: Prisma.FieldRef<"Plan", 'String'>;
    readonly name: Prisma.FieldRef<"Plan", 'String'>;
    readonly price: Prisma.FieldRef<"Plan", 'Int'>;
    readonly createdAt: Prisma.FieldRef<"Plan", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"Plan", 'DateTime'>;
}
export type PlanFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PlanSelect<ExtArgs> | null;
    omit?: Prisma.PlanOmit<ExtArgs> | null;
    include?: Prisma.PlanInclude<ExtArgs> | null;
    where: Prisma.PlanWhereUniqueInput;
};
export type PlanFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PlanSelect<ExtArgs> | null;
    omit?: Prisma.PlanOmit<ExtArgs> | null;
    include?: Prisma.PlanInclude<ExtArgs> | null;
    where: Prisma.PlanWhereUniqueInput;
};
export type PlanFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PlanSelect<ExtArgs> | null;
    omit?: Prisma.PlanOmit<ExtArgs> | null;
    include?: Prisma.PlanInclude<ExtArgs> | null;
    where?: Prisma.PlanWhereInput;
    orderBy?: Prisma.PlanOrderByWithRelationInput | Prisma.PlanOrderByWithRelationInput[];
    cursor?: Prisma.PlanWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.PlanScalarFieldEnum | Prisma.PlanScalarFieldEnum[];
};
export type PlanFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PlanSelect<ExtArgs> | null;
    omit?: Prisma.PlanOmit<ExtArgs> | null;
    include?: Prisma.PlanInclude<ExtArgs> | null;
    where?: Prisma.PlanWhereInput;
    orderBy?: Prisma.PlanOrderByWithRelationInput | Prisma.PlanOrderByWithRelationInput[];
    cursor?: Prisma.PlanWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.PlanScalarFieldEnum | Prisma.PlanScalarFieldEnum[];
};
export type PlanFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PlanSelect<ExtArgs> | null;
    omit?: Prisma.PlanOmit<ExtArgs> | null;
    include?: Prisma.PlanInclude<ExtArgs> | null;
    where?: Prisma.PlanWhereInput;
    orderBy?: Prisma.PlanOrderByWithRelationInput | Prisma.PlanOrderByWithRelationInput[];
    cursor?: Prisma.PlanWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.PlanScalarFieldEnum | Prisma.PlanScalarFieldEnum[];
};
export type PlanCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PlanSelect<ExtArgs> | null;
    omit?: Prisma.PlanOmit<ExtArgs> | null;
    include?: Prisma.PlanInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.PlanCreateInput, Prisma.PlanUncheckedCreateInput>;
};
export type PlanCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.PlanCreateManyInput | Prisma.PlanCreateManyInput[];
    skipDuplicates?: boolean;
};
export type PlanCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PlanSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.PlanOmit<ExtArgs> | null;
    data: Prisma.PlanCreateManyInput | Prisma.PlanCreateManyInput[];
    skipDuplicates?: boolean;
};
export type PlanUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PlanSelect<ExtArgs> | null;
    omit?: Prisma.PlanOmit<ExtArgs> | null;
    include?: Prisma.PlanInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.PlanUpdateInput, Prisma.PlanUncheckedUpdateInput>;
    where: Prisma.PlanWhereUniqueInput;
};
export type PlanUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.PlanUpdateManyMutationInput, Prisma.PlanUncheckedUpdateManyInput>;
    where?: Prisma.PlanWhereInput;
    limit?: number;
};
export type PlanUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PlanSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.PlanOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.PlanUpdateManyMutationInput, Prisma.PlanUncheckedUpdateManyInput>;
    where?: Prisma.PlanWhereInput;
    limit?: number;
};
export type PlanUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PlanSelect<ExtArgs> | null;
    omit?: Prisma.PlanOmit<ExtArgs> | null;
    include?: Prisma.PlanInclude<ExtArgs> | null;
    where: Prisma.PlanWhereUniqueInput;
    create: Prisma.XOR<Prisma.PlanCreateInput, Prisma.PlanUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.PlanUpdateInput, Prisma.PlanUncheckedUpdateInput>;
};
export type PlanDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PlanSelect<ExtArgs> | null;
    omit?: Prisma.PlanOmit<ExtArgs> | null;
    include?: Prisma.PlanInclude<ExtArgs> | null;
    where: Prisma.PlanWhereUniqueInput;
};
export type PlanDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.PlanWhereInput;
    limit?: number;
};
export type Plan$planFeaturesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type Plan$subscriptionsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SubscriptionSelect<ExtArgs> | null;
    omit?: Prisma.SubscriptionOmit<ExtArgs> | null;
    include?: Prisma.SubscriptionInclude<ExtArgs> | null;
    where?: Prisma.SubscriptionWhereInput;
    orderBy?: Prisma.SubscriptionOrderByWithRelationInput | Prisma.SubscriptionOrderByWithRelationInput[];
    cursor?: Prisma.SubscriptionWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.SubscriptionScalarFieldEnum | Prisma.SubscriptionScalarFieldEnum[];
};
export type PlanDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PlanSelect<ExtArgs> | null;
    omit?: Prisma.PlanOmit<ExtArgs> | null;
    include?: Prisma.PlanInclude<ExtArgs> | null;
};
export {};
