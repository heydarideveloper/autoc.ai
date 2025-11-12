import type * as runtime from "@prisma/client/runtime/library";
import type * as Prisma from "../internal/prismaNamespace";
export type FeedbackModel = runtime.Types.Result.DefaultSelection<Prisma.$FeedbackPayload>;
export type AggregateFeedback = {
    _count: FeedbackCountAggregateOutputType | null;
    _min: FeedbackMinAggregateOutputType | null;
    _max: FeedbackMaxAggregateOutputType | null;
};
export type FeedbackMinAggregateOutputType = {
    id: string | null;
    userId: string | null;
    isPositive: boolean | null;
    context: string | null;
    createdAt: Date | null;
};
export type FeedbackMaxAggregateOutputType = {
    id: string | null;
    userId: string | null;
    isPositive: boolean | null;
    context: string | null;
    createdAt: Date | null;
};
export type FeedbackCountAggregateOutputType = {
    id: number;
    userId: number;
    isPositive: number;
    context: number;
    createdAt: number;
    _all: number;
};
export type FeedbackMinAggregateInputType = {
    id?: true;
    userId?: true;
    isPositive?: true;
    context?: true;
    createdAt?: true;
};
export type FeedbackMaxAggregateInputType = {
    id?: true;
    userId?: true;
    isPositive?: true;
    context?: true;
    createdAt?: true;
};
export type FeedbackCountAggregateInputType = {
    id?: true;
    userId?: true;
    isPositive?: true;
    context?: true;
    createdAt?: true;
    _all?: true;
};
export type FeedbackAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.FeedbackWhereInput;
    orderBy?: Prisma.FeedbackOrderByWithRelationInput | Prisma.FeedbackOrderByWithRelationInput[];
    cursor?: Prisma.FeedbackWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | FeedbackCountAggregateInputType;
    _min?: FeedbackMinAggregateInputType;
    _max?: FeedbackMaxAggregateInputType;
};
export type GetFeedbackAggregateType<T extends FeedbackAggregateArgs> = {
    [P in keyof T & keyof AggregateFeedback]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateFeedback[P]> : Prisma.GetScalarType<T[P], AggregateFeedback[P]>;
};
export type FeedbackGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.FeedbackWhereInput;
    orderBy?: Prisma.FeedbackOrderByWithAggregationInput | Prisma.FeedbackOrderByWithAggregationInput[];
    by: Prisma.FeedbackScalarFieldEnum[] | Prisma.FeedbackScalarFieldEnum;
    having?: Prisma.FeedbackScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: FeedbackCountAggregateInputType | true;
    _min?: FeedbackMinAggregateInputType;
    _max?: FeedbackMaxAggregateInputType;
};
export type FeedbackGroupByOutputType = {
    id: string;
    userId: string;
    isPositive: boolean;
    context: string;
    createdAt: Date;
    _count: FeedbackCountAggregateOutputType | null;
    _min: FeedbackMinAggregateOutputType | null;
    _max: FeedbackMaxAggregateOutputType | null;
};
type GetFeedbackGroupByPayload<T extends FeedbackGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<FeedbackGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof FeedbackGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], FeedbackGroupByOutputType[P]> : Prisma.GetScalarType<T[P], FeedbackGroupByOutputType[P]>;
}>>;
export type FeedbackWhereInput = {
    AND?: Prisma.FeedbackWhereInput | Prisma.FeedbackWhereInput[];
    OR?: Prisma.FeedbackWhereInput[];
    NOT?: Prisma.FeedbackWhereInput | Prisma.FeedbackWhereInput[];
    id?: Prisma.StringFilter<"Feedback"> | string;
    userId?: Prisma.StringFilter<"Feedback"> | string;
    isPositive?: Prisma.BoolFilter<"Feedback"> | boolean;
    context?: Prisma.StringFilter<"Feedback"> | string;
    createdAt?: Prisma.DateTimeFilter<"Feedback"> | Date | string;
    user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
};
export type FeedbackOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    isPositive?: Prisma.SortOrder;
    context?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    user?: Prisma.UserOrderByWithRelationInput;
};
export type FeedbackWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.FeedbackWhereInput | Prisma.FeedbackWhereInput[];
    OR?: Prisma.FeedbackWhereInput[];
    NOT?: Prisma.FeedbackWhereInput | Prisma.FeedbackWhereInput[];
    userId?: Prisma.StringFilter<"Feedback"> | string;
    isPositive?: Prisma.BoolFilter<"Feedback"> | boolean;
    context?: Prisma.StringFilter<"Feedback"> | string;
    createdAt?: Prisma.DateTimeFilter<"Feedback"> | Date | string;
    user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
}, "id">;
export type FeedbackOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    isPositive?: Prisma.SortOrder;
    context?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    _count?: Prisma.FeedbackCountOrderByAggregateInput;
    _max?: Prisma.FeedbackMaxOrderByAggregateInput;
    _min?: Prisma.FeedbackMinOrderByAggregateInput;
};
export type FeedbackScalarWhereWithAggregatesInput = {
    AND?: Prisma.FeedbackScalarWhereWithAggregatesInput | Prisma.FeedbackScalarWhereWithAggregatesInput[];
    OR?: Prisma.FeedbackScalarWhereWithAggregatesInput[];
    NOT?: Prisma.FeedbackScalarWhereWithAggregatesInput | Prisma.FeedbackScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"Feedback"> | string;
    userId?: Prisma.StringWithAggregatesFilter<"Feedback"> | string;
    isPositive?: Prisma.BoolWithAggregatesFilter<"Feedback"> | boolean;
    context?: Prisma.StringWithAggregatesFilter<"Feedback"> | string;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"Feedback"> | Date | string;
};
export type FeedbackCreateInput = {
    id?: string;
    isPositive: boolean;
    context: string;
    createdAt?: Date | string;
    user: Prisma.UserCreateNestedOneWithoutFeedbacksInput;
};
export type FeedbackUncheckedCreateInput = {
    id?: string;
    userId: string;
    isPositive: boolean;
    context: string;
    createdAt?: Date | string;
};
export type FeedbackUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    isPositive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    context?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    user?: Prisma.UserUpdateOneRequiredWithoutFeedbacksNestedInput;
};
export type FeedbackUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    isPositive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    context?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type FeedbackCreateManyInput = {
    id?: string;
    userId: string;
    isPositive: boolean;
    context: string;
    createdAt?: Date | string;
};
export type FeedbackUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    isPositive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    context?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type FeedbackUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    isPositive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    context?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type FeedbackListRelationFilter = {
    every?: Prisma.FeedbackWhereInput;
    some?: Prisma.FeedbackWhereInput;
    none?: Prisma.FeedbackWhereInput;
};
export type FeedbackOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type FeedbackCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    isPositive?: Prisma.SortOrder;
    context?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type FeedbackMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    isPositive?: Prisma.SortOrder;
    context?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type FeedbackMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    isPositive?: Prisma.SortOrder;
    context?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type FeedbackCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.FeedbackCreateWithoutUserInput, Prisma.FeedbackUncheckedCreateWithoutUserInput> | Prisma.FeedbackCreateWithoutUserInput[] | Prisma.FeedbackUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.FeedbackCreateOrConnectWithoutUserInput | Prisma.FeedbackCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.FeedbackCreateManyUserInputEnvelope;
    connect?: Prisma.FeedbackWhereUniqueInput | Prisma.FeedbackWhereUniqueInput[];
};
export type FeedbackUncheckedCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.FeedbackCreateWithoutUserInput, Prisma.FeedbackUncheckedCreateWithoutUserInput> | Prisma.FeedbackCreateWithoutUserInput[] | Prisma.FeedbackUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.FeedbackCreateOrConnectWithoutUserInput | Prisma.FeedbackCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.FeedbackCreateManyUserInputEnvelope;
    connect?: Prisma.FeedbackWhereUniqueInput | Prisma.FeedbackWhereUniqueInput[];
};
export type FeedbackUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.FeedbackCreateWithoutUserInput, Prisma.FeedbackUncheckedCreateWithoutUserInput> | Prisma.FeedbackCreateWithoutUserInput[] | Prisma.FeedbackUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.FeedbackCreateOrConnectWithoutUserInput | Prisma.FeedbackCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.FeedbackUpsertWithWhereUniqueWithoutUserInput | Prisma.FeedbackUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.FeedbackCreateManyUserInputEnvelope;
    set?: Prisma.FeedbackWhereUniqueInput | Prisma.FeedbackWhereUniqueInput[];
    disconnect?: Prisma.FeedbackWhereUniqueInput | Prisma.FeedbackWhereUniqueInput[];
    delete?: Prisma.FeedbackWhereUniqueInput | Prisma.FeedbackWhereUniqueInput[];
    connect?: Prisma.FeedbackWhereUniqueInput | Prisma.FeedbackWhereUniqueInput[];
    update?: Prisma.FeedbackUpdateWithWhereUniqueWithoutUserInput | Prisma.FeedbackUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.FeedbackUpdateManyWithWhereWithoutUserInput | Prisma.FeedbackUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.FeedbackScalarWhereInput | Prisma.FeedbackScalarWhereInput[];
};
export type FeedbackUncheckedUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.FeedbackCreateWithoutUserInput, Prisma.FeedbackUncheckedCreateWithoutUserInput> | Prisma.FeedbackCreateWithoutUserInput[] | Prisma.FeedbackUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.FeedbackCreateOrConnectWithoutUserInput | Prisma.FeedbackCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.FeedbackUpsertWithWhereUniqueWithoutUserInput | Prisma.FeedbackUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.FeedbackCreateManyUserInputEnvelope;
    set?: Prisma.FeedbackWhereUniqueInput | Prisma.FeedbackWhereUniqueInput[];
    disconnect?: Prisma.FeedbackWhereUniqueInput | Prisma.FeedbackWhereUniqueInput[];
    delete?: Prisma.FeedbackWhereUniqueInput | Prisma.FeedbackWhereUniqueInput[];
    connect?: Prisma.FeedbackWhereUniqueInput | Prisma.FeedbackWhereUniqueInput[];
    update?: Prisma.FeedbackUpdateWithWhereUniqueWithoutUserInput | Prisma.FeedbackUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.FeedbackUpdateManyWithWhereWithoutUserInput | Prisma.FeedbackUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.FeedbackScalarWhereInput | Prisma.FeedbackScalarWhereInput[];
};
export type FeedbackCreateWithoutUserInput = {
    id?: string;
    isPositive: boolean;
    context: string;
    createdAt?: Date | string;
};
export type FeedbackUncheckedCreateWithoutUserInput = {
    id?: string;
    isPositive: boolean;
    context: string;
    createdAt?: Date | string;
};
export type FeedbackCreateOrConnectWithoutUserInput = {
    where: Prisma.FeedbackWhereUniqueInput;
    create: Prisma.XOR<Prisma.FeedbackCreateWithoutUserInput, Prisma.FeedbackUncheckedCreateWithoutUserInput>;
};
export type FeedbackCreateManyUserInputEnvelope = {
    data: Prisma.FeedbackCreateManyUserInput | Prisma.FeedbackCreateManyUserInput[];
    skipDuplicates?: boolean;
};
export type FeedbackUpsertWithWhereUniqueWithoutUserInput = {
    where: Prisma.FeedbackWhereUniqueInput;
    update: Prisma.XOR<Prisma.FeedbackUpdateWithoutUserInput, Prisma.FeedbackUncheckedUpdateWithoutUserInput>;
    create: Prisma.XOR<Prisma.FeedbackCreateWithoutUserInput, Prisma.FeedbackUncheckedCreateWithoutUserInput>;
};
export type FeedbackUpdateWithWhereUniqueWithoutUserInput = {
    where: Prisma.FeedbackWhereUniqueInput;
    data: Prisma.XOR<Prisma.FeedbackUpdateWithoutUserInput, Prisma.FeedbackUncheckedUpdateWithoutUserInput>;
};
export type FeedbackUpdateManyWithWhereWithoutUserInput = {
    where: Prisma.FeedbackScalarWhereInput;
    data: Prisma.XOR<Prisma.FeedbackUpdateManyMutationInput, Prisma.FeedbackUncheckedUpdateManyWithoutUserInput>;
};
export type FeedbackScalarWhereInput = {
    AND?: Prisma.FeedbackScalarWhereInput | Prisma.FeedbackScalarWhereInput[];
    OR?: Prisma.FeedbackScalarWhereInput[];
    NOT?: Prisma.FeedbackScalarWhereInput | Prisma.FeedbackScalarWhereInput[];
    id?: Prisma.StringFilter<"Feedback"> | string;
    userId?: Prisma.StringFilter<"Feedback"> | string;
    isPositive?: Prisma.BoolFilter<"Feedback"> | boolean;
    context?: Prisma.StringFilter<"Feedback"> | string;
    createdAt?: Prisma.DateTimeFilter<"Feedback"> | Date | string;
};
export type FeedbackCreateManyUserInput = {
    id?: string;
    isPositive: boolean;
    context: string;
    createdAt?: Date | string;
};
export type FeedbackUpdateWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    isPositive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    context?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type FeedbackUncheckedUpdateWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    isPositive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    context?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type FeedbackUncheckedUpdateManyWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    isPositive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    context?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type FeedbackSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    userId?: boolean;
    isPositive?: boolean;
    context?: boolean;
    createdAt?: boolean;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["feedback"]>;
