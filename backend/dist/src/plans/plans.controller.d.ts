import { PlansService } from './plans.service';
export declare class PlansController {
    private readonly plansService;
    constructor(plansService: PlansService);
    findAll(): Promise<{
        id: string;
        name: string;
        price: number;
        features: {
            id: string;
            key: string;
            name: string;
        }[];
    }[]>;
}
