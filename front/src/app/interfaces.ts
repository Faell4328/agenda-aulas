export interface returnApi{
    message: string | null;
    redirect: string | null;
    data: any | any[] | null;
}

export interface lesson{
    id: string;
    name: string;
    day: number;
    month: number;
    year: number;
    start_time: number;
    finish_time: number;
    current_quantity: number;
    max_quantity: number;
}