export type FeedbackSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    userId?: boolean;
    isPositive?: boolean;
    context?: boolean;
    createdAt?: boolean;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["feedback"]>;
export type FeedbackSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    userId?: boolean;
    isPositive?: boolean;
    context?: boolean;
    createdAt?: boolean;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["feedback"]>;
export type FeedbackSelectScalar = {
    id?: boolean;
    userId?: boolean;
    isPositive?: boolean;
    context?: boolean;
    createdAt?: boolean;
};
export type FeedbackOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "userId" | "isPositive" | "context" | "createdAt", ExtArgs["result"]["feedback"]>;
export type FeedbackInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type FeedbackIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type FeedbackIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type $FeedbackPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Feedback";
    objects: {
        user: Prisma.$UserPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        userId: string;
        isPositive: boolean;
        context: string;
        createdAt: Date;
    }, ExtArgs["result"]["feedback"]>;
    composites: {};
};
export type FeedbackGetPayload<S extends boolean | null | undefined | FeedbackDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$FeedbackPayload, S>;
export type FeedbackCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<FeedbackFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: FeedbackCountAggregateInputType | true;
};
export interface FeedbackDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Feedback'];
        meta: {
            name: 'Feedback';
        };
    };
    findUnique<T extends FeedbackFindUniqueArgs>(args: Prisma.SelectSubset<T, FeedbackFindUniqueArgs<ExtArgs>>): Prisma.Prisma__FeedbackClient<runtime.Types.Result.GetResult<Prisma.$FeedbackPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends FeedbackFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, FeedbackFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__FeedbackClient<runtime.Types.Result.GetResult<Prisma.$FeedbackPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends FeedbackFindFirstArgs>(args?: Prisma.SelectSubset<T, FeedbackFindFirstArgs<ExtArgs>>): Prisma.Prisma__FeedbackClient<runtime.Types.Result.GetResult<Prisma.$FeedbackPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends FeedbackFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, FeedbackFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__FeedbackClient<runtime.Types.Result.GetResult<Prisma.$FeedbackPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends FeedbackFindManyArgs>(args?: Prisma.SelectSubset<T, FeedbackFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$FeedbackPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends FeedbackCreateArgs>(args: Prisma.SelectSubset<T, FeedbackCreateArgs<ExtArgs>>): Prisma.Prisma__FeedbackClient<runtime.Types.Result.GetResult<Prisma.$FeedbackPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends FeedbackCreateManyArgs>(args?: Prisma.SelectSubset<T, FeedbackCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends FeedbackCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, FeedbackCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$FeedbackPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends FeedbackDeleteArgs>(args: Prisma.SelectSubset<T, FeedbackDeleteArgs<ExtArgs>>): Prisma.Prisma__FeedbackClient<runtime.Types.Result.GetResult<Prisma.$FeedbackPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends FeedbackUpdateArgs>(args: Prisma.SelectSubset<T, FeedbackUpdateArgs<ExtArgs>>): Prisma.Prisma__FeedbackClient<runtime.Types.Result.GetResult<Prisma.$FeedbackPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends FeedbackDeleteManyArgs>(args?: Prisma.SelectSubset<T, FeedbackDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends FeedbackUpdateManyArgs>(args: Prisma.SelectSubset<T, FeedbackUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends FeedbackUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, FeedbackUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$FeedbackPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends FeedbackUpsertArgs>(args: Prisma.SelectSubset<T, FeedbackUpsertArgs<ExtArgs>>): Prisma.Prisma__FeedbackClient<runtime.Types.Result.GetResult<Prisma.$FeedbackPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends FeedbackCountArgs>(args?: Prisma.Subset<T, FeedbackCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], FeedbackCountAggregateOutputType> : number>;
    aggregate<T extends FeedbackAggregateArgs>(args: Prisma.Subset<T, FeedbackAggregateArgs>): Prisma.PrismaPromise<GetFeedbackAggregateType<T>>;
    groupBy<T extends FeedbackGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: FeedbackGroupByArgs['orderBy'];
    } : {
        orderBy?: FeedbackGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, FeedbackGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetFeedbackGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: FeedbackFieldRefs;
}
export interface Prisma__FeedbackClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    user<T extends Prisma.UserDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.UserDefaultArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface FeedbackFieldRefs {
    readonly id: Prisma.FieldRef<"Feedback", 'String'>;
    readonly userId: Prisma.FieldRef<"Feedback", 'String'>;
    readonly isPositive: Prisma.FieldRef<"Feedback", 'Boolean'>;
    readonly context: Prisma.FieldRef<"Feedback", 'String'>;
    readonly createdAt: Prisma.FieldRef<"Feedback", 'DateTime'>;
}
export type FeedbackFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.FeedbackSelect<ExtArgs> | null;
    omit?: Prisma.FeedbackOmit<ExtArgs> | null;
    include?: Prisma.FeedbackInclude<ExtArgs> | null;
    where: Prisma.FeedbackWhereUniqueInput;
};
export type FeedbackFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.FeedbackSelect<ExtArgs> | null;
    omit?: Prisma.FeedbackOmit<ExtArgs> | null;
    include?: Prisma.FeedbackInclude<ExtArgs> | null;
    where: Prisma.FeedbackWhereUniqueInput;
};
export type FeedbackFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.FeedbackSelect<ExtArgs> | null;
    omit?: Prisma.FeedbackOmit<ExtArgs> | null;
    include?: Prisma.FeedbackInclude<ExtArgs> | null;
    where?: Prisma.FeedbackWhereInput;
    orderBy?: Prisma.FeedbackOrderByWithRelationInput | Prisma.FeedbackOrderByWithRelationInput[];
    cursor?: Prisma.FeedbackWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.FeedbackScalarFieldEnum | Prisma.FeedbackScalarFieldEnum[];
};
export type FeedbackFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.FeedbackSelect<ExtArgs> | null;
    omit?: Prisma.FeedbackOmit<ExtArgs> | null;
    include?: Prisma.FeedbackInclude<ExtArgs> | null;
    where?: Prisma.FeedbackWhereInput;
    orderBy?: Prisma.FeedbackOrderByWithRelationInput | Prisma.FeedbackOrderByWithRelationInput[];
    cursor?: Prisma.FeedbackWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.FeedbackScalarFieldEnum | Prisma.FeedbackScalarFieldEnum[];
};
export type FeedbackFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.FeedbackSelect<ExtArgs> | null;
    omit?: Prisma.FeedbackOmit<ExtArgs> | null;
    include?: Prisma.FeedbackInclude<ExtArgs> | null;
    where?: Prisma.FeedbackWhereInput;
    orderBy?: Prisma.FeedbackOrderByWithRelationInput | Prisma.FeedbackOrderByWithRelationInput[];
    cursor?: Prisma.FeedbackWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.FeedbackScalarFieldEnum | Prisma.FeedbackScalarFieldEnum[];
};
export type FeedbackCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.FeedbackSelect<ExtArgs> | null;
    omit?: Prisma.FeedbackOmit<ExtArgs> | null;
    include?: Prisma.FeedbackInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.FeedbackCreateInput, Prisma.FeedbackUncheckedCreateInput>;
};
export type FeedbackCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.FeedbackCreateManyInput | Prisma.FeedbackCreateManyInput[];
    skipDuplicates?: boolean;
};
export type FeedbackCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.FeedbackSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.FeedbackOmit<ExtArgs> | null;
    data: Prisma.FeedbackCreateManyInput | Prisma.FeedbackCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.FeedbackIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type FeedbackUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.FeedbackSelect<ExtArgs> | null;
    omit?: Prisma.FeedbackOmit<ExtArgs> | null;
    include?: Prisma.FeedbackInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.FeedbackUpdateInput, Prisma.FeedbackUncheckedUpdateInput>;
    where: Prisma.FeedbackWhereUniqueInput;
};
export type FeedbackUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.FeedbackUpdateManyMutationInput, Prisma.FeedbackUncheckedUpdateManyInput>;
    where?: Prisma.FeedbackWhereInput;
    limit?: number;
};
export type FeedbackUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.FeedbackSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.FeedbackOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.FeedbackUpdateManyMutationInput, Prisma.FeedbackUncheckedUpdateManyInput>;
    where?: Prisma.FeedbackWhereInput;
    limit?: number;
    include?: Prisma.FeedbackIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type FeedbackUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.FeedbackSelect<ExtArgs> | null;
    omit?: Prisma.FeedbackOmit<ExtArgs> | null;
    include?: Prisma.FeedbackInclude<ExtArgs> | null;
    where: Prisma.FeedbackWhereUniqueInput;
    create: Prisma.XOR<Prisma.FeedbackCreateInput, Prisma.FeedbackUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.FeedbackUpdateInput, Prisma.FeedbackUncheckedUpdateInput>;
};
export type FeedbackDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.FeedbackSelect<ExtArgs> | null;
    omit?: Prisma.FeedbackOmit<ExtArgs> | null;
    include?: Prisma.FeedbackInclude<ExtArgs> | null;
    where: Prisma.FeedbackWhereUniqueInput;
};
export type FeedbackDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.FeedbackWhereInput;
    limit?: number;
};
export type FeedbackDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.FeedbackSelect<ExtArgs> | null;
    omit?: Prisma.FeedbackOmit<ExtArgs> | null;
    include?: Prisma.FeedbackInclude<ExtArgs> | null;
};
export {};
