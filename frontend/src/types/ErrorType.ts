import { AxiosHeaders } from "axios";


export type TAxiosError = {
    response : {
        data: {
            message: string
        } | undefined;
        status: number;
    };
    config: {
        _retry?: boolean;
        headers: AxiosHeaders
    }
}