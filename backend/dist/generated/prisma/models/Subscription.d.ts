import type * as runtime from "@prisma/client/runtime/library";
import type * as Prisma from "../internal/prismaNamespace";
export type SubscriptionModel = runtime.Types.Result.DefaultSelection<Prisma.$SubscriptionPayload>;
export type AggregateSubscription = {
    _count: SubscriptionCountAggregateOutputType | null;
    _min: SubscriptionMinAggregateOutputType | null;
    _max: SubscriptionMaxAggregateOutputType | null;
};
export type SubscriptionMinAggregateOutputType = {
    id: string | null;
    userId: string | null;
    planId: string | null;
    isActive: boolean | null;
    createdAt: Date | null;
};
export type SubscriptionMaxAggregateOutputType = {
    id: string | null;
    userId: string | null;
    planId: string | null;
    isActive: boolean | null;
    createdAt: Date | null;
};
export type SubscriptionCountAggregateOutputType = {
    id: number;
    userId: number;
    planId: number;
    isActive: number;
    createdAt: number;
    _all: number;
};
export type SubscriptionMinAggregateInputType = {
    id?: true;
    userId?: true;
    planId?: true;
    isActive?: true;
    createdAt?: true;
};
export type SubscriptionMaxAggregateInputType = {
    id?: true;
    userId?: true;
    planId?: true;
    isActive?: true;
    createdAt?: true;
};
export type SubscriptionCountAggregateInputType = {
    id?: true;
    userId?: true;
    planId?: true;
    isActive?: true;
    createdAt?: true;
    _all?: true;
};
export type SubscriptionAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.SubscriptionWhereInput;
    orderBy?: Prisma.SubscriptionOrderByWithRelationInput | Prisma.SubscriptionOrderByWithRelationInput[];
    cursor?: Prisma.SubscriptionWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | SubscriptionCountAggregateInputType;
    _min?: SubscriptionMinAggregateInputType;
    _max?: SubscriptionMaxAggregateInputType;
};
export type GetSubscriptionAggregateType<T extends SubscriptionAggregateArgs> = {
    [P in keyof T & keyof AggregateSubscription]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateSubscription[P]> : Prisma.GetScalarType<T[P], AggregateSubscription[P]>;
};
export type SubscriptionGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.SubscriptionWhereInput;
    orderBy?: Prisma.SubscriptionOrderByWithAggregationInput | Prisma.SubscriptionOrderByWithAggregationInput[];
    by: Prisma.SubscriptionScalarFieldEnum[] | Prisma.SubscriptionScalarFieldEnum;
    having?: Prisma.SubscriptionScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: SubscriptionCountAggregateInputType | true;
    _min?: SubscriptionMinAggregateInputType;
    _max?: SubscriptionMaxAggregateInputType;
};
export type SubscriptionGroupByOutputType = {
    id: string;
    userId: string;
    planId: string;
    isActive: boolean;
    createdAt: Date;
    _count: SubscriptionCountAggregateOutputType | null;
    _min: SubscriptionMinAggregateOutputType | null;
    _max: SubscriptionMaxAggregateOutputType | null;
};
type GetSubscriptionGroupByPayload<T extends SubscriptionGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<SubscriptionGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof SubscriptionGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], SubscriptionGroupByOutputType[P]> : Prisma.GetScalarType<T[P], SubscriptionGroupByOutputType[P]>;
}>>;
export type SubscriptionWhereInput = {
    AND?: Prisma.SubscriptionWhereInput | Prisma.SubscriptionWhereInput[];
    OR?: Prisma.SubscriptionWhereInput[];
    NOT?: Prisma.SubscriptionWhereInput | Prisma.SubscriptionWhereInput[];
    id?: Prisma.StringFilter<"Subscription"> | string;
    userId?: Prisma.StringFilter<"Subscription"> | string;
    planId?: Prisma.StringFilter<"Subscription"> | string;
    isActive?: Prisma.BoolFilter<"Subscription"> | boolean;
    createdAt?: Prisma.DateTimeFilter<"Subscription"> | Date | string;
    user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
    plan?: Prisma.XOR<Prisma.PlanScalarRelationFilter, Prisma.PlanWhereInput>;
};
export type SubscriptionOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    planId?: Prisma.SortOrder;
    isActive?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    user?: Prisma.UserOrderByWithRelationInput;
    plan?: Prisma.PlanOrderByWithRelationInput;
};
export type SubscriptionWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    userId?: string;
    AND?: Prisma.SubscriptionWhereInput | Prisma.SubscriptionWhereInput[];
    OR?: Prisma.SubscriptionWhereInput[];
    NOT?: Prisma.SubscriptionWhereInput | Prisma.SubscriptionWhereInput[];
    planId?: Prisma.StringFilter<"Subscription"> | string;
    isActive?: Prisma.BoolFilter<"Subscription"> | boolean;
    createdAt?: Prisma.DateTimeFilter<"Subscription"> | Date | string;
    user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
    plan?: Prisma.XOR<Prisma.PlanScalarRelationFilter, Prisma.PlanWhereInput>;
}, "id" | "userId">;
export type SubscriptionOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    planId?: Prisma.SortOrder;
    isActive?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    _count?: Prisma.SubscriptionCountOrderByAggregateInput;
    _max?: Prisma.SubscriptionMaxOrderByAggregateInput;
    _min?: Prisma.SubscriptionMinOrderByAggregateInput;
};
export type SubscriptionScalarWhereWithAggregatesInput = {
    AND?: Prisma.SubscriptionScalarWhereWithAggregatesInput | Prisma.SubscriptionScalarWhereWithAggregatesInput[];
    OR?: Prisma.SubscriptionScalarWhereWithAggregatesInput[];
    NOT?: Prisma.SubscriptionScalarWhereWithAggregatesInput | Prisma.SubscriptionScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"Subscription"> | string;
    userId?: Prisma.StringWithAggregatesFilter<"Subscription"> | string;
    planId?: Prisma.StringWithAggregatesFilter<"Subscription"> | string;
    isActive?: Prisma.BoolWithAggregatesFilter<"Subscription"> | boolean;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"Subscription"> | Date | string;
};
export type SubscriptionCreateInput = {
    id?: string;
    isActive?: boolean;
    createdAt?: Date | string;
    user: Prisma.UserCreateNestedOneWithoutSubscriptionInput;
    plan: Prisma.PlanCreateNestedOneWithoutSubscriptionsInput;
};
export type SubscriptionUncheckedCreateInput = {
    id?: string;
    userId: string;
    planId: string;
    isActive?: boolean;
    createdAt?: Date | string;
};
export type SubscriptionUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    user?: Prisma.UserUpdateOneRequiredWithoutSubscriptionNestedInput;
    plan?: Prisma.PlanUpdateOneRequiredWithoutSubscriptionsNestedInput;
};
export type SubscriptionUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    planId?: Prisma.StringFieldUpdateOperationsInput | string;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type SubscriptionCreateManyInput = {
    id?: string;
    userId: string;
    planId: string;
    isActive?: boolean;
    createdAt?: Date | string;
};
export type SubscriptionUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type SubscriptionUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    planId?: Prisma.StringFieldUpdateOperationsInput | string;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type SubscriptionNullableScalarRelationFilter = {
    is?: Prisma.SubscriptionWhereInput | null;
    isNot?: Prisma.SubscriptionWhereInput | null;
};
export type SubscriptionCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    planId?: Prisma.SortOrder;
    isActive?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type SubscriptionMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    planId?: Prisma.SortOrder;
    isActive?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type SubscriptionMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    planId?: Prisma.SortOrder;
    isActive?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type SubscriptionListRelationFilter = {
    every?: Prisma.SubscriptionWhereInput;
    some?: Prisma.SubscriptionWhereInput;
    none?: Prisma.SubscriptionWhereInput;
};
export type SubscriptionOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type SubscriptionCreateNestedOneWithoutUserInput = {
    create?: Prisma.XOR<Prisma.SubscriptionCreateWithoutUserInput, Prisma.SubscriptionUncheckedCreateWithoutUserInput>;
    connectOrCreate?: Prisma.SubscriptionCreateOrConnectWithoutUserInput;
    connect?: Prisma.SubscriptionWhereUniqueInput;
};
export type SubscriptionUncheckedCreateNestedOneWithoutUserInput = {
    create?: Prisma.XOR<Prisma.SubscriptionCreateWithoutUserInput, Prisma.SubscriptionUncheckedCreateWithoutUserInput>;
    connectOrCreate?: Prisma.SubscriptionCreateOrConnectWithoutUserInput;
    connect?: Prisma.SubscriptionWhereUniqueInput;
};
export type SubscriptionUpdateOneWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.SubscriptionCreateWithoutUserInput, Prisma.SubscriptionUncheckedCreateWithoutUserInput>;
    connectOrCreate?: Prisma.SubscriptionCreateOrConnectWithoutUserInput;
    upsert?: Prisma.SubscriptionUpsertWithoutUserInput;
    disconnect?: Prisma.SubscriptionWhereInput | boolean;
    delete?: Prisma.SubscriptionWhereInput | boolean;
    connect?: Prisma.SubscriptionWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.SubscriptionUpdateToOneWithWhereWithoutUserInput, Prisma.SubscriptionUpdateWithoutUserInput>, Prisma.SubscriptionUncheckedUpdateWithoutUserInput>;
};
export type SubscriptionUncheckedUpdateOneWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.SubscriptionCreateWithoutUserInput, Prisma.SubscriptionUncheckedCreateWithoutUserInput>;
    connectOrCreate?: Prisma.SubscriptionCreateOrConnectWithoutUserInput;
    upsert?: Prisma.SubscriptionUpsertWithoutUserInput;
    disconnect?: Prisma.SubscriptionWhereInput | boolean;
    delete?: Prisma.SubscriptionWhereInput | boolean;
    connect?: Prisma.SubscriptionWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.SubscriptionUpdateToOneWithWhereWithoutUserInput, Prisma.SubscriptionUpdateWithoutUserInput>, Prisma.SubscriptionUncheckedUpdateWithoutUserInput>;
};
export type SubscriptionCreateNestedManyWithoutPlanInput = {
    create?: Prisma.XOR<Prisma.SubscriptionCreateWithoutPlanInput, Prisma.SubscriptionUncheckedCreateWithoutPlanInput> | Prisma.SubscriptionCreateWithoutPlanInput[] | Prisma.SubscriptionUncheckedCreateWithoutPlanInput[];
    connectOrCreate?: Prisma.SubscriptionCreateOrConnectWithoutPlanInput | Prisma.SubscriptionCreateOrConnectWithoutPlanInput[];
    createMany?: Prisma.SubscriptionCreateManyPlanInputEnvelope;
    connect?: Prisma.SubscriptionWhereUniqueInput | Prisma.SubscriptionWhereUniqueInput[];
};
export type SubscriptionUncheckedCreateNestedManyWithoutPlanInput = {
    create?: Prisma.XOR<Prisma.SubscriptionCreateWithoutPlanInput, Prisma.SubscriptionUncheckedCreateWithoutPlanInput> | Prisma.SubscriptionCreateWithoutPlanInput[] | Prisma.SubscriptionUncheckedCreateWithoutPlanInput[];
    connectOrCreate?: Prisma.SubscriptionCreateOrConnectWithoutPlanInput | Prisma.SubscriptionCreateOrConnectWithoutPlanInput[];
    createMany?: Prisma.SubscriptionCreateManyPlanInputEnvelope;
    connect?: Prisma.SubscriptionWhereUniqueInput | Prisma.SubscriptionWhereUniqueInput[];
};
export type SubscriptionUpdateManyWithoutPlanNestedInput = {
    create?: Prisma.XOR<Prisma.SubscriptionCreateWithoutPlanInput, Prisma.SubscriptionUncheckedCreateWithoutPlanInput> | Prisma.SubscriptionCreateWithoutPlanInput[] | Prisma.SubscriptionUncheckedCreateWithoutPlanInput[];
    connectOrCreate?: Prisma.SubscriptionCreateOrConnectWithoutPlanInput | Prisma.SubscriptionCreateOrConnectWithoutPlanInput[];
    upsert?: Prisma.SubscriptionUpsertWithWhereUniqueWithoutPlanInput | Prisma.SubscriptionUpsertWithWhereUniqueWithoutPlanInput[];
    createMany?: Prisma.SubscriptionCreateManyPlanInputEnvelope;
    set?: Prisma.SubscriptionWhereUniqueInput | Prisma.SubscriptionWhereUniqueInput[];
    disconnect?: Prisma.SubscriptionWhereUniqueInput | Prisma.SubscriptionWhereUniqueInput[];
    delete?: Prisma.SubscriptionWhereUniqueInput | Prisma.SubscriptionWhereUniqueInput[];
    connect?: Prisma.SubscriptionWhereUniqueInput | Prisma.SubscriptionWhereUniqueInput[];
    update?: Prisma.SubscriptionUpdateWithWhereUniqueWithoutPlanInput | Prisma.SubscriptionUpdateWithWhereUniqueWithoutPlanInput[];
    updateMany?: Prisma.SubscriptionUpdateManyWithWhereWithoutPlanInput | Prisma.SubscriptionUpdateManyWithWhereWithoutPlanInput[];
    deleteMany?: Prisma.SubscriptionScalarWhereInput | Prisma.SubscriptionScalarWhereInput[];
};
export type SubscriptionUncheckedUpdateManyWithoutPlanNestedInput = {
    create?: Prisma.XOR<Prisma.SubscriptionCreateWithoutPlanInput, Prisma.SubscriptionUncheckedCreateWithoutPlanInput> | Prisma.SubscriptionCreateWithoutPlanInput[] | Prisma.SubscriptionUncheckedCreateWithoutPlanInput[];
    connectOrCreate?: Prisma.SubscriptionCreateOrConnectWithoutPlanInput | Prisma.SubscriptionCreateOrConnectWithoutPlanInput[];
    upsert?: Prisma.SubscriptionUpsertWithWhereUniqueWithoutPlanInput | Prisma.SubscriptionUpsertWithWhereUniqueWithoutPlanInput[];
    createMany?: Prisma.SubscriptionCreateManyPlanInputEnvelope;
    set?: Prisma.SubscriptionWhereUniqueInput | Prisma.SubscriptionWhereUniqueInput[];
    disconnect?: Prisma.SubscriptionWhereUniqueInput | Prisma.SubscriptionWhereUniqueInput[];
    delete?: Prisma.SubscriptionWhereUniqueInput | Prisma.SubscriptionWhereUniqueInput[];
    connect?: Prisma.SubscriptionWhereUniqueInput | Prisma.SubscriptionWhereUniqueInput[];
    update?: Prisma.SubscriptionUpdateWithWhereUniqueWithoutPlanInput | Prisma.SubscriptionUpdateWithWhereUniqueWithoutPlanInput[];
    updateMany?: Prisma.SubscriptionUpdateManyWithWhereWithoutPlanInput | Prisma.SubscriptionUpdateManyWithWhereWithoutPlanInput[];
    deleteMany?: Prisma.SubscriptionScalarWhereInput | Prisma.SubscriptionScalarWhereInput[];
};
export type SubscriptionCreateWithoutUserInput = {
    id?: string;
    isActive?: boolean;
    createdAt?: Date | string;
    plan: Prisma.PlanCreateNestedOneWithoutSubscriptionsInput;
};
export type SubscriptionUncheckedCreateWithoutUserInput = {
    id?: string;
    planId: string;
    isActive?: boolean;
    createdAt?: Date | string;
};
export type SubscriptionCreateOrConnectWithoutUserInput = {
    where: Prisma.SubscriptionWhereUniqueInput;
    create: Prisma.XOR<Prisma.SubscriptionCreateWithoutUserInput, Prisma.SubscriptionUncheckedCreateWithoutUserInput>;
};
export type SubscriptionUpsertWithoutUserInput = {
    update: Prisma.XOR<Prisma.SubscriptionUpdateWithoutUserInput, Prisma.SubscriptionUncheckedUpdateWithoutUserInput>;
    create: Prisma.XOR<Prisma.SubscriptionCreateWithoutUserInput, Prisma.SubscriptionUncheckedCreateWithoutUserInput>;
    where?: Prisma.SubscriptionWhereInput;
};
export type SubscriptionUpdateToOneWithWhereWithoutUserInput = {
    where?: Prisma.SubscriptionWhereInput;
    data: Prisma.XOR<Prisma.SubscriptionUpdateWithoutUserInput, Prisma.SubscriptionUncheckedUpdateWithoutUserInput>;
};
export type SubscriptionUpdateWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    plan?: Prisma.PlanUpdateOneRequiredWithoutSubscriptionsNestedInput;
};
export type SubscriptionUncheckedUpdateWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    planId?: Prisma.StringFieldUpdateOperationsInput | string;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type SubscriptionCreateWithoutPlanInput = {
    id?: string;
    isActive?: boolean;
    createdAt?: Date | string;
    user: Prisma.UserCreateNestedOneWithoutSubscriptionInput;
};
export type SubscriptionUncheckedCreateWithoutPlanInput = {
    id?: string;
    userId: string;
    isActive?: boolean;
    createdAt?: Date | string;
};
export type SubscriptionCreateOrConnectWithoutPlanInput = {
    where: Prisma.SubscriptionWhereUniqueInput;
    create: Prisma.XOR<Prisma.SubscriptionCreateWithoutPlanInput, Prisma.SubscriptionUncheckedCreateWithoutPlanInput>;
};
export type SubscriptionCreateManyPlanInputEnvelope = {
    data: Prisma.SubscriptionCreateManyPlanInput | Prisma.SubscriptionCreateManyPlanInput[];
    skipDuplicates?: boolean;
};
export type SubscriptionUpsertWithWhereUniqueWithoutPlanInput = {
    where: Prisma.SubscriptionWhereUniqueInput;
    update: Prisma.XOR<Prisma.SubscriptionUpdateWithoutPlanInput, Prisma.SubscriptionUncheckedUpdateWithoutPlanInput>;
    create: Prisma.XOR<Prisma.SubscriptionCreateWithoutPlanInput, Prisma.SubscriptionUncheckedCreateWithoutPlanInput>;
};
export type SubscriptionUpdateWithWhereUniqueWithoutPlanInput = {
    where: Prisma.SubscriptionWhereUniqueInput;
    data: Prisma.XOR<Prisma.SubscriptionUpdateWithoutPlanInput, Prisma.SubscriptionUncheckedUpdateWithoutPlanInput>;
};
export type SubscriptionUpdateManyWithWhereWithoutPlanInput = {
    where: Prisma.SubscriptionScalarWhereInput;
    data: Prisma.XOR<Prisma.SubscriptionUpdateManyMutationInput, Prisma.SubscriptionUncheckedUpdateManyWithoutPlanInput>;
};
export type SubscriptionScalarWhereInput = {
    AND?: Prisma.SubscriptionScalarWhereInput | Prisma.SubscriptionScalarWhereInput[];
    OR?: Prisma.SubscriptionScalarWhereInput[];
    NOT?: Prisma.SubscriptionScalarWhereInput | Prisma.SubscriptionScalarWhereInput[];
    id?: Prisma.StringFilter<"Subscription"> | string;
    userId?: Prisma.StringFilter<"Subscription"> | string;
    planId?: Prisma.StringFilter<"Subscription"> | string;
    isActive?: Prisma.BoolFilter<"Subscription"> | boolean;
    createdAt?: Prisma.DateTimeFilter<"Subscription"> | Date | string;
};
export type SubscriptionCreateManyPlanInput = {
    id?: string;
    userId: string;
    isActive?: boolean;
    createdAt?: Date | string;
};
export type SubscriptionUpdateWithoutPlanInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    user?: Prisma.UserUpdateOneRequiredWithoutSubscriptionNestedInput;
};
export type SubscriptionUncheckedUpdateWithoutPlanInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type SubscriptionUncheckedUpdateManyWithoutPlanInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type SubscriptionSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    userId?: boolean;
    planId?: boolean;
    isActive?: boolean;
    createdAt?: boolean;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    plan?: boolean | Prisma.PlanDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["subscription"]>;
