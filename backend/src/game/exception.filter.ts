import { Catch, ArgumentsHost, Logger } from '@nestjs/common';
import { BaseWsExceptionFilter, WsException } from '@nestjs/websockets';

@Catch()
export class AllExceptionsFilter extends BaseWsExceptionFilter {
    private logger: Logger = new Logger();

    catch(exception: unknown, host: ArgumentsHost) {
        super.catch(exception, host);
        const err = {
            status: 'error',
            message:
                exception instanceof WsException
                    ? exception.message
                    : 'Internal server error',
        };
        const callback = host.getArgByIndex(2);
        if (callback && typeof callback === 'function') {
            callback(err);
        }
    }
}
