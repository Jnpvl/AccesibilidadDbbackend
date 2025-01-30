export interface PaginationParams {
    tableName: string;     
    orderByColumn: string;
    searchFields?: string[];
}

export interface GetPaginatedData<T> {
    data: T[];
    pagination: Pagination;
}

export interface Pagination {
    page:         number;
    pageSize:     number;
    totalRecords: number;
    totalPages:   number;
}
  