export type SubscriptionSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    userId?: boolean;
    planId?: boolean;
    isActive?: boolean;
    createdAt?: boolean;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    plan?: boolean | Prisma.PlanDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["subscription"]>;
export type SubscriptionSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    userId?: boolean;
    planId?: boolean;
    isActive?: boolean;
    createdAt?: boolean;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    plan?: boolean | Prisma.PlanDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["subscription"]>;
export type SubscriptionSelectScalar = {
    id?: boolean;
    userId?: boolean;
    planId?: boolean;
    isActive?: boolean;
    createdAt?: boolean;
};
export type SubscriptionOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "userId" | "planId" | "isActive" | "createdAt", ExtArgs["result"]["subscription"]>;
export type SubscriptionInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    plan?: boolean | Prisma.PlanDefaultArgs<ExtArgs>;
};
export type SubscriptionIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    plan?: boolean | Prisma.PlanDefaultArgs<ExtArgs>;
};
export type SubscriptionIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    plan?: boolean | Prisma.PlanDefaultArgs<ExtArgs>;
};
export type $SubscriptionPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Subscription";
    objects: {
        user: Prisma.$UserPayload<ExtArgs>;
        plan: Prisma.$PlanPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        userId: string;
        planId: string;
        isActive: boolean;
        createdAt: Date;
    }, ExtArgs["result"]["subscription"]>;
    composites: {};
};
export type SubscriptionGetPayload<S extends boolean | null | undefined | SubscriptionDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$SubscriptionPayload, S>;
export type SubscriptionCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<SubscriptionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: SubscriptionCountAggregateInputType | true;
};
export interface SubscriptionDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Subscription'];
        meta: {
            name: 'Subscription';
        };
    };
    findUnique<T extends SubscriptionFindUniqueArgs>(args: Prisma.SelectSubset<T, SubscriptionFindUniqueArgs<ExtArgs>>): Prisma.Prisma__SubscriptionClient<runtime.Types.Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends SubscriptionFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, SubscriptionFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__SubscriptionClient<runtime.Types.Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends SubscriptionFindFirstArgs>(args?: Prisma.SelectSubset<T, SubscriptionFindFirstArgs<ExtArgs>>): Prisma.Prisma__SubscriptionClient<runtime.Types.Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends SubscriptionFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, SubscriptionFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__SubscriptionClient<runtime.Types.Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends SubscriptionFindManyArgs>(args?: Prisma.SelectSubset<T, SubscriptionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends SubscriptionCreateArgs>(args: Prisma.SelectSubset<T, SubscriptionCreateArgs<ExtArgs>>): Prisma.Prisma__SubscriptionClient<runtime.Types.Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends SubscriptionCreateManyArgs>(args?: Prisma.SelectSubset<T, SubscriptionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends SubscriptionCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, SubscriptionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends SubscriptionDeleteArgs>(args: Prisma.SelectSubset<T, SubscriptionDeleteArgs<ExtArgs>>): Prisma.Prisma__SubscriptionClient<runtime.Types.Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends SubscriptionUpdateArgs>(args: Prisma.SelectSubset<T, SubscriptionUpdateArgs<ExtArgs>>): Prisma.Prisma__SubscriptionClient<runtime.Types.Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends SubscriptionDeleteManyArgs>(args?: Prisma.SelectSubset<T, SubscriptionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends SubscriptionUpdateManyArgs>(args: Prisma.SelectSubset<T, SubscriptionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends SubscriptionUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, SubscriptionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends SubscriptionUpsertArgs>(args: Prisma.SelectSubset<T, SubscriptionUpsertArgs<ExtArgs>>): Prisma.Prisma__SubscriptionClient<runtime.Types.Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends SubscriptionCountArgs>(args?: Prisma.Subset<T, SubscriptionCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], SubscriptionCountAggregateOutputType> : number>;
    aggregate<T extends SubscriptionAggregateArgs>(args: Prisma.Subset<T, SubscriptionAggregateArgs>): Prisma.PrismaPromise<GetSubscriptionAggregateType<T>>;
    groupBy<T extends SubscriptionGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: SubscriptionGroupByArgs['orderBy'];
    } : {
        orderBy?: SubscriptionGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, SubscriptionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSubscriptionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: SubscriptionFieldRefs;
}
export interface Prisma__SubscriptionClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    user<T extends Prisma.UserDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.UserDefaultArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    plan<T extends Prisma.PlanDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.PlanDefaultArgs<ExtArgs>>): Prisma.Prisma__PlanClient<runtime.Types.Result.GetResult<Prisma.$PlanPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface SubscriptionFieldRefs {
    readonly id: Prisma.FieldRef<"Subscription", 'String'>;
    readonly userId: Prisma.FieldRef<"Subscription", 'String'>;
    readonly planId: Prisma.FieldRef<"Subscription", 'String'>;
    readonly isActive: Prisma.FieldRef<"Subscription", 'Boolean'>;
    readonly createdAt: Prisma.FieldRef<"Subscription", 'DateTime'>;
}
export type SubscriptionFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SubscriptionSelect<ExtArgs> | null;
    omit?: Prisma.SubscriptionOmit<ExtArgs> | null;
    include?: Prisma.SubscriptionInclude<ExtArgs> | null;
    where: Prisma.SubscriptionWhereUniqueInput;
};
export type SubscriptionFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SubscriptionSelect<ExtArgs> | null;
    omit?: Prisma.SubscriptionOmit<ExtArgs> | null;
    include?: Prisma.SubscriptionInclude<ExtArgs> | null;
    where: Prisma.SubscriptionWhereUniqueInput;
};
export type SubscriptionFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type SubscriptionFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type SubscriptionFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type SubscriptionCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SubscriptionSelect<ExtArgs> | null;
    omit?: Prisma.SubscriptionOmit<ExtArgs> | null;
    include?: Prisma.SubscriptionInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.SubscriptionCreateInput, Prisma.SubscriptionUncheckedCreateInput>;
};
export type SubscriptionCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.SubscriptionCreateManyInput | Prisma.SubscriptionCreateManyInput[];
    skipDuplicates?: boolean;
};
export type SubscriptionCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SubscriptionSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.SubscriptionOmit<ExtArgs> | null;
    data: Prisma.SubscriptionCreateManyInput | Prisma.SubscriptionCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.SubscriptionIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type SubscriptionUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SubscriptionSelect<ExtArgs> | null;
    omit?: Prisma.SubscriptionOmit<ExtArgs> | null;
    include?: Prisma.SubscriptionInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.SubscriptionUpdateInput, Prisma.SubscriptionUncheckedUpdateInput>;
    where: Prisma.SubscriptionWhereUniqueInput;
};
export type SubscriptionUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.SubscriptionUpdateManyMutationInput, Prisma.SubscriptionUncheckedUpdateManyInput>;
    where?: Prisma.SubscriptionWhereInput;
    limit?: number;
};
export type SubscriptionUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SubscriptionSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.SubscriptionOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.SubscriptionUpdateManyMutationInput, Prisma.SubscriptionUncheckedUpdateManyInput>;
    where?: Prisma.SubscriptionWhereInput;
    limit?: number;
    include?: Prisma.SubscriptionIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type SubscriptionUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SubscriptionSelect<ExtArgs> | null;
    omit?: Prisma.SubscriptionOmit<ExtArgs> | null;
    include?: Prisma.SubscriptionInclude<ExtArgs> | null;
    where: Prisma.SubscriptionWhereUniqueInput;
    create: Prisma.XOR<Prisma.SubscriptionCreateInput, Prisma.SubscriptionUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.SubscriptionUpdateInput, Prisma.SubscriptionUncheckedUpdateInput>;
};
export type SubscriptionDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SubscriptionSelect<ExtArgs> | null;
    omit?: Prisma.SubscriptionOmit<ExtArgs> | null;
    include?: Prisma.SubscriptionInclude<ExtArgs> | null;
    where: Prisma.SubscriptionWhereUniqueInput;
};
export type SubscriptionDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.SubscriptionWhereInput;
    limit?: number;
};
export type SubscriptionDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SubscriptionSelect<ExtArgs> | null;
    omit?: Prisma.SubscriptionOmit<ExtArgs> | null;
    include?: Prisma.SubscriptionInclude<ExtArgs> | null;
};
export {};
