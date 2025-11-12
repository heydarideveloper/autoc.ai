import { ConfigService } from '@nestjs/config';
import { AuthenticatedUser } from '../../common/types/authenticated-user';
declare const JwtStrategy_base: new (...args: any) => any;
export declare class JwtStrategy extends JwtStrategy_base {
    constructor(configService: ConfigService);
    validate(payload: AuthenticatedUser): AuthenticatedUser;
}
export {};
