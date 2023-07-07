import type { RouteRecordRaw } from 'vue-router';

export interface Query {
    [key: string]: any;
}

export interface SplitMatchResult {
    query: Query;
    params: Query;
}

export interface SmartRouteMetaOptions {
    handler?: (route: SmartRouteRecord, next: Function) => void;
    matcher?: {
        search: any;
        title: (query: Query) => string;
        routes?: (query: Query) => Promise<any[]>;
    };
}

export interface SmartRouteMeta {
    smart?: SmartRouteMetaOptions;
    level?: number;
}

export type SmartRouteRecord = RouteRecordRaw & {
    meta?: SmartRouteMeta;
    children?: SmartRouteRecord[];
};